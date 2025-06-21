import React, { useState } from 'react';
import { Card, Progress, Typography, Space, Button, List, Tag, Alert, Divider, Badge } from 'antd';
import {
  FileOutlined,
  CheckCircleOutlined,
  CloseCircleOutlined,
  ClockCircleOutlined,
  LoadingOutlined,
  ClearOutlined,
} from '@ant-design/icons';
import { UploadFile } from 'antd/es/upload/interface';

const { Title, Text } = Typography;

interface BatchTransferManagerProps {
  fileList: UploadFile[];
  batchStatus: { [key: string]: 'pending' | 'sending' | 'completed' | 'failed' };
  batchProgress: { [key: string]: number };
  onClearFiles: () => void;
  onCancelTransfer: (fileKey: string) => void;
}

const BatchTransferManager: React.FC<BatchTransferManagerProps> = ({
  fileList,
  batchStatus,
  batchProgress,
  onClearFiles,
  onCancelTransfer,
}) => {
  // Stellar Brand Colors
  const stellarColors = {
    gold: '#FDDA24',
    black: '#0F0F0F',
    white: '#F6F7F8',
  };

  // Calculate overall progress
  const overallProgress =
    fileList.length > 0
      ? Object.values(batchProgress).reduce((sum, progress) => sum + progress, 0) / fileList.length
      : 0;

  // Calculate statistics
  const completedCount = Object.values(batchStatus).filter(
    (status) => status === 'completed',
  ).length;
  const failedCount = Object.values(batchStatus).filter((status) => status === 'failed').length;
  const pendingCount = Object.values(batchStatus).filter((status) => status === 'pending').length;
  const sendingCount = Object.values(batchStatus).filter((status) => status === 'sending').length;

  // Get status icon and color
  const getStatusInfo = (status: string) => {
    switch (status) {
      case 'completed':
        return { icon: <CheckCircleOutlined />, color: '#52c41a', text: 'Completed' };
      case 'failed':
        return { icon: <CloseCircleOutlined />, color: '#ff4d4f', text: 'Failed' };
      case 'sending':
        return { icon: <LoadingOutlined />, color: '#1890ff', text: 'Sending' };
      case 'pending':
        return { icon: <ClockCircleOutlined />, color: '#faad14', text: 'Pending' };
      default:
        return { icon: <ClockCircleOutlined />, color: '#d9d9d9', text: 'Unknown' };
    }
  };

  // Format file size
  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  if (fileList.length === 0) {
    return null;
  }

  return (
    <Card
      title={
        <Title
          level={5}
          style={{
            fontFamily: "'Inter', sans-serif",
            margin: 0,
            color: stellarColors.black,
          }}
        >
          <FileOutlined style={{ marginRight: 8 }} />
          Batch Transfer Manager
        </Title>
      }
      style={{ background: stellarColors.white, marginBottom: 16 }}
      extra={
        <Button icon={<ClearOutlined />} onClick={onClearFiles} size="small" danger>
          Clear All
        </Button>
      }
    >
      <Space direction="vertical" size="large" style={{ width: '100%' }}>
        {/* Overall Progress */}
        <div>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8 }}>
            <Text strong>Overall Progress</Text>
            <Text>{Math.round(overallProgress)}%</Text>
          </div>
          <Progress
            percent={overallProgress}
            status={failedCount > 0 ? 'exception' : 'active'}
            strokeColor={stellarColors.gold}
          />
        </div>

        {/* Statistics */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Space>
            <Badge count={completedCount} showZero>
              <Tag color="success">Completed</Tag>
            </Badge>
            <Badge count={sendingCount} showZero>
              <Tag color="processing">Sending</Tag>
            </Badge>
            <Badge count={pendingCount} showZero>
              <Tag color="warning">Pending</Tag>
            </Badge>
            <Badge count={failedCount} showZero>
              <Tag color="error">Failed</Tag>
            </Badge>
          </Space>
          <Text type="secondary">{fileList.length} files total</Text>
        </div>

        <Divider />

        {/* File List */}
        <List
          dataSource={fileList}
          renderItem={(file) => {
            const fileKey = `${file.name}-${file.size}`;
            const status = batchStatus[fileKey] || 'pending';
            const progress = batchProgress[fileKey] || 0;
            const statusInfo = getStatusInfo(status);

            return (
              <List.Item
                key={file.uid}
                style={{
                  padding: '12px',
                  border: '1px solid #f0f0f0',
                  borderRadius: '6px',
                  marginBottom: '8px',
                  background: status === 'completed' ? '#f6ffed' : '#fff',
                }}
                actions={[
                  status === 'pending' && (
                    <Button
                      type="text"
                      size="small"
                      danger
                      onClick={() => onCancelTransfer(fileKey)}
                    >
                      Cancel
                    </Button>
                  ),
                ].filter(Boolean)}
              >
                <List.Item.Meta
                  avatar={
                    <div style={{ fontSize: '20px', color: stellarColors.black }}>
                      <FileOutlined />
                    </div>
                  }
                  title={
                    <Space>
                      <Text strong style={{ fontSize: '14px' }}>
                        {file.name}
                      </Text>
                      <Tag icon={statusInfo.icon} color={statusInfo.color}>
                        {statusInfo.text}
                      </Tag>
                    </Space>
                  }
                  description={
                    <Space direction="vertical" size="small" style={{ width: '100%' }}>
                      <Text type="secondary" style={{ fontSize: '12px' }}>
                        Size: {formatFileSize(file.size || 0)}
                      </Text>
                      <Progress
                        percent={progress}
                        size="small"
                        status={
                          status === 'failed'
                            ? 'exception'
                            : status === 'completed'
                            ? 'success'
                            : 'active'
                        }
                        strokeColor={stellarColors.gold}
                        style={{ width: '200px' }}
                      />
                    </Space>
                  }
                />
              </List.Item>
            );
          }}
        />

        {/* Summary Alert */}
        {completedCount > 0 || failedCount > 0 ? (
          <Alert
            message={
              <span>
                {completedCount > 0 && `${completedCount} files completed successfully`}
                {completedCount > 0 && failedCount > 0 && ' • '}
                {failedCount > 0 && `${failedCount} files failed`}
              </span>
            }
            type={failedCount === 0 ? 'success' : failedCount === 0 ? 'success' : 'warning'}
            showIcon
            closable
          />
        ) : null}
      </Space>
    </Card>
  );
};

export default BatchTransferManager;
