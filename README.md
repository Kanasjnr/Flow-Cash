# FlowCash - Mobile-First Payment Platform on Electroneum

A decentralized payment platform built on the Electroneum (ETN) blockchain, enabling P2P transfers, airtime purchases, and bill payments with integrated fee collection and cashback rewards.

## 🚀 Project Overview

FlowCash is a mobile-first payment solution that leverages the Electroneum blockchain to provide:
- **P2P Transfers**: Send ETN directly to other users
- **Airtime Purchases**: Buy airtime for various mobile networks
- **Bill Payments**: Pay utility bills and other services
- **Fee Collection**: Automated 1.5% fee collection with distribution
- **Cashback Rewards**: 0.5% cashback on all transactions

## 🏗️ Architecture

### Smart Contracts
- **FlowCashCore**: Main contract handling P2P transfers and payment processing
- **FeeCollector**: Manages fee collection and distribution to operational wallets

### Frontend
- **Next.js 15**: React framework with TypeScript
- **Tailwind CSS**: Utility-first CSS framework
- **PWA Support**: Progressive Web App capabilities
- **Web3 Integration**: wagmi + viem for blockchain interactions

### Backend (Planned)
- **Node.js + Express**: RESTful API
- **PostgreSQL**: Primary database
- **Redis**: Caching and session management
- **GraphQL**: Alternative API layer

## 📋 Contract Addresses (Testnet)

### Electroneum Testnet (Chain ID: 5201420)

| Contract | Address | Block Explorer |
|----------|---------|----------------|
| **FeeCollector** | `0x75E4Eb5F40c48e89e0FDA6e32E88459F5d97183D` | [View Contract](https://testnet-blockexplorer.electroneum.com/address/0x75E4Eb5F40c48e89e0FDA6e32E88459F5d97183D#code) |
| **FlowCashCore** | `0x2b2A944CeF81C24fd5bBa7EbE34F318D9d57A48b` | [View Contract](https://testnet-blockexplorer.electroneum.com/address/0x2b2A944CeF81C24fd5bBa7EbE34F318D9d57A48b#code) |


## 🛠️ Setup Instructions

### Prerequisites
- Node.js (v18 or higher)
- npm or yarn
- Hardhat
- Electroneum wallet with testnet ETN

### Smart Contract Setup

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd Flow-Cash
   ```

2. **Install dependencies**
   ```bash
   cd smart-contract
   npm install
   ```

3. **Environment setup**
   ```bash
   # Create .env file
   cp .env.example .env
   
   # Add your private key and API keys
   PRIVATE_KEY=your_private_key_here
   ANKR_API_KEY=your_ankr_api_key_here
   ```

4. **Compile contracts**
   ```bash
   npm run compile
   ```

5. **Run tests**
   ```bash
   npm test
   npm run test:coverage
   ```

### Frontend Setup

1. **Install dependencies**
   ```bash
   cd frontend
   npm install
   ```

2. **Environment setup**
   ```bash
   # Create .env.local file
   cp .env.example .env.local
   
   # Add contract addresses
   NEXT_PUBLIC_FLOWCASH_CORE=0x2b2A944CeF81C24fd5bBa7EbE34F318D9d57A48b
   NEXT_PUBLIC_FEE_COLLECTOR=0x75E4Eb5F40c48e89e0FDA6e32E88459F5d97183D
   NEXT_PUBLIC_CHAIN_ID=5201420
   ```

3. **Run development server**
   ```bash
   npm run dev
   ```

## 🚀 Deployment

### Testnet Deployment

1. **Deploy contracts**
   ```bash
   cd smart-contract
   npm run deploy:testnet
   ```

2. **Verify contracts**
   ```bash
   npx hardhat run scripts/verify-contracts.ts --network electroneum-testnet
   ```

### Mainnet Deployment

1. **Deploy contracts**
   ```bash
   cd smart-contract
   npm run deploy:mainnet
   ```

2. **Verify contracts**
   ```bash
   npx hardhat run scripts/verify-contracts.ts --network electroneum
   ```

## 📊 Testing

### Smart Contract Tests
```bash
cd smart-contract
npm test                    # Run all tests
npm run test:coverage       # Run with coverage
```

### Frontend Tests
```bash
cd frontend
npm test                    # Run unit tests
npm run test:e2e           # Run E2E tests
```

## 🔧 Available Scripts

### Smart Contract
- `npm run compile` - Compile contracts
- `npm test` - Run tests
- `npm run test:coverage` - Run tests with coverage
- `npm run deploy:testnet` - Deploy to testnet
- `npm run deploy:mainnet` - Deploy to mainnet

### Frontend
- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm start` - Start production server
- `npm run lint` - Run linter
- `npm test` - Run tests

## 🌐 Networks

### Testnet
- **Network**: Electroneum Testnet
- **Chain ID**: 5201420
- **RPC URL**: `https://rpc.ankr.com/electroneum_testnet`
- **Block Explorer**: https://testnet-blockexplorer.electroneum.com

### Mainnet
- **Network**: Electroneum Mainnet
- **Chain ID**: 52014
- **RPC URL**: `https://rpc.ankr.com/electroneum/{API_KEY}`
- **Block Explorer**: https://blockexplorer.electroneum.com

## 📱 Features

### Core Features
- ✅ P2P ETN transfers
- ✅ Automated fee collection (1.5%)
- ✅ Cashback rewards (0.5%)
- ✅ Payment processing for airtime/bills
- ✅ Multi-wallet fee distribution
- ✅ Pausable functionality
- ✅ Reentrancy protection

### Planned Features
- 🔄 Mobile app (React Native)
- 🔄 Referral system
- 🔄 Advanced analytics
- 🔄 Multi-chain support
- 🔄 DeFi integrations

## 🔒 Security

### Smart Contract Security
- **ReentrancyGuard**: Prevents reentrancy attacks
- **Pausable**: Emergency pause functionality
- **Ownable**: Access control for admin functions
- **SafeMath**: Overflow/underflow protection
- **Comprehensive Testing**: 100% test coverage

### Frontend Security
- **Input Validation**: Client-side validation
- **Error Handling**: Graceful error management
- **Secure Storage**: Encrypted local storage
- **HTTPS**: Secure connections

## 📈 Business Model


## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 📞 Support

- **Documentation**: [Project Wiki](link-to-wiki)
- **Email**: support@flowcash.com

## 🗺️ Roadmap

### Q4 2025
- ✅ Smart contract development
- ✅ Testnet deployment
- ✅ Frontend MVP
- 🔄 PWA launch

### Q1 2026
- 🔄 Mobile app development
- 🔄 Mainnet deployment
- 🔄 Payment API integrations
- 🔄 Referral system

### Q2 2026
- 🔄 Advanced analytics
- 🔄 Multi-chain support
- 🔄 DeFi integrations
- 🔄 Enterprise partnerships

---

**Note**: This project is currently deployed on **Electroneum Testnet**. All contract addresses and links are for testing purposes only. Mainnet deployment will have different addresses. 