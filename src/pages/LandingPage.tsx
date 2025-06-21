import React from 'react';
import { Button, Typography, Space, Card } from 'antd';
import {
  SendOutlined,
  DownloadOutlined,
  RocketOutlined,
  SafetyOutlined,
  ThunderboltOutlined,
} from '@ant-design/icons';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';

const { Title, Paragraph } = Typography;

const LandingPage: React.FC = () => {
  const navigate = useNavigate();

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        duration: 0.8,
        staggerChildren: 0.3,
      },
    },
  };

  const itemVariants = {
    hidden: { y: 50, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        duration: 0.6,
        ease: 'easeOut',
      },
    },
  };

  const buttonVariants = {
    hover: {
      scale: 1.05,
      boxShadow: '0 8px 25px rgba(22, 119, 255, 0.3)',
      transition: {
        duration: 0.3,
        ease: 'easeInOut',
      },
    },
    tap: {
      scale: 0.95,
    },
  };

  const featureVariants = {
    hover: {
      y: -10,
      transition: {
        duration: 0.3,
        ease: 'easeInOut',
      },
    },
  };

  return (
    <div
      style={{
        minHeight: '100vh',
        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
        padding: '20px',
        overflow: 'hidden',
      }}
    >
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        style={{
          maxWidth: '1200px',
          margin: '0 auto',
          textAlign: 'center',
          color: 'white',
        }}
      >
        {/* Header */}
        <motion.div variants={itemVariants}>
          <Title
            level={1}
            style={{
              color: 'white',
              fontSize: '3.5rem',
              fontWeight: 700,
              marginBottom: '20px',
              textShadow: '2px 2px 4px rgba(0,0,0,0.3)',
            }}
          >
            <RocketOutlined style={{ marginRight: '20px' }} />
            Stellar P2P File Transfer
          </Title>
          <Paragraph
            style={{
              fontSize: '1.3rem',
              color: 'rgba(255,255,255,0.9)',
              marginBottom: '50px',
              maxWidth: '600px',
              marginLeft: 'auto',
              marginRight: 'auto',
            }}
          >
            Secure, decentralized file sharing powered by Stellar blockchain and WebRTC technology
          </Paragraph>
        </motion.div>

        {/* Main Action Buttons */}
        <motion.div variants={itemVariants} style={{ marginBottom: '80px' }}>
          <Space size="large" wrap style={{ justifyContent: 'center' }}>
            <motion.div variants={buttonVariants} whileHover="hover" whileTap="tap">
              <Button
                type="primary"
                size="large"
                icon={<SendOutlined />}
                onClick={() => navigate('/app')}
                style={{
                  height: '60px',
                  padding: '0 40px',
                  fontSize: '18px',
                  borderRadius: '30px',
                  background: 'linear-gradient(45deg, #ff6b6b, #ee5a24)',
                  border: 'none',
                  boxShadow: '0 4px 15px rgba(255, 107, 107, 0.4)',
                }}
              >
                Send File
              </Button>
            </motion.div>

            <motion.div variants={buttonVariants} whileHover="hover" whileTap="tap">
              <Button
                size="large"
                icon={<DownloadOutlined />}
                onClick={() => navigate('/app')}
                style={{
                  height: '60px',
                  padding: '0 40px',
                  fontSize: '18px',
                  borderRadius: '30px',
                  background: 'rgba(255,255,255,0.2)',
                  border: '2px solid rgba(255,255,255,0.3)',
                  color: 'white',
                  backdropFilter: 'blur(10px)',
                }}
              >
                Receive File
              </Button>
            </motion.div>
          </Space>
        </motion.div>

        {/* Features */}
        <motion.div variants={itemVariants}>
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
              gap: '30px',
              marginTop: '60px',
            }}
          >
            <motion.div variants={featureVariants} whileHover="hover">
              <Card
                style={{
                  background: 'rgba(255,255,255,0.1)',
                  border: '1px solid rgba(255,255,255,0.2)',
                  borderRadius: '20px',
                  backdropFilter: 'blur(10px)',
                  height: '100%',
                }}
              >
                <SafetyOutlined
                  style={{ fontSize: '3rem', color: '#52c41a', marginBottom: '20px' }}
                />
                <Title level={3} style={{ color: 'white', marginBottom: '15px' }}>
                  Blockchain Security
                </Title>
                <Paragraph style={{ color: 'rgba(255,255,255,0.8)' }}>
                  Permission-based access control using Stellar smart contracts ensures only
                  authorized users can transfer files.
                </Paragraph>
              </Card>
            </motion.div>

            <motion.div variants={featureVariants} whileHover="hover">
              <Card
                style={{
                  background: 'rgba(255,255,255,0.1)',
                  border: '1px solid rgba(255,255,255,0.2)',
                  borderRadius: '20px',
                  backdropFilter: 'blur(10px)',
                  height: '100%',
                }}
              >
                <ThunderboltOutlined
                  style={{ fontSize: '3rem', color: '#faad14', marginBottom: '20px' }}
                />
                <Title level={3} style={{ color: 'white', marginBottom: '15px' }}>
                  Lightning Fast
                </Title>
                <Paragraph style={{ color: 'rgba(255,255,255,0.8)' }}>
                  Direct peer-to-peer connections via WebRTC enable instant file transfers without
                  server intermediaries.
                </Paragraph>
              </Card>
            </motion.div>

            <motion.div variants={featureVariants} whileHover="hover">
              <Card
                style={{
                  background: 'rgba(255,255,255,0.1)',
                  border: '1px solid rgba(255,255,255,0.2)',
                  borderRadius: '20px',
                  backdropFilter: 'blur(10px)',
                  height: '100%',
                }}
              >
                <RocketOutlined
                  style={{ fontSize: '3rem', color: '#1890ff', marginBottom: '20px' }}
                />
                <Title level={3} style={{ color: 'white', marginBottom: '15px' }}>
                  Decentralized
                </Title>
                <Paragraph style={{ color: 'rgba(255,255,255,0.8)' }}>
                  Built on Stellar blockchain for transparent, immutable, and censorship-resistant
                  file sharing.
                </Paragraph>
              </Card>
            </motion.div>
          </div>
        </motion.div>

        {/* Footer */}
        <motion.div variants={itemVariants} style={{ marginTop: '80px' }}>
          <Paragraph
            style={{
              color: 'rgba(255,255,255,0.7)',
              fontSize: '1rem',
            }}
          >
            Powered by Stellar Blockchain & WebRTC Technology
          </Paragraph>
        </motion.div>
      </motion.div>
    </div>
  );
};

export default LandingPage;
