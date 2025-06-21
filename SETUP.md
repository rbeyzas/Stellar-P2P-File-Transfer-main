# 🚀 Stellar P2P File Transfer - Complete Setup Guide

Bu rehber, [Stellar Validators Admin Guide](https://developers.stellar.org/docs/validators/admin-guide/installation) dokümantasyonuna dayanarak Stellar P2P File Transfer uygulamasını sıfırdan kurmanız için gerekli tüm adımları içerir.

## 📋 Gereksinimler

### Sistem Gereksinimleri

- **Operating System**: Linux (Ubuntu 20.04+ recommended) veya macOS
- **Node.js**: v16 veya üzeri
- **npm**: v8 veya üzeri
- **Rust**: Latest stable version
- **Soroban CLI**: Latest version
- **Memory**: 4GB+ RAM (8GB+ recommended)
- **Disk Space**: 10GB+ available space
- **Network**: Stable internet connection
- **Stellar Wallet**: XBULL, Freighter, vb.

### Otomatik Gereksinim Kontrolü

```bash
# Sistem gereksinimlerini kontrol edin
npm run check-requirements
```

Bu komut:

- İşletim sistemini kontrol eder
- Node.js ve npm versiyonlarını doğrular
- Rust ve Soroban CLI kurulumunu kontrol eder
- Bellek ve disk alanını kontrol eder
- Network bağlantısını test eder

## 🔧 Kurulum Adımları

### Adım 1: Sistem Gereksinimleri Kontrolü

```bash
# Sistem gereksinimlerini kontrol edin
npm run check-requirements
```

Eksik bileşenler otomatik olarak kurulacaktır.

### Adım 2: Testnet Hesabı Kurulumu

```bash
# Testnet hesabını kurun ve test XLM alın
npm run setup
```

Bu komut:

- Yeni bir Soroban identity oluşturur
- Testnet hesabını aktifleştirir
- 10,000 test XLM alır
- Network konfigürasyonunu yapar

### Adım 3: Smart Contract Build

```bash
# Smart contract'ı build edin
npm run build-contract
```

Bu komut:

- Rust contract'ını WASM'e derler
- TypeScript bindings oluşturur
- Client package'ı build eder

### Adım 4: Smart Contract Deploy

```bash
# Contract'ı testnet'e deploy edin
npm run deploy-contract
```

Bu komut:

- Contract'ı Stellar testnet'e deploy eder
- Contract ID'yi client konfigürasyonuna ekler
- `.env` dosyasını oluşturur

### Adım 5: Signaling Server Başlatma

```bash
# PeerJS signaling server'ı başlatın
npm run start-server
```

Bu komut:

- PeerJS server'ını port 9000'de başlatır
- STUN/TURN server konfigürasyonunu yapar
- CORS ayarlarını yapar

### Adım 6: Client Uygulamasını Başlatma

```bash
# React uygulamasını başlatın
npm start
```

Bu komut:

- React development server'ını port 3000'de başlatır
- Hot reload özelliğini aktifleştirir

### Adım 7: Geliştirme Modu (İsteğe Bağlı)

```bash
# Hem server hem client'ı aynı anda başlatın
npm run dev
```

### 🚀 Hızlı Kurulum (Tüm Adımlar)

```bash
# Tüm kurulum adımlarını tek seferde çalıştırın
npm run full-setup
```

## 🧪 Test Etme

### 1. **Wallet Bağlantısı Testi**

1. Uygulamayı açın: `http://localhost:3000`
2. "Connect Wallet" butonuna tıklayın
3. Stellar wallet'ınızı seçin (XBULL, Freighter, vb.)
4. Bağlantının başarılı olduğunu doğrulayın

### 2. **Permission Yönetimi Testi**

1. Settings butonuna tıklayın
2. Başka bir wallet adresi girin
3. "Grant" butonuna tıklayın
4. Transaction'ı onaylayın
5. Permission'ın verildiğini doğrulayın

### 3. **P2P Bağlantı Testi**

1. İki farklı tarayıcıda uygulamayı açın
2. Her iki tarayıcıda da wallet bağlayın
3. Birbirlerine permission verin
4. Peer ID'leri paylaşın
5. Bağlantı kurun

### 4. **Dosya Transfer Testi**

1. P2P bağlantısı kurulduktan sonra
2. Dosya seçin
3. "Send" butonuna tıklayın
4. Dosyanın başarıyla transfer edildiğini doğrulayın

## 🔍 Sorun Giderme

### Sorun 1: Soroban CLI Bulunamıyor

```bash
# PATH'i kontrol edin
echo $PATH

# Soroban CLI'yi yeniden kurun
curl -sSf https://soroban.stellar.org/install.sh | sh
source ~/.bashrc  # veya source ~/.zshrc
```

### Sorun 2: Contract Build Hatası

```bash
# Rust toolchain'i güncelleyin
rustup update

# Contract'ı temizleyin ve yeniden build edin
cd contracts/file-transfer
cargo clean
cargo build --release
```

### Sorun 3: PeerJS Bağlantı Hatası

```bash
# Signaling server'ın çalıştığını kontrol edin
curl http://localhost:3001/health

# Port'ların açık olduğunu kontrol edin
lsof -i :9000
lsof -i :3001
```

### Sorun 4: Wallet Bağlantı Hatası

```bash
# Network konfigürasyonunu kontrol edin
soroban config network list

# Testnet network'ünü ekleyin
soroban config network add --global testnet https://soroban-testnet.stellar.org
```

### Sorun 5: Sistem Gereksinimleri

```bash
# Sistem gereksinimlerini tekrar kontrol edin
npm run check-requirements

# Eksik bileşenleri manuel olarak kurun
# Node.js: https://nodejs.org/
# Rust: https://rustup.rs/
# Soroban CLI: https://soroban.stellar.org/
```

## 📁 Proje Yapısı

```
stellar-p2p-file-transfer/
├── 📦 contracts/
│   └── file-transfer/          # Soroban smart contract
│       ├── src/
│       │   └── lib.rs          # Contract source code
│       └── Cargo.toml          # Rust dependencies
├── 📦 packages/
│   └── file-transfer/          # TypeScript client
│       ├── src/
│       │   └── index.ts        # Contract client wrapper
│       └── package.json
├── 🌐 server/                  # PeerJS signaling server
│   ├── server.js               # Server implementation
│   └── package.json
├── ⚛️  src/                    # React application
│   ├── App.tsx                 # Main component
│   ├── helpers/                # Utility functions
│   └── store/                  # Redux store
├── 🔧 scripts/                 # Build & deployment scripts
│   ├── check-requirements.sh   # System requirements check
│   ├── setup-testnet.sh        # Testnet setup
│   ├── build-contract.sh       # Contract build
│   └── deploy-contract.sh      # Contract deployment
└── 📄 README.md
```

## 🔐 Güvenlik Notları

1. **Testnet Kullanımı**: Bu uygulama testnet üzerinde çalışır, gerçek XLM kullanmaz
2. **Private Key Güvenliği**: Private key'lerinizi asla paylaşmayın
3. **Permission Yönetimi**: Sadece güvendiğiniz adreslere permission verin
4. **P2P Güvenliği**: WebRTC bağlantıları şifrelidir ancak ek güvenlik önlemleri alınabilir
5. **Network Security**: Production ortamında güvenli RPC endpoint'leri kullanın

## 🚀 Production'a Geçiş

Production ortamına geçmek için:

### 1. **Mainnet Contract Deploy**

```bash
# Mainnet network'ünü ekleyin
soroban config network add --global mainnet https://soroban-mainnet.stellar.org

# Contract'ı mainnet'e deploy edin
soroban contract deploy --network mainnet --source-account default contract.wasm
```

### 2. **Environment Variables**

```bash
# .env dosyasını production için güncelleyin
REACT_APP_STELLAR_NETWORK=mainnet
REACT_APP_SOROBAN_RPC_URL=https://soroban-mainnet.stellar.org
REACT_APP_CONTRACT_ID=<MAINNET_CONTRACT_ID>
```

### 3. **TURN Server Kurulumu**

```bash
# Production için TURN server kurun
# server/server.js dosyasında TURN server konfigürasyonunu aktifleştirin
```

### 4. **SSL/TLS Sertifikaları**

```bash
# Production için SSL sertifikaları kurun
# Let's Encrypt veya başka bir CA'dan sertifika alın
```

## 📞 Destek

Sorun yaşarsanız:

1. **GitHub Issues**: Proje repository'sinde sorun bildirin
2. **Soroban Discord**: [Soroban Discord](https://discord.gg/soroban) kanalında yardım isteyin
3. **Stellar Community**: [Stellar Community](https://community.stellar.org/) forumunda destek alın
4. **Stellar Documentation**: [Stellar Docs](https://developers.stellar.org/) referans olarak kullanın

## 📚 Ek Kaynaklar

- [Stellar Validators Admin Guide](https://developers.stellar.org/docs/validators/admin-guide/installation)
- [Soroban Documentation](https://soroban.stellar.org/docs)
- [Stellar Wallets Kit](https://github.com/Creit-Tech/stellar-wallets-kit)
- [PeerJS Documentation](https://peerjs.com/docs)

---

**🎉 Tebrikler!** Artık tam fonksiyonel bir P2P dosya transfer uygulamanız var!
