#!/bin/bash

# Build Soroban Contract Script
# This script builds the file-transfer contract

set -e

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

echo -e "${BLUE}🔨 Building Soroban Contract...${NC}"

# Check if Soroban CLI is installed
if ! command -v soroban &> /dev/null; then
    echo -e "${RED}❌ Soroban CLI is not installed. Please install it first:${NC}"
    echo "curl -sSf https://soroban.stellar.org/install.sh | sh"
    exit 1
fi

# Check if contract directory exists
if [ ! -d "contracts/file-transfer" ]; then
    echo -e "${RED}❌ Contract directory not found. Please ensure contracts/file-transfer exists.${NC}"
    exit 1
fi

# Navigate to contract directory
cd contracts/file-transfer

echo -e "${YELLOW}📦 Building contract...${NC}"

# Build the contract
soroban contract build

if [ $? -eq 0 ]; then
    echo -e "${GREEN}✅ Contract built successfully!${NC}"
    echo -e "${GREEN}📁 WASM file: target/wasm32-unknown-unknown/release/file-transfer.wasm${NC}"
    
    # Show file size
    WASM_SIZE=$(ls -lh target/wasm32-unknown-unknown/release/file-transfer.wasm | awk '{print $5}')
    echo -e "${BLUE}📏 Contract size: ${WASM_SIZE}${NC}"
    
    # Generate contract bindings
    echo -e "${YELLOW}🔗 Generating contract bindings...${NC}"
    soroban contract bindings ts \
        --rpc-url https://soroban-testnet.stellar.org \
        --network-passphrase "Test SDF Network ; September 2015" \
        --output-dir ../../packages/file-transfer \
        target/wasm32-unknown-unknown/release/file-transfer.wasm
    
    if [ $? -eq 0 ]; then
        echo -e "${GREEN}✅ Contract bindings generated successfully!${NC}"
        
        # Build the client package
        cd ../../packages/file-transfer
        npm run build
        echo -e "${GREEN}✅ Client package built successfully${NC}"
        
        echo -e "${BLUE}🎉 Build completed successfully!${NC}"
        echo -e "${YELLOW}📝 Next steps:${NC}"
        echo "1. Deploy the contract: ./scripts/deploy-contract.sh"
        echo "2. Update the contract ID in your configuration"
        echo "3. Test the contract functionality"
        
    else
        echo -e "${RED}❌ Contract bindings generation failed!${NC}"
        exit 1
    fi
    
else
    echo -e "${RED}❌ Contract build failed!${NC}"
    exit 1
fi 