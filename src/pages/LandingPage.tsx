import React from 'react';
import { Button, Typography, Card, Row, Col } from 'antd';
import {
  SendOutlined,
  RocketOutlined,
  SafetyOutlined,
  ThunderboltOutlined,
} from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';

const { Title, Paragraph } = Typography;

const LandingPage: React.FC = () => {
  const navigate = useNavigate();

  // Stellar Brand Colors
  const stellarColors = {
    gold: '#FDDA24',
    black: '#0F0F0F',
    white: '#F6F7F8',
  };

  return (
    <div
      style={{
        minHeight: '100vh',
        background: stellarColors.white,
        color: stellarColors.black,
        padding: '60px 20px',
        fontFamily: "'Inter', sans-serif",
      }}
    >
      <div
        style={{
          maxWidth: '1200px',
          margin: '0 auto',
          textAlign: 'center',
        }}
      >
        {/* Header */}
        <div>
          <Title
            level={1}
            style={{
              fontFamily: "'Anton', sans-serif",
              color: stellarColors.black,
              fontSize: '4rem',
              fontWeight: 700,
              textTransform: 'uppercase',
              marginBottom: '20px',
            }}
          >
            STELLAR P2P FILE TRANSFER
          </Title>
          <Paragraph
            style={{
              fontFamily: "'Lora', serif",
              fontSize: '1.3rem',
              color: '#555',
              marginBottom: '50px',
              maxWidth: '700px',
              marginLeft: 'auto',
              marginRight: 'auto',
            }}
          >
            Secure, decentralized file sharing powered by the Stellar blockchain and WebRTC
            technology. Real-world utility, unlocked.
          </Paragraph>
        </div>

        {/* Main Action Button */}
        <div style={{ marginBottom: '80px' }}>
          <Button
            type="primary"
            size="large"
            icon={<SendOutlined />}
            onClick={() => navigate('/app')}
            style={{
              height: '60px',
              padding: '0 50px',
              fontSize: '18px',
              background: stellarColors.black,
              border: 'none',
              color: stellarColors.gold,
              fontWeight: 600,
              textTransform: 'uppercase',
            }}
          >
            Get Started
          </Button>
        </div>

        {/* Features */}
        <div>
          <Row gutter={[40, 40]} justify="center">
            <Col xs={24} sm={12} md={8}>
              <Card
                bordered={false}
                style={{
                  background: 'white',
                  height: '100%',
                  padding: '20px',
                  boxShadow: '0 4px 15px rgba(0,0,0,0.05)',
                }}
              >
                <SafetyOutlined
                  style={{ fontSize: '3rem', color: stellarColors.black, marginBottom: '20px' }}
                />
                <Title
                  level={3}
                  style={{ fontFamily: "'Anton', sans-serif", color: stellarColors.black }}
                >
                  BLOCKCHAIN SECURITY
                </Title>
                <Paragraph style={{ fontFamily: "'Lora', serif", color: '#555' }}>
                  Permission-based access control using Stellar smart contracts ensures only
                  authorized users can connect.
                </Paragraph>
              </Card>
            </Col>

            <Col xs={24} sm={12} md={8}>
              <Card
                bordered={false}
                style={{
                  background: stellarColors.gold,
                  height: '100%',
                  padding: '20px',
                }}
              >
                <ThunderboltOutlined
                  style={{ fontSize: '3rem', color: stellarColors.black, marginBottom: '20px' }}
                />
                <Title
                  level={3}
                  style={{ fontFamily: "'Anton', sans-serif", color: stellarColors.black }}
                >
                  LIGHTNING FAST
                </Title>
                <Paragraph style={{ fontFamily: "'Lora', serif", color: stellarColors.black }}>
                  Direct peer-to-peer connections via WebRTC enable instant file transfers without
                  server intermediaries.
                </Paragraph>
              </Card>
            </Col>

            <Col xs={24} sm={12} md={8}>
              <Card
                bordered={false}
                style={{
                  background: 'white',
                  height: '100%',
                  padding: '20px',
                  boxShadow: '0 4px 15px rgba(0,0,0,0.05)',
                }}
              >
                <RocketOutlined
                  style={{ fontSize: '3rem', color: stellarColors.black, marginBottom: '20px' }}
                />
                <Title
                  level={3}
                  style={{ fontFamily: "'Anton', sans-serif", color: stellarColors.black }}
                >
                  DECENTRALIZED
                </Title>
                <Paragraph style={{ fontFamily: "'Lora', serif", color: '#555' }}>
                  Built on the Stellar network for transparent, immutable, and censorship-resistant
                  file sharing.
                </Paragraph>
              </Card>
            </Col>
          </Row>
        </div>

        {/* Footer */}
        <div style={{ marginTop: '80px' }}>
          <Paragraph
            style={{
              color: '#888',
              fontSize: '1rem',
              fontFamily: "'Inter', sans-serif",
            }}
          >
            Powered by Stellar & WebRTC
          </Paragraph>
        </div>
      </div>
    </div>
  );
};

export default LandingPage;
