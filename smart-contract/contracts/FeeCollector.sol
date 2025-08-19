// SPDX-License-Identifier: MIT
pragma solidity ^0.8.26;

import "@openzeppelin/contracts/security/Pausable.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/security/ReentrancyGuard.sol";

/**
 * @title FeeCollector
 * @dev Handles fee collection and distribution for FlowCash ecosystem
 */
contract FeeCollector is Pausable, Ownable, ReentrancyGuard {
    // ============ STRUCTS ============

    struct FeeDistribution {
        uint256 operations; // 50% - Operations (hosting, APIs)
        uint256 incentives; // 30% - Incentives (cashback, referrals)
        uint256 treasury; // 20% - Treasury (development, liquidity)
    }

    struct FeeBalance {
        uint256 totalCollected;
        uint256 operationsBalance;
        uint256 incentivesBalance;
        uint256 treasuryBalance;
        uint256 lastDistributionTime;
    }

    // ============ STATE VARIABLES ============

    FeeBalance public feeBalance;

    // Distribution addresses
    address public operationsWallet;
    address public incentivesWallet;
    address public treasuryWallet;

    // Distribution percentages (basis points)
    uint256 public constant OPERATIONS_PERCENT = 5000; // 50%
    uint256 public constant INCENTIVES_PERCENT = 3000; // 30%
    uint256 public constant TREASURY_PERCENT = 2000; // 20%
    uint256 public constant PERCENT_DENOMINATOR = 10000; // 100%

    // Minimum distribution threshold
    uint256 public minDistributionThreshold = 100 * 10 ** 18; // 100 ETN

    // Authorized collectors (FlowCash contracts)
    mapping(address => bool) public authorizedCollectors;

    // ============ EVENTS ============

    event FeeCollected(address indexed collector, uint256 amount);
    event FeeDistributed(
        uint256 operationsAmount,
        uint256 incentivesAmount,
        uint256 treasuryAmount
    );
    event WalletUpdated(
        string walletType,
        address indexed oldWallet,
        address indexed newWallet
    );
    event ThresholdUpdated(uint256 oldThreshold, uint256 newThreshold);
    event CollectorAuthorized(address indexed collector, bool authorized);

    // ============ MODIFIERS ============

    modifier onlyAuthorizedCollector() {
        require(
            authorizedCollectors[msg.sender],
            "FeeCollector: Not authorized collector"
        );
        _;
    }

    modifier validWallet(address wallet) {
        require(wallet != address(0), "FeeCollector: Invalid wallet address");
        _;
    }

    // ============ CONSTRUCTOR ============

    constructor(
        address _operationsWallet,
        address _incentivesWallet,
        address _treasuryWallet
    ) Ownable() {
        require(
            _operationsWallet != address(0),
            "FeeCollector: Invalid operations wallet"
        );
        require(
            _incentivesWallet != address(0),
            "FeeCollector: Invalid incentives wallet"
        );
        require(
            _treasuryWallet != address(0),
            "FeeCollector: Invalid treasury wallet"
        );

        operationsWallet = _operationsWallet;
        incentivesWallet = _incentivesWallet;
        treasuryWallet = _treasuryWallet;

        // Set deployer as authorized collector
        authorizedCollectors[msg.sender] = true;
    }

    // ============ CORE FUNCTIONS ============

    /**
     * @dev Collect fees from authorized collectors
     * @param amount The amount of fees to collect
     */
    function collectFee(
        uint256 amount
    ) external onlyAuthorizedCollector whenNotPaused nonReentrant {
        require(amount > 0, "FeeCollector: Amount must be greater than 0");
        require(
            address(this).balance >= amount,
            "FeeCollector: Insufficient balance"
        );

        // Update fee balance
        feeBalance.totalCollected += amount;

        // Calculate distribution amounts
        uint256 operationsAmount = (amount * OPERATIONS_PERCENT) /
            PERCENT_DENOMINATOR;
        uint256 incentivesAmount = (amount * INCENTIVES_PERCENT) /
            PERCENT_DENOMINATOR;
        uint256 treasuryAmount = amount - operationsAmount - incentivesAmount; // Remainder to treasury

        // Update individual balances
        feeBalance.operationsBalance += operationsAmount;
        feeBalance.incentivesBalance += incentivesAmount;
        feeBalance.treasuryBalance += treasuryAmount;

        emit FeeCollected(msg.sender, amount);
    }

    /**
     * @dev Distribute collected fees to respective wallets
     */
    function distributeFees() external onlyOwner whenNotPaused nonReentrant {
        require(
            feeBalance.operationsBalance +
                feeBalance.incentivesBalance +
                feeBalance.treasuryBalance >=
                minDistributionThreshold,
            "FeeCollector: Below distribution threshold"
        );

        uint256 operationsAmount = feeBalance.operationsBalance;
        uint256 incentivesAmount = feeBalance.incentivesBalance;
        uint256 treasuryAmount = feeBalance.treasuryBalance;

        // Reset balances
        feeBalance.operationsBalance = 0;
        feeBalance.incentivesBalance = 0;
        feeBalance.treasuryBalance = 0;
        feeBalance.lastDistributionTime = block.timestamp;

        // Distribute to wallets
        if (operationsAmount > 0) {
            (bool success, ) = operationsWallet.call{value: operationsAmount}(
                ""
            );
            require(success, "FeeCollector: Operations distribution failed");
        }

        if (incentivesAmount > 0) {
            (bool success, ) = incentivesWallet.call{value: incentivesAmount}(
                ""
            );
            require(success, "FeeCollector: Incentives distribution failed");
        }

        if (treasuryAmount > 0) {
            (bool success, ) = treasuryWallet.call{value: treasuryAmount}("");
            require(success, "FeeCollector: Treasury distribution failed");
        }

        emit FeeDistributed(operationsAmount, incentivesAmount, treasuryAmount);
    }

    /**
     * @dev Emergency distribution (Owner only)
     * @param amount The amount to distribute
     */
    function emergencyDistribute(
        uint256 amount
    ) external onlyOwner whenNotPaused nonReentrant {
        require(amount > 0, "FeeCollector: Amount must be greater than 0");
        require(
            address(this).balance >= amount,
            "FeeCollector: Insufficient balance"
        );

        // Calculate distribution amounts
        uint256 operationsAmount = (amount * OPERATIONS_PERCENT) /
            PERCENT_DENOMINATOR;
        uint256 incentivesAmount = (amount * INCENTIVES_PERCENT) /
            PERCENT_DENOMINATOR;
        uint256 treasuryAmount = amount - operationsAmount - incentivesAmount;

        // Distribute immediately
        if (operationsAmount > 0) {
            (bool success, ) = operationsWallet.call{value: operationsAmount}(
                ""
            );
            require(success, "FeeCollector: Operations distribution failed");
        }

        if (incentivesAmount > 0) {
            (bool success, ) = incentivesWallet.call{value: incentivesAmount}(
                ""
            );
            require(success, "FeeCollector: Incentives distribution failed");
        }

        if (treasuryAmount > 0) {
            (bool success, ) = treasuryWallet.call{value: treasuryAmount}("");
            require(success, "FeeCollector: Treasury distribution failed");
        }

        emit FeeDistributed(operationsAmount, incentivesAmount, treasuryAmount);
    }

    // ============ ADMIN FUNCTIONS ============

    /**
     * @dev Update wallet addresses (Owner only)
     * @param walletType The type of wallet ("operations", "incentives", "treasury")
     * @param newWallet The new wallet address
     */
    function updateWallet(
        string memory walletType,
        address newWallet
    ) external onlyOwner validWallet(newWallet) {
        if (keccak256(bytes(walletType)) == keccak256(bytes("operations"))) {
            address oldWallet = operationsWallet;
            operationsWallet = newWallet;
            emit WalletUpdated("operations", oldWallet, newWallet);
        } else if (
            keccak256(bytes(walletType)) == keccak256(bytes("incentives"))
        ) {
            address oldWallet = incentivesWallet;
            incentivesWallet = newWallet;
            emit WalletUpdated("incentives", oldWallet, newWallet);
        } else if (
            keccak256(bytes(walletType)) == keccak256(bytes("treasury"))
        ) {
            address oldWallet = treasuryWallet;
            treasuryWallet = newWallet;
            emit WalletUpdated("treasury", oldWallet, newWallet);
        } else {
            revert("FeeCollector: Invalid wallet type");
        }
    }

    /**
     * @dev Update distribution threshold (Owner only)
     * @param newThreshold The new minimum distribution threshold
     */
    function updateDistributionThreshold(
        uint256 newThreshold
    ) external onlyOwner {
        require(
            newThreshold > 0,
            "FeeCollector: Threshold must be greater than 0"
        );

        uint256 oldThreshold = minDistributionThreshold;
        minDistributionThreshold = newThreshold;

        emit ThresholdUpdated(oldThreshold, newThreshold);
    }

    /**
     * @dev Add or remove authorized collectors (Owner only)
     * @param collector The collector address
     * @param authorized Whether to authorize or deauthorize
     */
    function setAuthorizedCollector(
        address collector,
        bool authorized
    ) external onlyOwner {
        require(
            collector != address(0),
            "FeeCollector: Invalid collector address"
        );

        authorizedCollectors[collector] = authorized;
        emit CollectorAuthorized(collector, authorized);
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
     * @dev Get current fee balance
     * @return Fee balance structure
     */
    function getFeeBalance() external view returns (FeeBalance memory) {
        return feeBalance;
    }

    /**
     * @dev Get wallet addresses
     * @return Operations, incentives, and treasury wallet addresses
     */
    function getWallets() external view returns (address, address, address) {
        return (operationsWallet, incentivesWallet, treasuryWallet);
    }

    /**
     * @dev Check if address is authorized collector
     * @param collector The address to check
     * @return True if authorized
     */
    function isAuthorizedCollector(
        address collector
    ) external view returns (bool) {
        return authorizedCollectors[collector];
    }

    /**
     * @dev Calculate distribution amounts for a given fee amount
     * @param amount The fee amount
     * @return Operations, incentives, and treasury amounts
     */
    function calculateDistribution(
        uint256 amount
    ) external pure returns (uint256, uint256, uint256) {
        uint256 operationsAmount = (amount * OPERATIONS_PERCENT) /
            PERCENT_DENOMINATOR;
        uint256 incentivesAmount = (amount * INCENTIVES_PERCENT) /
            PERCENT_DENOMINATOR;
        uint256 treasuryAmount = amount - operationsAmount - incentivesAmount;

        return (operationsAmount, incentivesAmount, treasuryAmount);
    }

    // ============ RECEIVE FUNCTION ============

    /**
     * @dev Allow contract to receive ETN
     */
    receive() external payable {
        // Contract can receive ETN for fee collection
    }
}
