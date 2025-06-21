#!/bin/bash

# Check System Requirements Script
# Based on Stellar Validators Admin Guide

set -e

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

echo -e "${BLUE}🔍 Checking System Requirements...${NC}"

# Check OS
OS=$(uname -s)
if [[ "$OS" == "Linux" ]]; then
    echo -e "${GREEN}✅ Operating System: Linux${NC}"
elif [[ "$OS" == "Darwin" ]]; then
    echo -e "${GREEN}✅ Operating System: macOS${NC}"
else
    echo -e "${YELLOW}⚠️  Operating System: $OS (Linux/macOS recommended)${NC}"
fi

# Check Node.js version
if command -v node &> /dev/null; then
    NODE_VERSION=$(node --version | cut -d'v' -f2)
    NODE_MAJOR=$(echo $NODE_VERSION | cut -d'.' -f1)
    if [ "$NODE_MAJOR" -ge 16 ]; then
        echo -e "${GREEN}✅ Node.js: v$NODE_VERSION${NC}"
    else
        echo -e "${RED}❌ Node.js: v$NODE_VERSION (v16+ required)${NC}"
        echo -e "${YELLOW}📝 Please upgrade Node.js to version 16 or higher${NC}"
        exit 1
    fi
else
    echo -e "${RED}❌ Node.js not found${NC}"
    echo -e "${YELLOW}📝 Please install Node.js v16 or higher${NC}"
    exit 1
fi

# Check npm
if command -v npm &> /dev/null; then
    NPM_VERSION=$(npm --version)
    echo -e "${GREEN}✅ npm: v$NPM_VERSION${NC}"
else
    echo -e "${RED}❌ npm not found${NC}"
    exit 1
fi

# Check Rust
if command -v rustc &> /dev/null; then
    RUST_VERSION=$(rustc --version | cut -d' ' -f2)
    echo -e "${GREEN}✅ Rust: $RUST_VERSION${NC}"
else
    echo -e "${YELLOW}⚠️  Rust not found${NC}"
    echo -e "${YELLOW}📝 Installing Rust...${NC}"
    curl --proto '=https' --tlsv1.2 -sSf https://sh.rustup.rs | sh -s -- -y
    source ~/.bashrc 2>/dev/null || source ~/.zshrc 2>/dev/null
    echo -e "${GREEN}✅ Rust installed successfully${NC}"
fi

# Check Soroban CLI
if command -v soroban &> /dev/null; then
    SOROBAN_VERSION=$(soroban --version | head -n1)
    echo -e "${GREEN}✅ Soroban CLI: $SOROBAN_VERSION${NC}"
else
    echo -e "${YELLOW}⚠️  Soroban CLI not found${NC}"
    echo -e "${YELLOW}📝 Installing Soroban CLI...${NC}"
    curl -sSf https://soroban.stellar.org/install.sh | sh
    source ~/.bashrc 2>/dev/null || source ~/.zshrc 2>/dev/null
    echo -e "${GREEN}✅ Soroban CLI installed successfully${NC}"
fi

# Check available memory
if [[ "$OS" == "Linux" ]]; then
    MEMORY_KB=$(grep MemTotal /proc/meminfo | awk '{print $2}')
    MEMORY_GB=$((MEMORY_KB / 1024 / 1024))
elif [[ "$OS" == "Darwin" ]]; then
    MEMORY_GB=$(sysctl -n hw.memsize | awk '{print $0/1024/1024/1024}')
fi

if [ "$MEMORY_GB" -ge 4 ]; then
    echo -e "${GREEN}✅ Memory: ${MEMORY_GB}GB (4GB+ recommended)${NC}"
else
    echo -e "${YELLOW}⚠️  Memory: ${MEMORY_GB}GB (4GB+ recommended)${NC}"
fi

# Check available disk space
if [[ "$OS" == "Linux" ]]; then
    DISK_GB=$(df -BG . | tail -1 | awk '{print $4}' | sed 's/G//')
elif [[ "$OS" == "Darwin" ]]; then
    DISK_GB=$(df -g . | tail -1 | awk '{print $4}')
fi

if [ "$DISK_GB" -ge 10 ]; then
    echo -e "${GREEN}✅ Disk Space: ${DISK_GB}GB available (10GB+ recommended)${NC}"
else
    echo -e "${YELLOW}⚠️  Disk Space: ${DISK_GB}GB available (10GB+ recommended)${NC}"
fi

# Check network connectivity
echo -e "${YELLOW}🌐 Testing network connectivity...${NC}"
if curl -s --max-time 10 https://soroban-testnet.stellar.org > /dev/null; then
    echo -e "${GREEN}✅ Soroban Testnet RPC: Accessible${NC}"
else
    echo -e "${RED}❌ Soroban Testnet RPC: Not accessible${NC}"
fi

if curl -s --max-time 10 https://horizon-testnet.stellar.org > /dev/null; then
    echo -e "${GREEN}✅ Horizon Testnet: Accessible${NC}"
else
    echo -e "${RED}❌ Horizon Testnet: Not accessible${NC}"
fi

echo -e "${BLUE}🎉 System requirements check completed!${NC}"
echo -e "${YELLOW}📝 Next step: npm run setup${NC}" 