# 🌟 Stellar P2P File Transfer

<div align="center">

![Stellar](https://img.shields.io/badge/Stellar-7D00FF?style=for-the-badge&logo=stellar&logoColor=white)
![React](https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB)
![TypeScript](https://img.shields.io/badge/TypeScript-007ACC?style=for-the-badge&logo=typescript&logoColor=white)
![WebRTC](https://img.shields.io/badge/WebRTC-333333?style=for-the-badge&logo=webrtc&logoColor=white)

**Secure • Decentralized • Permission-Based File Transfer**

*A modern peer-to-peer file transfer application built on the Stellar blockchain with beautiful UI and advanced permission management.*

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

### 🎨 **Modern User Interface**
- **Beautiful Design**: Modern gradient-based UI with smooth animations
- **Responsive Layout**: Works perfectly on desktop and mobile devices
- **Intuitive UX**: Simple and user-friendly interface for all skill levels
- **Real-time Feedback**: Live status updates and progress indicators

### 🛡️ **Permission Management**
- **Grant Permissions**: Allow specific wallets to send you files
- **Revoke Access**: Remove file transfer permissions at any time
- **Permission Verification**: Automatic permission checking before file transfers

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

---

## 🏗️ Project Structure

```
stellar-p2p-file-transfer/
├── 📦 packages/
│   └── file-transfer/          # Stellar smart contract integration
│       ├── src/
│       │   └── index.ts        # Contract client wrapper
│       └── package.json
├── 🌐 public/                 # Static assets
├── ⚛️  src/
│   ├── App.tsx                 # Main application component
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

| Technology | Purpose | Version |
|------------|---------|---------|
| **React** | Frontend Framework | ^18.0 |
| **TypeScript** | Type Safety | ^4.9 |
| **Stellar SDK** | Blockchain Integration | Latest |
| **WebRTC** | P2P Communication | Native |
| **Ant Design** | UI Components | ^5.0 |
| **Redux Toolkit** | State Management | ^1.9 |

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

*If you found this project helpful, please give it a ⭐!*

</div>
