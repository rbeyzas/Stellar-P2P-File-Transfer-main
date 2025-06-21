#!/bin/bash

# Deploy Soroban Contract Script
# This script deploys the file-transfer contract to Stellar testnet

set -e

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

echo -e "${BLUE}🚀 Deploying Soroban Contract to Testnet...${NC}"

# Check if Soroban CLI is installed
if ! command -v soroban &> /dev/null; then
    echo -e "${RED}❌ Soroban CLI is not installed. Please install it first:${NC}"
    echo "curl -sSf https://soroban.stellar.org/install.sh | sh"
    exit 1
fi

# Check if WASM file exists
if [ ! -f "contracts/file-transfer/target/wasm32v1-none/release/file_transfer.wasm" ]; then
    echo -e "${RED}❌ WASM file not found. Please build the contract first:${NC}"
    echo "./scripts/build-contract.sh"
    exit 1
fi

# Check if identity exists
if [ ! -f ".stellar/identity/test-account.toml" ]; then
    echo -e "${RED}❌ No identity found. Please setup testnet account first:${NC}"
    echo "./scripts/setup-testnet.sh"
    exit 1
fi

# Get the public key
PUBLIC_KEY=$(soroban keys public-key test-account)
echo -e "${BLUE}📋 Deploying with account: ${PUBLIC_KEY}${NC}"

# Check account balance
echo -e "${YELLOW}💰 Checking account balance...${NC}"
BALANCE=$(curl -s "https://horizon-testnet.stellar.org/accounts/${PUBLIC_KEY}" | grep -o '"balance":"[^"]*"' | cut -d'"' -f4)
echo -e "${BLUE}💎 Account balance: ${BALANCE} XLM${NC}"

# Deploy the contract
echo -e "${YELLOW}🚀 Deploying contract...${NC}"

CONTRACT_ID=$(soroban contract deploy \
    --network testnet \
    --source-account test-account \
    --wasm contracts/file-transfer/target/wasm32v1-none/release/file_transfer.wasm)

if [ $? -eq 0 ]; then
    echo -e "${GREEN}✅ Contract deployed successfully!${NC}"
    echo -e "${GREEN}📋 Contract ID: ${CONTRACT_ID}${NC}"
    
    # Update the contract ID in the client configuration
    echo -e "${YELLOW}🔧 Updating client configuration...${NC}"
    
    # Update packages/file-transfer/src/index.ts
    sed -i.bak "s/contractId: \".*\"/contractId: \"${CONTRACT_ID}\"/" packages/file-transfer/src/index.ts
    
    # Update packages/file-transfer/dist/index.js
    sed -i.bak "s/contractId: \".*\"/contractId: \"${CONTRACT_ID}\"/" packages/file-transfer/dist/index.js
    
    # Update packages/file-transfer/dist/index.d.ts
    sed -i.bak "s/contractId: \".*\"/contractId: \"${CONTRACT_ID}\"/" packages/file-transfer/dist/index.d.ts
    
    echo -e "${GREEN}✅ Client configuration updated${NC}"
    
    # Build the client package
    echo -e "${YELLOW}🔨 Building client package...${NC}"
    cd packages/file-transfer
    npm run build
    echo -e "${GREEN}✅ Client package built successfully${NC}"
    
    # Create .env file with contract ID
    cd ../..
    if [ ! -f ".env" ]; then
        echo -e "${YELLOW}📝 Creating .env file...${NC}"
        cat > .env << EOF
# Stellar Network Configuration
REACT_APP_STELLAR_NETWORK=testnet
REACT_APP_SOROBAN_RPC_URL=https://soroban-testnet.stellar.org
REACT_APP_STELLAR_RPC_URL=https://horizon-testnet.stellar.org
REACT_APP_NETWORK_PASSPHRASE="Test SDF Network ; September 2015"

# Smart Contract Configuration
REACT_APP_CONTRACT_ID=${CONTRACT_ID}

# PeerJS Signaling Server
REACT_APP_PEERJS_HOST=localhost
REACT_APP_PEERJS_PORT=9000
REACT_APP_PEERJS_PATH=/peerjs
REACT_APP_PEERJS_KEY=peerjs

# Application Configuration
REACT_APP_CLIENT_URL=http://localhost:3000
NODE_ENV=development
REACT_APP_DEBUG=false
EOF
        echo -e "${GREEN}✅ .env file created${NC}"
    else
        echo -e "${YELLOW}📝 Updating .env file...${NC}"
        sed -i.bak "s/REACT_APP_CONTRACT_ID=.*/REACT_APP_CONTRACT_ID=${CONTRACT_ID}/" .env
        echo -e "${GREEN}✅ .env file updated${NC}"
    fi
    
    echo -e "${BLUE}🎉 Deployment completed successfully!${NC}"
    echo -e "${YELLOW}📝 Contract Details:${NC}"
    echo "Contract ID: ${CONTRACT_ID}"
    echo "Network: testnet"
    echo "RPC URL: https://soroban-testnet.stellar.org"
    
    echo -e "${YELLOW}📝 Next steps:${NC}"
    echo "1. Start the signaling server: cd server && npm start"
    echo "2. Start the client: npm start"
    echo "3. Test the file transfer functionality"
    
    # Save contract ID to a file for reference
    echo "${CONTRACT_ID}" > .contract-id
    echo -e "${GREEN}✅ Contract ID saved to .contract-id${NC}"
    
else
    echo -e "${RED}❌ Contract deployment failed!${NC}"
    exit 1
fi 