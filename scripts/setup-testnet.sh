#!/bin/bash

# Setup Stellar Testnet Account Script
# This script helps setup a testnet account and get test XLM

set -e

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

echo -e "${BLUE}🌟 Setting up Stellar Testnet Account...${NC}"

# Check if Soroban CLI is installed
if ! command -v soroban &> /dev/null; then
    echo -e "${RED}❌ Soroban CLI is not installed. Please install it first:${NC}"
    echo "curl -sSf https://soroban.stellar.org/install.sh | sh"
    exit 1
fi

# Check if identity exists
if ! soroban config identity list | grep -q "default"; then
    echo -e "${YELLOW}🔑 Creating new identity...${NC}"
    soroban config identity generate default
    echo -e "${GREEN}✅ Identity created successfully!${NC}"
else
    echo -e "${GREEN}✅ Identity already exists${NC}"
fi

# Get the public key
PUBLIC_KEY=$(soroban config identity address)
echo -e "${BLUE}📋 Public Key: ${PUBLIC_KEY}${NC}"

# Check if account exists on testnet
echo -e "${YELLOW}🔍 Checking account status on testnet...${NC}"

# Try to get account info
ACCOUNT_INFO=$(curl -s "https://horizon-testnet.stellar.org/accounts/${PUBLIC_KEY}")

if echo "$ACCOUNT_INFO" | grep -q "not_found"; then
    echo -e "${YELLOW}💰 Account not found. Requesting test XLM from friendbot...${NC}"
    
    # Request test XLM from friendbot
    RESPONSE=$(curl -s "https://friendbot.stellar.org/?addr=${PUBLIC_KEY}")
    
    if echo "$RESPONSE" | grep -q "success"; then
        echo -e "${GREEN}✅ Test XLM received successfully!${NC}"
        echo -e "${GREEN}💰 Account activated with 10,000 test XLM${NC}"
        
        # Wait a moment for the transaction to be processed
        echo -e "${YELLOW}⏳ Waiting for transaction to be processed...${NC}"
        sleep 5
        
    else
        echo -e "${RED}❌ Failed to get test XLM from friendbot${NC}"
        echo -e "${YELLOW}📝 Manual activation required:${NC}"
        echo "1. Visit: https://laboratory.stellar.org/#account-creator?network=test"
        echo "2. Enter your public key: ${PUBLIC_KEY}"
        echo "3. Click 'Create Account'"
        echo "4. Wait for activation and run this script again"
        exit 1
    fi
else
    echo -e "${GREEN}✅ Account already exists on testnet${NC}"
    
    # Get account balance
    BALANCE=$(echo "$ACCOUNT_INFO" | grep -o '"balance":"[^"]*"' | cut -d'"' -f4)
    echo -e "${BLUE}💎 Account balance: ${BALANCE} XLM${NC}"
fi

# Configure network
echo -e "${YELLOW}🌐 Configuring testnet network...${NC}"
soroban config network add --global testnet https://soroban-testnet.stellar.org

echo -e "${GREEN}✅ Testnet setup completed!${NC}"
echo -e "${BLUE}📋 Account Details:${NC}"
echo "Public Key: ${PUBLIC_KEY}"
echo "Network: testnet"
echo "RPC URL: https://soroban-testnet.stellar.org"

echo -e "${YELLOW}📝 Next steps:${NC}"
echo "1. Build the contract: ./scripts/build-contract.sh"
echo "2. Deploy the contract: ./scripts/deploy-contract.sh"
echo "3. Start the signaling server: cd server && npm start"
echo "4. Start the client: npm start" 