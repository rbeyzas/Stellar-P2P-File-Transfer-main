import React from 'react';
import { Alert, Button, Space } from 'antd';
import { DownloadOutlined, CloseOutlined } from '@ant-design/icons';
import { usePWA } from '../hooks/usePWA';
// TODO: chrome da bu banner görünmüyor.
const PWABanner: React.FC = () => {
  const { canInstall, isInstalled, installApp } = usePWA();

  // Don't show banner if app is already installed or can't be installed
  if (isInstalled || !canInstall) {
    return null;
  }

  return (
    <Alert
      message="Install Stellar Transfer"
      description="Install this app on your device for a better experience. Get quick access to file transfers and token management."
      type="info"
      showIcon
      action={
        <Space>
          <Button
            size="small"
            type="primary"
            icon={<DownloadOutlined />}
            onClick={installApp}
            style={{
              background: '#FDDA24',
              color: '#0F0F0F',
              border: 'none',
              fontWeight: 600,
            }}
          >
            Install
          </Button>
          <Button
            size="small"
            icon={<CloseOutlined />}
            onClick={() => {
              // Hide banner logic
            }}
          />
        </Space>
      }
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        zIndex: 1000,
        borderRadius: 0,
        border: 'none',
        boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
      }}
    />
  );
};

export default PWABanner;
