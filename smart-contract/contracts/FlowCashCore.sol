// SPDX-License-Identifier: MIT
pragma solidity ^0.8.26;

import "@openzeppelin/contracts/security/Pausable.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/security/ReentrancyGuard.sol";
import "@openzeppelin/contracts/utils/Counters.sol";
import "@openzeppelin/contracts/utils/math/SafeMath.sol";

/**
 * @title FlowCashCore
 * @dev Main contract for FlowCash P2P transfers and payment processing
 */
contract FlowCashCore is Pausable, Ownable, ReentrancyGuard {
    using Counters for Counters.Counter;
    using SafeMath for uint256;

    // ============ STRUCTS ============
    
    // ============ ENUMS ============
    
    enum PaymentType { P2P, AIRTIME, BILL }
    
    struct Transaction {
        uint256 id;
        address sender;
        address recipient;
        uint256 amount;
        uint256 fee;
        uint256 cashback;
        uint256 timestamp;
        PaymentType paymentType;
        bool isProcessed;
    }

    struct UserStats {
        uint256 totalSent;
        uint256 totalReceived;
        uint256 transactionCount;
        uint256 lastTransactionTime;
    }

    // ============ STATE VARIABLES ============
    
    Counters.Counter private _transactionIds;
    
    // Fee configuration (1.5% = 15 basis points)
    uint256 public constant FEE_RATE = 15; // 1.5% in basis points
    uint256 public constant FEE_DENOMINATOR = 1000;
    
    // Cashback configuration (0.5% = 5 basis points)
    uint256 public constant CASHBACK_RATE = 5; // 0.5% in basis points
    
    // Transaction limits
    uint256 public minTransactionAmount = 1 * 10**18; // 1 ETN
    
    // Fee collection
    uint256 public totalFeesCollected;
    uint256 public totalVolumeProcessed;
    
    // Mappings
    mapping(uint256 => Transaction) public transactions;
    mapping(address => UserStats) public userStats;
    mapping(address => uint256[]) public userTransactionIds;
    
    // Authorized addresses for payment processing
    mapping(address => bool) public authorizedProcessors;
    
    // Fee collector contract
    address public feeCollector;
    
    // ============ EVENTS ============
    
    event ETNSent(
        uint256 indexed transactionId,
        address indexed sender,
        address indexed recipient,
        uint256 amount,
        uint256 fee,
        uint256 cashback,
        PaymentType paymentType
    );
    
    event PaymentProcessed(
        uint256 indexed transactionId,
        address indexed user,
        uint256 amount,
        PaymentType paymentType
    );
    
    event FeeCollected(uint256 amount);
    event FeeDistributed(address indexed recipient, uint256 amount);
    event CashbackDistributed(address indexed user, uint256 amount);
    event TransactionLimitUpdated(uint256 newLimit);
    event AuthorizedProcessorUpdated(address indexed processor, bool authorized);
    event FeeCollectorUpdated(address indexed oldCollector, address indexed newCollector);

    // ============ MODIFIERS ============
    
    modifier onlyAuthorizedProcessor() {
        require(authorizedProcessors[msg.sender], "FlowCash: Not authorized processor");
        _;
    }
    
    modifier validAmount(uint256 amount) {
        require(amount >= minTransactionAmount, "FlowCash: Amount too low");
        // Removed max amount check - no upper limit
        _;
    }
    
    modifier validFeeCollector() {
        require(feeCollector != address(0), "FlowCash: Fee collector not set");
        _;
    }

    // ============ CONSTRUCTOR ============
    
    constructor(address _feeCollector) Ownable() {
        require(_feeCollector != address(0), "FlowCash: Invalid fee collector");
        feeCollector = _feeCollector;
        
        // Set deployer as authorized processor
        authorizedProcessors[msg.sender] = true;
    }

    // ============ CORE FUNCTIONS ============
    
    /**
     * @dev Send ETN to another user (P2P transfer)
     * @param recipient The recipient's address
     */
    function sendETN(address recipient) 
        external 
        payable 
        whenNotPaused 
        nonReentrant 
        validAmount(msg.value) 
        validFeeCollector 
    {
        require(recipient != address(0), "FlowCash: Invalid recipient");
        require(recipient != msg.sender, "FlowCash: Cannot send to self");
        require(msg.value > 0, "FlowCash: Amount must be greater than 0");
        
        // Calculate fee and cashback safely
        uint256 fee = msg.value.mul(FEE_RATE).div(FEE_DENOMINATOR);
        uint256 cashback = msg.value.mul(CASHBACK_RATE).div(FEE_DENOMINATOR);
        uint256 transferAmount = msg.value.sub(fee).add(cashback);
        
        // Ensure transfer amount is positive after fee deduction
        require(transferAmount > 0, "FlowCash: Transfer amount too small after fees");
        
        // Create transaction record
        _transactionIds.increment();
        uint256 transactionId = _transactionIds.current();
        
        Transaction memory newTransaction = Transaction({
            id: transactionId,
            sender: msg.sender,
            recipient: recipient,
            amount: transferAmount,
            fee: fee,
            cashback: cashback,
            timestamp: block.timestamp,
            paymentType: PaymentType.P2P,
            isProcessed: true
        });
        
        transactions[transactionId] = newTransaction;
        userTransactionIds[msg.sender].push(transactionId);
        userTransactionIds[recipient].push(transactionId);
        
        // Update user stats
        userStats[msg.sender].totalSent = userStats[msg.sender].totalSent.add(transferAmount);
        userStats[msg.sender].transactionCount = userStats[msg.sender].transactionCount.add(1);
        userStats[msg.sender].lastTransactionTime = block.timestamp;
        
        userStats[recipient].totalReceived = userStats[recipient].totalReceived.add(transferAmount);
        userStats[recipient].transactionCount = userStats[recipient].transactionCount.add(1);
        userStats[recipient].lastTransactionTime = block.timestamp;
        
        // Update global stats
        totalFeesCollected = totalFeesCollected.add(fee);
        totalVolumeProcessed = totalVolumeProcessed.add(transferAmount);
        
        // Transfer ETN to recipient
        (bool success, ) = recipient.call{value: transferAmount}("");
        require(success, "FlowCash: Transfer failed");
        
        // Send fee to fee collector
        (bool feeSuccess, ) = feeCollector.call{value: fee}("");
        require(feeSuccess, "FlowCash: Fee transfer failed");
        
        emit ETNSent(transactionId, msg.sender, recipient, transferAmount, fee, cashback, PaymentType.P2P);
        emit FeeCollected(fee);
    }
    
    /**
     * @dev Process payment for airtime, bills, etc. (Called by authorized processors)
     * @param user The user making the payment
     * @param paymentType The type of payment
     */
    function processPayment(
        address user, 
        PaymentType paymentType
    ) 
        external 
        payable 
        onlyAuthorizedProcessor 
        whenNotPaused 
        nonReentrant 
        validAmount(msg.value) 
        validFeeCollector 
    {
        require(user != address(0), "FlowCash: Invalid user");
        require(msg.value > 0, "FlowCash: Amount must be greater than 0");
        require(paymentType != PaymentType.P2P, "FlowCash: Use sendETN for P2P transfers");
        
        // Calculate fee and cashback safely
        uint256 fee = msg.value.mul(FEE_RATE).div(FEE_DENOMINATOR);
        uint256 cashback = msg.value.mul(CASHBACK_RATE).div(FEE_DENOMINATOR);
        uint256 paymentAmount = msg.value.sub(fee).add(cashback);
        
        // Ensure payment amount is positive after fee deduction
        require(paymentAmount > 0, "FlowCash: Payment amount too small after fees");
        
        // Create transaction record
        _transactionIds.increment();
        uint256 transactionId = _transactionIds.current();
        
        Transaction memory newTransaction = Transaction({
            id: transactionId,
            sender: user,
            recipient: address(0), // No direct recipient for payments
            amount: paymentAmount,
            fee: fee,
            cashback: cashback,
            timestamp: block.timestamp,
            paymentType: paymentType,
            isProcessed: false // Will be marked as processed by backend
        });
        
        transactions[transactionId] = newTransaction;
        userTransactionIds[user].push(transactionId);
        
        // Update user stats
        userStats[user].totalSent = userStats[user].totalSent.add(paymentAmount);
        userStats[user].transactionCount = userStats[user].transactionCount.add(1);
        userStats[user].lastTransactionTime = block.timestamp;
        
        // Update global stats
        totalFeesCollected = totalFeesCollected.add(fee);
        totalVolumeProcessed = totalVolumeProcessed.add(paymentAmount);
        
        // Send fee to fee collector
        (bool feeSuccess, ) = feeCollector.call{value: fee}("");
        require(feeSuccess, "FlowCash: Fee transfer failed");
        
        emit PaymentProcessed(transactionId, user, paymentAmount, paymentType);
        emit CashbackDistributed(user, cashback);
        emit FeeCollected(fee);
    }
    
    /**
     * @dev Mark a payment transaction as processed (Called by backend after API success)
     * @param transactionId The transaction ID to mark as processed
     */
    function markPaymentProcessed(uint256 transactionId) 
        external 
        onlyAuthorizedProcessor 
    {
        require(transactionId > 0 && transactionId <= _transactionIds.current(), "FlowCash: Invalid transaction ID");
        
        Transaction storage transaction = transactions[transactionId];
        require(!transaction.isProcessed, "FlowCash: Transaction already processed");
        require(transaction.paymentType != PaymentType.P2P, "FlowCash: Cannot mark P2P as processed");
        
        transaction.isProcessed = true;
    }

    // ============ ADMIN FUNCTIONS ============
    
    /**
     * @dev Update fee collector address (Owner only)
     * @param newFeeCollector The new fee collector address
     */
    function updateFeeCollector(address newFeeCollector) 
        external 
        onlyOwner 
    {
        require(newFeeCollector != address(0), "FlowCash: Invalid fee collector address");
        
        address oldFeeCollector = feeCollector;
        feeCollector = newFeeCollector;
        
        emit FeeCollectorUpdated(oldFeeCollector, newFeeCollector);
    }
    
    /**
     * @dev Update minimum transaction amount (Owner only)
     * @param newMinAmount New minimum transaction amount
     */
    function updateMinTransactionAmount(uint256 newMinAmount) 
        external 
        onlyOwner 
    {
        require(newMinAmount > 0, "FlowCash: Min amount must be greater than 0");
        
        minTransactionAmount = newMinAmount;
        
        emit TransactionLimitUpdated(newMinAmount);
    }
    
    /**
     * @dev Add or remove authorized processors (Owner only)
     * @param processor The processor address
     * @param authorized Whether to authorize or deauthorize
     */
    function setAuthorizedProcessor(address processor, bool authorized) 
        external 
        onlyOwner 
    {
        require(processor != address(0), "FlowCash: Invalid processor address");
        
        authorizedProcessors[processor] = authorized;
        emit AuthorizedProcessorUpdated(processor, authorized);
    }
    
    /**
     * @dev Emergency pause function (Owner only)
     */
    function emergencyPause() external onlyOwner {
        _pause();
    }
    
    /**
     * @dev Unpause function (Owner only)
     */
    function emergencyUnpause() external onlyOwner {
        _unpause();
    }

    // ============ VIEW FUNCTIONS ============
    
    /**
     * @dev Get transaction details
     * @param transactionId The transaction ID
     * @return Transaction details
     */
    function getTransaction(uint256 transactionId) 
        external 
        view 
        returns (Transaction memory) 
    {
        require(transactionId > 0 && transactionId <= _transactionIds.current(), "FlowCash: Invalid transaction ID");
        return transactions[transactionId];
    }
    
    /**
     * @dev Get user's transaction history
     * @param user The user address
     * @return Array of transaction IDs
     */
    function getUserTransactionIds(address user) 
        external 
        view 
        returns (uint256[] memory) 
    {
        return userTransactionIds[user];
    }
    
    /**
     * @dev Get user statistics
     * @param user The user address
     * @return User statistics
     */
    function getUserStats(address user) 
        external 
        view 
        returns (UserStats memory) 
    {
        return userStats[user];
    }
    
    /**
     * @dev Get contract statistics
     * @return Total fees collected, total volume, total transactions
     */
    function getContractStats() 
        external 
        view 
        returns (uint256, uint256, uint256) 
    {
        return (totalFeesCollected, totalVolumeProcessed, _transactionIds.current());
    }
    
    /**
     * @dev Calculate fee for a given amount
     * @param amount The amount to calculate fee for
     * @return The fee amount
     */
    function calculateFee(uint256 amount) external pure returns (uint256) {
        return amount.mul(FEE_RATE).div(FEE_DENOMINATOR);
    }
    
    /**
     * @dev Calculate cashback for a given amount
     * @param amount The amount to calculate cashback for
     * @return The cashback amount
     */
    function calculateCashback(uint256 amount) external pure returns (uint256) {
        return amount.mul(CASHBACK_RATE).div(FEE_DENOMINATOR);
    }

    // ============ RECEIVE FUNCTION ============
    
    /**
     * @dev Allow contract to receive ETN
     */
    receive() external payable {
        // Contract can receive ETN for processing
    }
} 