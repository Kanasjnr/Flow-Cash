# FlowCash - Mobile-First Payment Platform on Electroneum

A decentralized payment platform built on the Electroneum (ETN) blockchain, designed to empower Africa's underbanked population. FlowCash enables users to send/receive ETN and spend it on everyday essentials like airtime, data, electricity, and subscriptions through a Progressive Web App (PWA) with seamless phone number-based authentication.

## 🚀 Project Overview

FlowCash is a mobile-first payment solution that leverages the Electroneum blockchain to provide:
- **P2P Transfers**: Send ETN directly to other users via phone numbers
- **Airtime & Data Purchases**: Buy airtime for MTN, Airtel, Safaricom, Glo
- **Bill Payments**: Pay electricity bills and TV subscriptions
- **Fee Collection**: Automated 1.5% fee collection with distribution
- **Cashback Rewards**: 0.5% cashback on all transactions
- **Multi-Language Support**: English, French, Swahili, Hausa, Yoruba, Zulu

## 🏗️ Architecture

### Smart Contracts
- **FlowCashCore**: Main contract handling P2P transfers and payment processing
- **FeeCollector**: Manages fee collection and distribution to operational wallets

### Frontend
- **Next.js 15**: React framework with TypeScript
- **Tailwind CSS**: Utility-first CSS framework
- **PWA Support**: Progressive Web App with offline capabilities
- **Web3 Integration**: wagmi + viem for blockchain interactions
- **Authentication**: Web3Auth for phone number-based wallet creation
- **Multi-Language**: i18n support for 6 African languages

### Backend (Planned)
- **Node.js + Express**: RESTful API with GraphQL
- **PostgreSQL**: Primary database for user profiles and transactions
- **Redis**: Caching and session management
- **Payment APIs**: Africa's Talking, Reloadly, Maviance
- **SMS Integration**: Twilio/Africa's Talking for OTP

## 📋 Contract Addresses (Testnet)

### Electroneum Testnet (Chain ID: 5201420)

| Contract | Address | Block Explorer |
|----------|---------|----------------|
| **FeeCollector** | `0x75E4Eb5F40c48e89e0FDA6e32E88459F5d97183D` | [View Contract](https://testnet-blockexplorer.electroneum.com/address/0x75E4Eb5F40c48e89e0FDA6e32E88459F5d97183D#code) |
| **FlowCashCore** | `0x2b2A944CeF81C24fd5bBa7EbE34F318D9d57A48b` | [View Contract](https://testnet-blockexplorer.electroneum.com/address/0x2b2A944CeF81C24fd5bBa7EbE34F318D9d57A48b#code) |


### Market Opportunity
- **Population**: 1.4 billion people, 500 million+ mobile users
- **Crypto Adoption**: Nigeria, Kenya, South Africa in global top 10
- **Underbanked**: 350 million+ without banking access
- **Airtime/Data Market**: $40 billion+ annually in Sub-Saharan Africa
- **Utility Bill Market**: $50 billion+ annually

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
   
   # Add contract addresses and Web3Auth config
   NEXT_PUBLIC_FLOWCASH_CORE=0x2b2A944CeF81C24fd5bBa7EbE34F318D9d57A48b
   NEXT_PUBLIC_FEE_COLLECTOR=0x75E4Eb5F40c48e89e0FDA6e32E88459F5d97183D
   NEXT_PUBLIC_CHAIN_ID=5201420
   NEXT_PUBLIC_WEB3AUTH_CLIENT_ID=your_web3auth_client_id
   NEXT_PUBLIC_ETN_RPC_URL=https://rpc.ankr.com/electroneum_testnet
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
- ✅ **P2P ETN Transfers**: Send/receive ETN via phone numbers using Web3Auth
- ✅ **Airtime & Data Purchases**: Multi-country support (MTN, Airtel, Safaricom, Glo)
- ✅ **Bill Payments**: Electricity bills and TV subscriptions (DStv, StarTimes, GOtv)
- ✅ **Automated Fee Collection**: 1.5% fee with 50% Operations, 30% Incentives, 20% Treasury
- ✅ **Cashback Rewards**: 0.5% cashback on all transactions
- ✅ **Multi-Language UI**: English, French, Swahili, Hausa, Yoruba, Zulu
- ✅ **PWA Support**: Offline capabilities, add-to-home-screen, background sync
- ✅ **Security**: 2FA for transactions >500 ETN, rate limiting, audit logs

### Planned Features
- 🔄 **Mobile App**: React Native app with native contact sync (Q1 2026)
- 🔄 **Referral System**: 10 ETN per referral, capped at 500,000 ETN/year
- 🔄 **Merchant QR Payments**: Browser-based QR scanning (Phase 2)
- 🔄 **Fiat On/Off Ramps**: ETN-to-fiat conversion via P2P marketplaces
- 🔄 **USSD Support**: Offline transaction mode for low-connectivity areas

## 🔒 Security

### Smart Contract Security
- **ReentrancyGuard**: Prevents reentrancy attacks
- **Pausable**: Emergency pause functionality
- **Ownable**: Access control for admin functions
- **SafeMath**: Overflow/underflow protection
- **Comprehensive Testing**: 100% test coverage

### Frontend Security
- **Web3Auth Integration**: Phone number-based wallet creation
- **2FA Protection**: SMS OTP for transactions >500 ETN
- **Input Validation**: Client-side validation with Zod
- **Error Handling**: Graceful error management
- **Secure Storage**: Encrypted local storage with IndexedDB
- **HTTPS**: Secure connections with TLS 1.3


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

### Q3 2025
- ✅ Smart contract development
- ✅ Testnet deployment
- 🔄 PWA MVP Launch (Nigeria, Kenya)

### Q4 2025
- 🔄 Expand to Ghana, Uganda
- 🔄 Add bill payments
- 🔄 Frontend MVP

### Q1 2026
- 🔄 React Native app development
- 🔄 Merchant QR payments
- 🔄 Mainnet deployment

### Q2 2026
- 🔄 Fiat on/off ramps
- 🔄 Android app launch
- 🔄 Expand to 10 African countries

### Q3 2026
- 🔄 USSD support
- 🔄 Offline transaction mode
- 🔄 Enterprise partnerships

---

**Note**: This project is currently deployed on **Electroneum Testnet**. All contract addresses and links are for testing purposes only. Mainnet deployment will have different addresses. 