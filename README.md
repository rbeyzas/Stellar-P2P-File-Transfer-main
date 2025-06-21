# 🌟 Stellar P2P File Transfer

<div align="center">

![Stellar](https://img.shields.io/badge/Stellar-7D00FF?style=for-the-badge&logo=stellar&logoColor=white)
![React](https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB)
![TypeScript](https://img.shields.io/badge/TypeScript-007ACC?style=for-the-badge&logo=typescript&logoColor=white)
![WebRTC](https://img.shields.io/badge/WebRTC-333333?style=for-the-badge&logo=webrtc&logoColor=white)
![PWA](https://img.shields.io/badge/PWA-5A0FC8?style=for-the-badge&logo=pwa&logoColor=white)

**Secure • Decentralized • Permission-Based File Transfer with Token System**

_A modern peer-to-peer file transfer application built on the Stellar blockchain with beautiful UI, advanced permission management, token system, and mobile PWA support._

[🚀 Getting Started](#getting-started) • [✨ Features](#features) • [🛠️ Installation](#installation) • [📖 Usage](#usage)

</div>

---

## ✨ Features

### 🔐 **Blockchain-Powered Security**

- **Smart Contract Permissions**: Files can only be transferred between wallets with explicit blockchain permissions
- **Stellar Network Integration**: Built on Stellar's robust and fast blockchain infrastructure
- **Wallet Authentication**: Secure wallet connection using Stellar Wallets Kit

### 🌐 **Peer-to-Peer Transfer**

- **Direct File Transfer**: Files are transferred directly between peers without intermediary servers
- **WebRTC Technology**: Uses modern WebRTC for fast and secure peer-to-peer connections
- **Real-time Communication**: Instant connection status and transfer progress

### 🪙 **Stellar Token System**

- **XLM Integration**: Native Stellar Lumens (XLM) support
- **Custom Tokens**: Create and manage custom tokens on the Stellar network
- **Token Balances**: Real-time token balance tracking
- **Payment System**: Send payments in XLM and other Stellar assets
- **Transaction History**: Complete transaction history and tracking

### 🎨 **Modern User Interface**

- **Beautiful Design**: Modern gradient-based UI with smooth animations
- **Responsive Layout**: Works perfectly on desktop and mobile devices
- **Intuitive UX**: Simple and user-friendly interface for all skill levels
- **Real-time Feedback**: Live status updates and progress indicators

### 🛡️ **Permission Management**

- **Grant Permissions**: Allow specific wallets to send you files
- **Revoke Access**: Remove file transfer permissions at any time
- **Permission Verification**: Automatic permission checking before file transfers

### 🔐 **Passkey Authentication**

- **Biometric Security**: Use fingerprint, face ID, or device PIN
- **No Private Keys**: Secure authentication without key management
- **Smart Wallet**: Stellar smart contract-based wallet

### 📱 **Mobile PWA Support**

- **Progressive Web App**: Install as a native mobile app
- **Offline Support**: Works offline with cached resources
- **Push Notifications**: Real-time notifications for file transfers
- **Background Sync**: Automatic sync when connection is restored
- **Mobile Optimized**: Touch-friendly interface for mobile devices

### 📱 **Traditional Wallet Support**

- **XBULL Integration**: Connect with XBULL wallet
- **Familiar Experience**: Traditional wallet connection flow

---

## 🚀 Getting Started

### Prerequisites

- **Node.js** (v16 or higher)
- **npm** or **yarn**
- **Stellar Wallet** (XBULL, Freighter, etc.)

### 🛠️ Installation

1. **Clone the repository**

   ```bash
   git clone https://github.com/Mantis322/stellar-p2p-file-transfer.git](https://github.com/Mantis322/Stellar-P2P-File-Transfer.git
   cd Stellar-P2P-File-Transfer
   ```

2. **Install dependencies**

   ```bash
   npm install
   ```

3. **Set up environment variables**
   ```bash
   cp env.example .env
   ```

Edit `.env` with your configuration:

```env
# Stellar Testnet Configuration
REACT_APP_PUBLIC_rpcUrl=https://soroban-testnet.stellar.org:443
REACT_APP_PUBLIC_networkPassphrase=Test SDF Network ; September 2015
REACT_APP_PUBLIC_walletWasmHash=default_hash

# Launchtube Configuration (optional)
REACT_APP_PUBLIC_launchtubeUrl=https://launchtube.stellar.org
REACT_APP_PUBLIC_launchtubeJwt=your_launchtube_jwt_here

# Mercury Configuration (optional)
REACT_APP_PUBLIC_mercuryUrl=https://test.mercurydata.app
REACT_APP_PUBLIC_mercuryJwt=your_mercury_jwt_here
```

4. **Build the file-transfer package**

   ```bash
   cd packages/file-transfer
   npm run build
   cd ../..
   ```

5. **Start the development server**

   ```bash
   npm start
   ```

6. **Open your browser**
   ```
   http://localhost:3000
   ```

---

## 📖 Usage

### 🔗 **Connect Your Wallet**

1. Click **"Connect Wallet"** button
2. Select your preferred Stellar wallet
3. Authorize the connection

### 🤝 **Grant Permissions**

1. Click **"Settings"** button
2. Enter the wallet address you want to grant permission to
3. Click **"Grant"** and confirm the transaction

### 📤 **Send Files**

1. Enter the **recipient's wallet address**
2. Click **"Check Permission"** to verify access
3. Enter the **recipient's peer ID**
4. **Select and upload** your file
5. Click **"Send File"** to transfer

### 📥 **Receive Files**

1. Share your **Peer ID** with the sender
2. Wait for incoming connections
3. Files will be automatically downloaded when received

### 🪙 **Token System**

1. Navigate to the **"Token System"** tab
2. View your **token balances** (XLM, USDC, EURT, etc.)
3. **Send payments** to other Stellar addresses
4. **Create custom tokens** on the Stellar network
5. View **transaction history**

### 📱 **Mobile PWA**

1. **Install the app** on your mobile device
2. **Enable notifications** for file transfer alerts
3. **Use offline** - the app works without internet
4. **Background sync** automatically syncs when online

---

## 🏗️ Project Structure

```
stellar-p2p-file-transfer/
├── 📦 packages/
│   └── file-transfer/          # Stellar smart contract integration
│       ├── src/
│       │   └── index.ts        # Contract client wrapper
│       └── package.json
├── 🌐 public/                 # Static assets & PWA files
│   ├── manifest.json          # PWA manifest
│   ├── sw.js                  # Service worker
│   └── icons/                 # PWA icons
├── ⚛️  src/
│   ├── App.tsx                 # Main application component
│   ├── components/             # React components
│   │   ├── PasskeyWallet.tsx   # Passkey authentication
│   │   ├── TokenSystem.tsx     # Stellar token management
│   │   ├── PWABanner.tsx       # PWA install banner
│   │   └── ChatInterface.tsx   # Real-time chat
│   ├── hooks/                  # Custom React hooks
│   │   └── usePWA.ts          # PWA functionality
│   ├── helpers/                # Utility functions
│   │   ├── peer.ts            # WebRTC peer connection logic
│   │   └── hooks.ts           # Custom React hooks
│   └── store/                  # Redux store
│       ├── peer/              # Peer connection state
│       └── connection/        # Connection management
└── 📄 README.md
```

---

## 🔧 Technology Stack

| Technology        | Purpose                | Version |
| ----------------- | ---------------------- | ------- |
| **React**         | Frontend Framework     | ^18.0   |
| **TypeScript**    | Type Safety            | ^4.9    |
| **Stellar SDK**   | Blockchain Integration | Latest  |
| **WebRTC**        | P2P Communication      | Native  |
| **Ant Design**    | UI Components          | ^5.0    |
| **Redux Toolkit** | State Management       | ^1.9    |
| **PWA**           | Mobile App Support     | Native  |

---

## 🏆 Competition Features

### **Stellar Ecosystem Integration**

- ✅ **Passkey Authentication**: Biometric security with Stellar smart wallets
- ✅ **Token System**: XLM and custom token management
- ✅ **Smart Contracts**: Permission-based file transfers
- ✅ **Soroban Integration**: Advanced smart contract capabilities

### **Consumer App Criteria**

- ✅ **Mobile PWA**: Native mobile app experience
- ✅ **Real-world Impact**: Practical file sharing solution
- ✅ **User Experience**: Intuitive and beautiful interface
- ✅ **Technical Implementation**: Modern web technologies

### **Advanced Features**

- ✅ **Micro-payments**: Token-based payment system
- ✅ **Reputation System**: Permission management
- ✅ **Offline Support**: PWA with service worker
- ✅ **Push Notifications**: Real-time alerts

---

## 🤝 Contributing

We welcome contributions! Please feel free to submit a Pull Request.

1. **Fork** the repository
2. **Create** your feature branch (`git checkout -b feature/AmazingFeature`)
3. **Commit** your changes (`git commit -m 'Add some AmazingFeature'`)
4. **Push** to the branch (`git push origin feature/AmazingFeature`)
5. **Open** a Pull Request

---

<div align="center">

**Made with ❤️ and ⭐ Stellar**

_If you found this project helpful, please give it a ⭐!_

</div>
