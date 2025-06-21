# 🌟 Stellar P2P File Transfer Hub

<div align="center">

![Stellar](https://img.shields.io/badge/Stellar-7D00FF?style=for-the-badge&logo=stellar&logoColor=white)
![React](https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB)
![TypeScript](https://img.shields.io/badge/TypeScript-007ACC?style=for-the-badge&logo=typescript&logoColor=white)
![WebRTC](https://img.shields.io/badge/WebRTC-333333?style=for-the-badge&logo=webrtc&logoColor=white)
![PWA](https://img.shields.io/badge/PWA-5A0FC8?style=for-the-badge&logo=pwa&logoColor=white)
![Redux](https://img.shields.io/badge/Redux-764ABC?style=for-the-badge&logo=redux&logoColor=white)

**Secure • Decentralized • Permission-Based File Transfer with Advanced Features**

_A modern peer-to-peer file transfer application built on the Stellar blockchain with beautiful UI, advanced permission management, token system, batch transfers, file search, and mobile PWA support._

[🚀 Getting Started](#getting-started) • [✨ Features](#features) • [🛠️ Installation](#installation) • [📖 Usage](#usage) • [🏗️ Architecture](#architecture)

</div>

---

## ✨ Features

### 🔐 **Blockchain-Powered Security**

- **Smart Contract Permissions**: Files can only be transferred between wallets with explicit blockchain permissions
- **Stellar Network Integration**: Built on Stellar's robust and fast blockchain infrastructure
- **Wallet Authentication**: Secure wallet connection using Stellar Wallets Kit
- **Permission Management**: Grant and revoke file transfer permissions on the blockchain

### 🌐 **Advanced Peer-to-Peer Transfer**

- **Direct File Transfer**: Files are transferred directly between peers without intermediary servers
- **WebRTC Technology**: Uses modern WebRTC for fast and secure peer-to-peer connections
- **Real-time Communication**: Instant connection status and transfer progress
- **Batch Transfer Support**: Send multiple files simultaneously with progress tracking
- **Transfer History**: Complete record of all file transfers with search and filtering

### 🪙 **Stellar Token System**

- **XLM Integration**: Native Stellar Lumens (XLM) support with real testnet balances
- **Custom Tokens**: Create and manage custom tokens on the Stellar network
- **Token Balances**: Real-time token balance tracking from Stellar testnet
- **Payment System**: Send payments in XLM and other Stellar assets
- **Transaction History**: Complete transaction history and tracking
- **Real Network Data**: All token operations use actual Stellar testnet data

### 📁 **File Management & Search**

- **File Search System**: Advanced search and filtering of transfer history
- **Transfer Records**: Detailed tracking of all sent and received files
- **File Type Detection**: Automatic file type recognition with appropriate icons
- **Transfer Status**: Real-time status tracking (pending, completed, failed)
- **File Details**: Comprehensive file information including size, type, and timestamps
- **History Management**: Clear individual records or entire transfer history

### 🎨 **Modern User Interface**

- **Beautiful Design**: Modern gradient-based UI with Stellar brand colors
- **Responsive Layout**: Works perfectly on desktop and mobile devices
- **Intuitive UX**: Simple and user-friendly interface for all skill levels
- **Real-time Feedback**: Live status updates and progress indicators
- **Tabbed Interface**: Organized sections for File Transfer, File Search, and Token System

### 🔐 **Dual Authentication System**

- **Passkey Authentication**: Biometric security with fingerprint, face ID, or device PIN
- **Smart Contract Wallet**: Stellar smart contract-based wallet for enhanced security
- **Traditional Wallet Support**: XBULL wallet integration for familiar experience
- **No Private Key Management**: Secure authentication without key management complexity

### 📱 **Progressive Web App (PWA)**

- **Native Mobile Experience**: Install as a native mobile app
- **Offline Support**: Works offline with cached resources
- **Push Notifications**: Real-time notifications for file transfers
- **Background Sync**: Automatic sync when connection is restored
- **Mobile Optimized**: Touch-friendly interface for mobile devices
- **Install Banner**: Automatic PWA installation prompts

### 🔄 **Batch Transfer System**

- **Multiple File Selection**: Select up to 10 files for simultaneous transfer
- **Progress Tracking**: Individual and overall progress for each file
- **Status Management**: Real-time status updates (pending, sending, completed, failed)
- **Error Handling**: Graceful handling of failed transfers
- **Transfer Manager**: Dedicated interface for managing batch transfers
- **Statistics Dashboard**: Visual representation of transfer statistics

### 💬 **Real-time Communication**

- **Chat Interface**: Built-in chat system for peer communication
- **Connection Status**: Real-time peer connection monitoring
- **File Transfer Notifications**: Instant notifications for file transfers
- **Peer Discovery**: Easy peer ID sharing and connection establishment

---

## 🚀 Getting Started

### Prerequisites

- **Node.js** (v16 or higher)
- **npm** or **yarn**
- **Stellar Wallet** (XBULL, Freighter, etc.) or **Passkey-enabled device**

### 🛠️ Installation

1. **Clone the repository**

   ```bash
   git clone https://github.com/your-username/Stellar-P2P-File-Transfer.git
   cd Stellar-P2P-File-Transfer
   ```

2. **Install dependencies**

   ```bash
   npm install
   ```

3. **Build the file-transfer package**

   ```bash
   cd packages/file-transfer
   npm run build
   cd ../..
   ```

4. **Start the development server**

   ```bash
   npm start
   ```

5. **Open your browser**
   ```
   http://localhost:3000
   ```

---

## 📖 Usage Guide

### 🔗 **Wallet Connection**

#### Option 1: Traditional Wallet (XBULL)

1. Click **"Connect Stellar Wallet"** button
2. Select XBULL wallet from the modal
3. Authorize the connection in your wallet
4. Your wallet address will be displayed

#### Option 2: Passkey Authentication

1. Use the **Passkey Wallet** section
2. Click **"Create Passkey Wallet"** or **"Connect Existing Wallet"**
3. Use your device's biometric authentication
4. Your passkey wallet address will be displayed

### 🤝 **Permission Management**

1. Click **"Settings"** button in the wallet info bar
2. **Grant Permissions**:
   - Enter the wallet address you want to grant permission to
   - Click **"Grant"** and confirm the transaction
3. **Revoke Permissions**:
   - Enter the wallet address you want to revoke permission from
   - Click **"Revoke"** and confirm the transaction

### 📤 **File Transfer Process**

#### Single File Transfer

1. Enter the **recipient's wallet address** and click **"Check Permission"**
2. Enter the **recipient's peer ID** and click **"Connect"**
3. **Select a file** using the upload area
4. Click **"Send File"** to transfer

#### Batch File Transfer

1. Follow steps 1-2 from single file transfer
2. **Select multiple files** (up to 10) using the upload area
3. Click **"Send X Files"** to start batch transfer
4. Monitor progress in the **Batch Transfer Manager**
5. View individual file status and overall progress

### 📥 **Receiving Files**

1. Share your **Peer ID** with the sender
2. Wait for incoming connections
3. Files will be automatically downloaded when received
4. View transfer history in the **File Search** tab

### 🔍 **File Search & History**

1. Navigate to the **"File Search"** tab
2. **Search transfers** by filename, peer ID, or file type
3. **Filter by direction** (sent/received) or status
4. **View transfer details** by clicking the eye icon
5. **Download received files** (if available)
6. **Delete records** or clear entire history

### 🪙 **Token System**

1. Navigate to the **"Token System"** tab
2. **View balances** of XLM and other tokens
3. **Send payments** to other Stellar addresses
4. **Create custom tokens** on the Stellar network
5. **View transaction history** and details

### 📱 **Mobile PWA Installation**

1. **Open the app** in Chrome/Safari on your mobile device
2. **Look for the install banner** at the top of the page
3. **Click "Install"** to add to your home screen
4. **Enable notifications** for file transfer alerts
5. **Use offline** - the app works without internet

---

## 🏗️ Project Architecture

### 📁 **Directory Structure**

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
│   ├── index.html             # Main HTML file
│   └── icons/                 # PWA icons
├── ⚛️  src/
│   ├── App.tsx                # Main application component
│   ├── pages/
│   │   └── HomePage.tsx       # Main application page
│   ├── components/            # React components
│   │   ├── PasskeyWallet.tsx  # Passkey authentication
│   │   ├── TokenSystem.tsx    # Stellar token management
│   │   ├── PWABanner.tsx      # PWA install banner
│   │   ├── ChatInterface.tsx  # Real-time chat
│   │   ├── FileSearch.tsx     # File search and history
│   │   └── BatchTransferManager.tsx # Batch transfer management
│   ├── hooks/                 # Custom React hooks
│   │   └── usePWA.ts          # PWA functionality
│   ├── helpers/               # Utility functions
│   │   ├── peer.ts           # WebRTC peer connection logic
│   │   └── hooks.ts          # Custom React hooks
│   └── store/                 # Redux store
│       ├── index.ts          # Store configuration
│       ├── hooks.ts          # Redux hooks
│       ├── peer/             # Peer connection state
│       ├── connection/       # Connection management
│       └── transfer/         # Transfer history and search
├── 📄 README.md
├── 📄 package.json
└── 📄 tsconfig.json
```

### 🔧 **Technology Stack**

| Technology        | Purpose                | Version |
| ----------------- | ---------------------- | ------- |
| **React**         | Frontend Framework     | ^18.2.0 |
| **TypeScript**    | Type Safety            | ^4.4.2  |
| **Stellar SDK**   | Blockchain Integration | ^13.3.0 |
| **WebRTC**        | P2P Communication      | Native  |
| **Ant Design**    | UI Components          | ^5.4.2  |
| **Redux Toolkit** | State Management       | ^1.9.5  |
| **PeerJS**        | WebRTC Abstraction     | ^1.5.2  |
| **PWA**           | Mobile App Support     | Native  |

### 🏗️ **Key Components**

#### **HomePage.tsx**

- Main application interface with tabbed navigation
- Wallet connection and authentication
- File transfer interface with batch support
- Connection management and peer discovery

#### **PasskeyWallet.tsx**

- Biometric authentication implementation
- Smart contract wallet integration
- Secure key management without private keys

#### **TokenSystem.tsx**

- Stellar token management interface
- Real-time balance tracking
- Payment and token creation functionality
- Transaction history display

#### **FileSearch.tsx**

- Advanced file search and filtering
- Transfer history management
- File details and download functionality
- History cleanup and management

#### **BatchTransferManager.tsx**

- Multiple file transfer management
- Progress tracking and status updates
- Error handling and recovery
- Transfer statistics dashboard

#### **PWABanner.tsx**

- PWA installation prompts
- Service worker integration
- Offline functionality support

#### **ChatInterface.tsx**

- Real-time peer communication
- Connection status monitoring
- File transfer notifications

### 🔄 **State Management**

#### **Redux Store Structure**

- **Peer State**: WebRTC peer connection management
- **Connection State**: Active peer connections and selection
- **Transfer State**: File transfer history, search, and filtering

#### **Key Actions**

- `startPeer()`: Initialize WebRTC peer
- `connectPeer()`: Establish peer connection
- `createTransferRecord()`: Record new file transfer
- `completeTransfer()`: Mark transfer as completed
- `failTransfer()`: Mark transfer as failed
- `searchTransfers()`: Search transfer history
- `filterTransfers()`: Filter transfers by criteria

---

## 🎯 **Advanced Features**

### 🔄 **Batch Transfer System**

The batch transfer system allows users to send multiple files simultaneously:

- **File Selection**: Drag and drop or click to select up to 10 files
- **Progress Tracking**: Individual progress bars for each file
- **Status Management**: Real-time status updates (pending, sending, completed, failed)
- **Error Handling**: Graceful handling of failed transfers with retry options
- **Statistics Dashboard**: Visual representation of transfer statistics
- **Transfer Manager**: Dedicated interface for managing batch operations

### 🔍 **File Search & History**

Advanced file management system with comprehensive search capabilities:

- **Search Functionality**: Search by filename, peer ID, or file type
- **Filtering Options**: Filter by direction (sent/received) or status
- **File Type Detection**: Automatic file type recognition with appropriate icons
- **Transfer Details**: Comprehensive file information and metadata
- **Download Management**: Download received files directly from history
- **History Management**: Clear individual records or entire history

### 🪙 **Real Stellar Integration**

The token system integrates with actual Stellar testnet:

- **Real Balances**: Fetch actual XLM and token balances from Stellar testnet
- **Live Transactions**: All payments and token operations use real network
- **Transaction History**: Complete transaction history from the blockchain
- **Token Creation**: Create custom tokens on the Stellar network
- **Payment System**: Send payments in XLM and other Stellar assets

### 📱 **PWA Features**

Progressive Web App with native mobile capabilities:

- **Install Banner**: Automatic PWA installation prompts
- **Service Worker**: Offline functionality and background sync
- **Push Notifications**: Real-time notifications for file transfers
- **Mobile Optimized**: Touch-friendly interface and responsive design
- **Offline Support**: Works without internet connection
- **Background Sync**: Automatic synchronization when connection is restored

---

## 🚀 **Deployment**

### **Development**

```bash
npm start
```

### **Production Build**

```bash
npm run build
```

### **PWA Deployment**

The app is ready for PWA deployment with:

- Service worker for offline functionality
- Manifest file for app installation
- Optimized assets and caching

---

## 🤝 **Contributing**

We welcome contributions! Please feel free to submit a Pull Request.

1. **Fork** the repository
2. **Create** your feature branch (`git checkout -b feature/AmazingFeature`)
3. **Commit** your changes (`git commit -m 'Add some AmazingFeature'`)
4. **Push** to the branch (`git push origin feature/AmazingFeature`)
5. **Open** a Pull Request

### **Development Guidelines**

- Follow TypeScript best practices
- Use Redux Toolkit for state management
- Maintain PWA compatibility
- Test on both desktop and mobile devices

---

## 📄 **License**

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

---

<div align="center">

**Made with ❤️ and ⭐ Stellar**

_If you found this project helpful, please give it a ⭐!_

**Stellar P2P File Transfer Hub** - Secure, decentralized file sharing powered by the Stellar network

</div>
