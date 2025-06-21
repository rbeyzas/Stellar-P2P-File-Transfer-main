import React, { useState, useEffect } from 'react';
import {
  Button,
  Card,
  Typography,
  Space,
  message,
  Input,
  InputNumber,
  Alert,
  Divider,
  Row,
  Col,
} from 'antd';
import { WalletOutlined, SendOutlined, SwapOutlined, HistoryOutlined } from '@ant-design/icons';
import { StellarWalletsKit } from '@creit.tech/stellar-wallets-kit';

const { Title, Text } = Typography;

interface TokenSystemProps {
  kit: StellarWalletsKit | null;
  address: string | null;
}

interface TokenBalance {
  asset: string;
  balance: string;
  issuer?: string;
}

const TokenSystem: React.FC<TokenSystemProps> = ({ kit, address }) => {
  const [balances, setBalances] = useState<TokenBalance[]>([]);
  const [recipientAddress, setRecipientAddress] = useState('');
  const [amount, setAmount] = useState<number>(0);
  const [selectedAsset, setSelectedAsset] = useState('XLM');
  const [loading, setLoading] = useState(false);
  const [transactionHistory, setTransactionHistory] = useState<any[]>([]);

  // Stellar Brand Colors
  const stellarColors = {
    gold: '#FDDA24',
    black: '#0F0F0F',
    white: '#F6F7F8',
  };

  useEffect(() => {
    if (address) {
      fetchBalances();
      fetchTransactionHistory();
    }
  }, [address]);

  const fetchBalances = async () => {
    if (!address) return;

    try {
      // Mock balances for demo - in real implementation, fetch from Stellar Horizon
      const mockBalances: TokenBalance[] = [
        { asset: 'XLM', balance: '1000.0000000' },
        {
          asset: 'USDC',
          balance: '500.0000000',
          issuer: 'GA5ZSEJYB37JRC5AVCIA5MOP4RHTM335X2KGX3IHOJAPP5RE34KUEZVN',
        },
        {
          asset: 'EURT',
          balance: '250.0000000',
          issuer: 'GAP5LETOV6YIE62YAM56STDANPRDO7ZFDBGSNHJQIYGGKSMOZAHOOS2S',
        },
      ];
      setBalances(mockBalances);
    } catch (error) {
      console.error('Failed to fetch balances:', error);
      message.error('Failed to fetch token balances');
    }
  };

  const fetchTransactionHistory = async () => {
    if (!address) return;

    try {
      // Mock transaction history
      const mockHistory = [
        {
          id: '1',
          type: 'payment',
          amount: '50.0000000',
          asset: 'XLM',
          recipient: 'GABC...',
          timestamp: new Date().toISOString(),
        },
        {
          id: '2',
          type: 'payment',
          amount: '25.0000000',
          asset: 'USDC',
          recipient: 'GDEF...',
          timestamp: new Date(Date.now() - 86400000).toISOString(),
        },
      ];
      setTransactionHistory(mockHistory);
    } catch (error) {
      console.error('Failed to fetch transaction history:', error);
    }
  };

  const sendPayment = async () => {
    if (!kit || !address || !recipientAddress.trim() || amount <= 0) {
      message.error('Please fill all required fields');
      return;
    }

    setLoading(true);
    try {
      // Mock payment - in real implementation, use Stellar SDK
      await new Promise((resolve) => setTimeout(resolve, 2000));

      message.success(`Successfully sent ${amount} ${selectedAsset} to ${recipientAddress}`);
      setRecipientAddress('');
      setAmount(0);

      // Refresh balances and history
      fetchBalances();
      fetchTransactionHistory();
    } catch (error) {
      console.error('Payment failed:', error);
      message.error('Payment failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const createCustomToken = async () => {
    if (!kit || !address) {
      message.error('Wallet not connected');
      return;
    }

    setLoading(true);
    try {
      // Mock token creation - in real implementation, use Stellar SDK
      await new Promise((resolve) => setTimeout(resolve, 3000));

      message.success('Custom token created successfully!');
      fetchBalances();
    } catch (error) {
      console.error('Token creation failed:', error);
      message.error('Failed to create custom token');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card
      title={
        <Title
          level={4}
          style={{
            fontFamily: "'Anton', sans-serif",
            textTransform: 'uppercase',
            margin: 0,
            color: stellarColors.black,
          }}
        >
          <WalletOutlined style={{ marginRight: 8 }} />
          Token System
        </Title>
      }
      style={{ background: stellarColors.white, marginBottom: 24 }}
    >
      <Space direction="vertical" size="large" style={{ width: '100%' }}>
        {/* Token Balances */}
        <div>
          <Title level={5} style={{ fontFamily: "'Inter', sans-serif", marginBottom: 16 }}>
            Token Balances
          </Title>
          <Space direction="vertical" style={{ width: '100%' }}>
            {balances.map((balance, index) => (
              <Card
                key={index}
                size="small"
                style={{
                  background: index === 0 ? stellarColors.gold : '#f5f5f5',
                  border: 'none',
                }}
              >
                <Row justify="space-between" align="middle">
                  <Col>
                    <Text strong style={{ color: index === 0 ? stellarColors.black : 'inherit' }}>
                      {balance.asset}
                    </Text>
                  </Col>
                  <Col>
                    <Text style={{ color: index === 0 ? stellarColors.black : 'inherit' }}>
                      {parseFloat(balance.balance).toFixed(2)}
                    </Text>
                  </Col>
                </Row>
              </Card>
            ))}
          </Space>
        </div>

        <Divider />

        {/* Send Payment */}
        <div>
          <Title level={5} style={{ fontFamily: "'Inter', sans-serif", marginBottom: 16 }}>
            Send Payment
          </Title>
          <Space direction="vertical" style={{ width: '100%' }}>
            <Input
              placeholder="Recipient Stellar Address"
              value={recipientAddress}
              onChange={(e) => setRecipientAddress(e.target.value)}
              size="large"
              style={{ borderRadius: 0 }}
            />
            <Space.Compact style={{ width: '100%' }}>
              <InputNumber
                placeholder="Amount"
                value={amount}
                onChange={(value) => setAmount(value || 0)}
                min={0}
                step={0.0000001}
                precision={7}
                size="large"
                style={{ flex: 1, borderRadius: 0 }}
              />
              <select
                value={selectedAsset}
                onChange={(e) => setSelectedAsset(e.target.value)}
                style={{
                  padding: '8px 12px',
                  border: '1px solid #d9d9d9',
                  borderRadius: 0,
                  fontSize: 14,
                }}
              >
                {balances.map((balance) => (
                  <option key={balance.asset} value={balance.asset}>
                    {balance.asset}
                  </option>
                ))}
              </select>
            </Space.Compact>
            <Button
              type="primary"
              icon={<SendOutlined />}
              onClick={sendPayment}
              loading={loading}
              disabled={!recipientAddress.trim() || amount <= 0}
              size="large"
              style={{
                width: '100%',
                background: stellarColors.black,
                color: stellarColors.gold,
                border: 'none',
                borderRadius: 0,
                fontWeight: 600,
              }}
            >
              Send Payment
            </Button>
          </Space>
        </div>

        <Divider />

        {/* Create Custom Token */}
        <div>
          <Title level={5} style={{ fontFamily: "'Inter', sans-serif", marginBottom: 16 }}>
            Create Custom Token
          </Title>
          <Alert
            message="Stellar Ecosystem Integration"
            description="Create your own tokens on the Stellar network. This feature leverages Stellar's built-in tokenization capabilities."
            type="info"
            showIcon
            style={{ marginBottom: 16 }}
          />
          <Button
            icon={<SwapOutlined />}
            onClick={createCustomToken}
            loading={loading}
            size="large"
            style={{
              width: '100%',
              background: stellarColors.gold,
              color: stellarColors.black,
              border: 'none',
              borderRadius: 0,
              fontWeight: 600,
            }}
          >
            Create Custom Token
          </Button>
        </div>

        <Divider />

        {/* Transaction History */}
        <div>
          <Title level={5} style={{ fontFamily: "'Inter', sans-serif", marginBottom: 16 }}>
            <HistoryOutlined style={{ marginRight: 8 }} />
            Recent Transactions
          </Title>
          <Space direction="vertical" style={{ width: '100%' }}>
            {transactionHistory.map((tx) => (
              <Card key={tx.id} size="small" style={{ background: '#f9f9f9', border: 'none' }}>
                <Row justify="space-between" align="middle">
                  <Col>
                    <Text strong>{tx.type.toUpperCase()}</Text>
                    <br />
                    <Text type="secondary" style={{ fontSize: 12 }}>
                      {new Date(tx.timestamp).toLocaleDateString()}
                    </Text>
                  </Col>
                  <Col>
                    <Text strong>
                      {tx.amount} {tx.asset}
                    </Text>
                    <br />
                    <Text type="secondary" style={{ fontSize: 12 }}>
                      To: {tx.recipient}
                    </Text>
                  </Col>
                </Row>
              </Card>
            ))}
          </Space>
        </div>
      </Space>
    </Card>
  );
};

export default TokenSystem;
