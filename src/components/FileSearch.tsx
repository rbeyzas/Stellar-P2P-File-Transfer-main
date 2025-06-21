import React, { useState, useMemo } from 'react';
import {
  Card,
  Input,
  List,
  Typography,
  Space,
  Button,
  Tag,
  Progress,
  Dropdown,
  Menu,
  Modal,
  message,
  Empty,
  Tooltip,
  Badge,
  Divider,
} from 'antd';
import {
  SearchOutlined,
  FilterOutlined,
  DeleteOutlined,
  DownloadOutlined,
  EyeOutlined,
  MoreOutlined,
  ClearOutlined,
  FileOutlined,
  FileTextOutlined,
  FileImageOutlined,
  VideoCameraOutlined,
  AudioOutlined,
  FileZipOutlined,
  FilePdfOutlined,
  CheckCircleOutlined,
  CloseCircleOutlined,
  ClockCircleOutlined,
  ExclamationCircleOutlined,
} from '@ant-design/icons';
import { useAppDispatch, useAppSelector } from '../store/hooks';
import {
  searchTransfers,
  filterTransfers,
  deleteTransfer,
  clearTransferHistory,
} from '../store/transfer/transferActions';
import { TransferRecord } from '../store/transfer/transferTypes';

const { Title, Text } = Typography;
const { Search } = Input;

const FileSearch: React.FC = () => {
  const dispatch = useAppDispatch();
  const { transfers, searchQuery, filterType } = useAppSelector((state) => state.transfer);
  const [selectedTransfer, setSelectedTransfer] = useState<TransferRecord | null>(null);
  const [isDetailModalVisible, setIsDetailModalVisible] = useState(false);

  // Stellar Brand Colors
  const stellarColors = {
    gold: '#FDDA24',
    black: '#0F0F0F',
    white: '#F6F7F8',
  };

  // Filter and search transfers
  const filteredTransfers = useMemo(() => {
    let filtered = transfers;

    // Apply direction filter
    if (filterType !== 'all') {
      filtered = filtered.filter((transfer) => transfer.direction === filterType);
    }

    // Apply search query
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(
        (transfer) =>
          transfer.fileName.toLowerCase().includes(query) ||
          transfer.peerId.toLowerCase().includes(query) ||
          transfer.fileType.toLowerCase().includes(query),
      );
    }

    return filtered;
  }, [transfers, searchQuery, filterType]);

  // Get file icon based on file type
  const getFileIcon = (fileType: string) => {
    if (fileType.startsWith('image/')) return <FileImageOutlined />;
    if (fileType.startsWith('video/')) return <VideoCameraOutlined />;
    if (fileType.startsWith('audio/')) return <AudioOutlined />;
    if (fileType.includes('pdf')) return <FilePdfOutlined />;
    if (fileType.includes('zip') || fileType.includes('rar')) return <FileZipOutlined />;
    if (fileType.includes('text') || fileType.includes('json')) return <FileTextOutlined />;
    return <FileOutlined />;
  };

  // Get status icon and color
  const getStatusInfo = (status: string) => {
    switch (status) {
      case 'completed':
        return { icon: <CheckCircleOutlined />, color: '#52c41a', text: 'Completed' };
      case 'failed':
        return { icon: <CloseCircleOutlined />, color: '#ff4d4f', text: 'Failed' };
      case 'cancelled':
        return { icon: <CloseCircleOutlined />, color: '#faad14', text: 'Cancelled' };
      case 'pending':
        return { icon: <ClockCircleOutlined />, color: '#1890ff', text: 'Pending' };
      default:
        return { icon: <ExclamationCircleOutlined />, color: '#d9d9d9', text: 'Unknown' };
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

  // Format timestamp
  const formatTimestamp = (timestamp: number) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diffInHours = (now.getTime() - date.getTime()) / (1000 * 60 * 60);

    if (diffInHours < 1) {
      return 'Just now';
    } else if (diffInHours < 24) {
      return `${Math.floor(diffInHours)}h ago`;
    } else if (diffInHours < 168) {
      return `${Math.floor(diffInHours / 24)}d ago`;
    } else {
      return date.toLocaleDateString();
    }
  };

  // Handle search
  const handleSearch = (value: string) => {
    dispatch(searchTransfers(value));
  };

  // Handle filter change
  const handleFilterChange = (type: 'all' | 'sent' | 'received') => {
    dispatch(filterTransfers(type));
  };

  // Handle transfer deletion
  const handleDeleteTransfer = (id: string) => {
    Modal.confirm({
      title: 'Delete Transfer Record',
      content: 'Are you sure you want to delete this transfer record?',
      okText: 'Delete',
      okType: 'danger',
      cancelText: 'Cancel',
      onOk: () => {
        dispatch(deleteTransfer(id));
        message.success('Transfer record deleted');
      },
    });
  };

  // Handle clear history
  const handleClearHistory = () => {
    Modal.confirm({
      title: 'Clear Transfer History',
      content: 'Are you sure you want to clear all transfer history? This action cannot be undone.',
      okText: 'Clear All',
      okType: 'danger',
      cancelText: 'Cancel',
      onOk: () => {
        dispatch(clearTransferHistory());
        message.success('Transfer history cleared');
      },
    });
  };

  // Handle transfer detail view
  const handleViewDetails = (transfer: TransferRecord) => {
    setSelectedTransfer(transfer);
    setIsDetailModalVisible(true);
  };

  // Handle download (for received files)
  const handleDownload = (transfer: TransferRecord) => {
    if (transfer.direction === 'received' && transfer.path) {
      // In a real implementation, you would trigger a download
      message.info('Download functionality would be implemented here');
    } else {
      message.warning('This file was sent, not received');
    }
  };

  // Filter menu items
  const filterMenuItems = [
    {
      key: 'all',
      label: 'All Transfers',
      icon: <FilterOutlined />,
    },
    {
      key: 'sent',
      label: 'Sent Files',
      icon: <DownloadOutlined />,
    },
    {
      key: 'received',
      label: 'Received Files',
      icon: <EyeOutlined />,
    },
  ];

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
          <SearchOutlined style={{ marginRight: 8 }} />
          File Search & History
        </Title>
      }
      style={{ background: stellarColors.white, marginBottom: 24 }}
    >
      <Space direction="vertical" size="large" style={{ width: '100%' }}>
        {/* Search and Filter Controls */}
        <Space.Compact style={{ width: '100%' }}>
          <Search
            placeholder="Search files by name, peer ID, or file type..."
            allowClear
            enterButton={<SearchOutlined />}
            size="large"
            value={searchQuery}
            onChange={(e) => handleSearch(e.target.value)}
            style={{ flex: 1 }}
          />
          <Dropdown
            menu={{
              items: filterMenuItems,
              selectedKeys: [filterType],
              onClick: ({ key }) => handleFilterChange(key as 'all' | 'sent' | 'received'),
            }}
            trigger={['click']}
          >
            <Button
              icon={<FilterOutlined />}
              size="large"
              style={{
                background: stellarColors.black,
                color: stellarColors.gold,
                border: 'none',
              }}
            >
              {filterType === 'all' ? 'All' : filterType === 'sent' ? 'Sent' : 'Received'}
            </Button>
          </Dropdown>
          <Button
            icon={<ClearOutlined />}
            size="large"
            onClick={handleClearHistory}
            style={{
              background: '#ff4d4f',
              color: 'white',
              border: 'none',
            }}
            disabled={transfers.length === 0}
          >
            Clear
          </Button>
        </Space.Compact>

        {/* Statistics */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Text type="secondary">
            Showing {filteredTransfers.length} of {transfers.length} transfers
          </Text>
          <Space>
            <Badge count={transfers.filter((t) => t.direction === 'sent').length} showZero>
              <Tag color="blue">Sent</Tag>
            </Badge>
            <Badge count={transfers.filter((t) => t.direction === 'received').length} showZero>
              <Tag color="green">Received</Tag>
            </Badge>
          </Space>
        </div>

        <Divider />

        {/* Transfer List */}
        {filteredTransfers.length > 0 ? (
          <List
            dataSource={filteredTransfers}
            renderItem={(transfer) => {
              const statusInfo = getStatusInfo(transfer.status);
              return (
                <List.Item
                  key={transfer.id}
                  style={{
                    padding: '16px',
                    border: '1px solid #f0f0f0',
                    borderRadius: '8px',
                    marginBottom: '8px',
                    background: transfer.status === 'completed' ? '#f6ffed' : '#fff',
                  }}
                  actions={[
                    <Tooltip title="View Details">
                      <Button
                        type="text"
                        icon={<EyeOutlined />}
                        onClick={() => handleViewDetails(transfer)}
                      />
                    </Tooltip>,
                    transfer.direction === 'received' && transfer.status === 'completed' ? (
                      <Tooltip title="Download">
                        <Button
                          type="text"
                          icon={<DownloadOutlined />}
                          onClick={() => handleDownload(transfer)}
                        />
                      </Tooltip>
                    ) : null,
                    <Dropdown
                      menu={{
                        items: [
                          {
                            key: 'delete',
                            label: 'Delete Record',
                            icon: <DeleteOutlined />,
                            danger: true,
                            onClick: () => handleDeleteTransfer(transfer.id),
                          },
                        ],
                      }}
                      trigger={['click']}
                    >
                      <Button type="text" icon={<MoreOutlined />} />
                    </Dropdown>,
                  ].filter(Boolean)}
                >
                  <List.Item.Meta
                    avatar={
                      <div style={{ fontSize: '24px', color: stellarColors.black }}>
                        {getFileIcon(transfer.fileType)}
                      </div>
                    }
                    title={
                      <Space>
                        <Text strong style={{ fontSize: '16px' }}>
                          {transfer.fileName}
                        </Text>
                        <Tag color={transfer.direction === 'sent' ? 'blue' : 'green'}>
                          {transfer.direction.toUpperCase()}
                        </Tag>
                        <Tag icon={statusInfo.icon} color={statusInfo.color}>
                          {statusInfo.text}
                        </Tag>
                      </Space>
                    }
                    description={
                      <Space direction="vertical" size="small" style={{ width: '100%' }}>
                        <Space>
                          <Text type="secondary">Size: {formatFileSize(transfer.fileSize)}</Text>
                          <Text type="secondary">Type: {transfer.fileType}</Text>
                          <Text type="secondary">Peer: {transfer.peerId.slice(0, 8)}...</Text>
                        </Space>
                        <Space>
                          <Text type="secondary">{formatTimestamp(transfer.timestamp)}</Text>
                          {transfer.progress !== undefined && transfer.status === 'pending' && (
                            <Progress
                              percent={transfer.progress}
                              size="small"
                              style={{ width: '100px' }}
                            />
                          )}
                        </Space>
                        {transfer.error && (
                          <Text type="danger" style={{ fontSize: '12px' }}>
                            Error: {transfer.error}
                          </Text>
                        )}
                      </Space>
                    }
                  />
                </List.Item>
              );
            }}
          />
        ) : (
          <Empty
            description={
              <span>
                {searchQuery || filterType !== 'all'
                  ? 'No transfers found matching your search criteria'
                  : 'No transfer history yet'}
              </span>
            }
            style={{ padding: '40px 0' }}
          />
        )}
      </Space>

      {/* Transfer Detail Modal */}
      <Modal
        title="Transfer Details"
        open={isDetailModalVisible}
        onCancel={() => setIsDetailModalVisible(false)}
        footer={[
          <Button key="close" onClick={() => setIsDetailModalVisible(false)}>
            Close
          </Button>,
          selectedTransfer?.direction === 'received' && selectedTransfer?.status === 'completed' ? (
            <Button
              key="download"
              type="primary"
              icon={<DownloadOutlined />}
              onClick={() => {
                handleDownload(selectedTransfer!);
                setIsDetailModalVisible(false);
              }}
            >
              Download
            </Button>
          ) : null,
        ].filter(Boolean)}
        width={600}
      >
        {selectedTransfer && (
          <Space direction="vertical" size="large" style={{ width: '100%' }}>
            <div>
              <Text strong>File Information</Text>
              <div style={{ marginTop: 8 }}>
                <Text>Name: {selectedTransfer.fileName}</Text>
                <br />
                <Text>Size: {formatFileSize(selectedTransfer.fileSize)}</Text>
                <br />
                <Text>Type: {selectedTransfer.fileType}</Text>
                <br />
                <Text>Direction: {selectedTransfer.direction}</Text>
                <br />
                <Text>Peer ID: {selectedTransfer.peerId}</Text>
                <br />
                <Text>Status: {getStatusInfo(selectedTransfer.status).text}</Text>
                <br />
                <Text>Date: {new Date(selectedTransfer.timestamp).toLocaleString()}</Text>
                {selectedTransfer.checksum && (
                  <>
                    <br />
                    <Text>Checksum: {selectedTransfer.checksum}</Text>
                  </>
                )}
                {selectedTransfer.path && (
                  <>
                    <br />
                    <Text>Path: {selectedTransfer.path}</Text>
                  </>
                )}
                {selectedTransfer.error && (
                  <>
                    <br />
                    <Text type="danger">Error: {selectedTransfer.error}</Text>
                  </>
                )}
              </div>
            </div>
          </Space>
        )}
      </Modal>
    </Card>
  );
};

export default FileSearch;
