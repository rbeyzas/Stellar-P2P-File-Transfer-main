import React, { useState, useEffect, useRef } from 'react';
import { Card, Input, Button, Space, Typography, List, message, Tooltip } from 'antd';
import { SendOutlined, ShareAltOutlined, ApiOutlined } from '@ant-design/icons';
import { useAppDispatch, useAppSelector } from '../store/hooks';
import {
  sendMessage,
  connectPeer,
  changeConnectionInput,
} from '../store/connection/connectionActions';
import { PeerConnection, DataType } from '../helpers/peer';

const { Title, Text } = Typography;

const ChatInterface: React.FC = () => {
  const dispatch = useAppDispatch();
  const {
    selectedId,
    messages,
    id: connectionInput,
    loading: connectionLoading,
  } = useAppSelector((state) => state.connection);
  const myPeerId = useAppSelector((state) => state.peer.id);

  const [newMessage, setNewMessage] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, selectedId]);

  const handleSendMessage = async () => {
    if (newMessage.trim() === '' || !selectedId) return;

    const messagePayload = {
      text: newMessage,
      sender: 'me' as const,
      timestamp: Date.now(),
    };

    try {
      dispatch(sendMessage(selectedId, messagePayload));
      await PeerConnection.sendConnection(selectedId, {
        dataType: DataType.MESSAGE,
        message: newMessage,
      });
      setNewMessage('');
    } catch (error) {
      console.error('Failed to send message:', error);
      message.error('Failed to send message');
    }
  };

  const handleConnect = () => {
    if (connectionInput) {
      dispatch(connectPeer(connectionInput));
    } else {
      message.warning('Please enter a Peer ID');
    }
  };

  const handleShareId = () => {
    if (myPeerId) {
      navigator.clipboard.writeText(myPeerId);
      message.success('Your Peer ID has been copied to clipboard!');
    }
  };

  // Stellar Brand Colors
  const stellarColors = {
    gold: '#FDDA24',
    black: '#0F0F0F',
    white: '#F6F7F8',
  };

  const currentMessages = selectedId && messages[selectedId] ? messages[selectedId] : [];

  const chatBody = selectedId ? (
    <>
      <List
        dataSource={currentMessages}
        renderItem={(item) => (
          <List.Item
            style={{
              border: 'none',
              padding: '5px 0',
              display: 'flex',
              justifyContent: item.sender === 'me' ? 'flex-end' : 'flex-start',
            }}
          >
            <div
              style={{
                background: item.sender === 'me' ? stellarColors.gold : '#e9e9e9',
                color: stellarColors.black,
                padding: '10px 15px',
                borderRadius: '15px',
                maxWidth: '70%',
              }}
            >
              {item.text}
            </div>
          </List.Item>
        )}
      />
      <div ref={messagesEndRef} />
    </>
  ) : (
    <div style={{ textAlign: 'center', margin: 'auto' }}>
      <ApiOutlined style={{ fontSize: '48px', color: '#ccc' }} />
      <Title level={5} style={{ color: '#aaa', marginTop: '16px' }}>
        Connect to a Peer
      </Title>
      <Text type="secondary">
        Share your Peer ID and enter your friend's ID below to start chatting.
      </Text>
    </div>
  );

  const chatFooter = selectedId ? (
    <Space.Compact style={{ width: '100%' }}>
      <Input.TextArea
        value={newMessage}
        onChange={(e) => setNewMessage(e.target.value)}
        placeholder="Type a message..."
        autoSize={{ minRows: 1, maxRows: 3 }}
        onPressEnter={(e) => {
          if (!e.shiftKey) {
            e.preventDefault();
            handleSendMessage();
          }
        }}
      />
      <Button
        type="primary"
        icon={<SendOutlined />}
        onClick={handleSendMessage}
        style={{ background: stellarColors.black, color: stellarColors.gold }}
        disabled={newMessage.trim() === ''}
      />
    </Space.Compact>
  ) : (
    <Space.Compact style={{ width: '100%' }}>
      <Input
        placeholder="Enter Peer ID to connect..."
        value={connectionInput}
        onChange={(e) => dispatch(changeConnectionInput(e.target.value))}
        size="large"
        onPressEnter={handleConnect}
      />
      <Button
        type="primary"
        loading={connectionLoading}
        onClick={handleConnect}
        style={{ background: stellarColors.black, color: stellarColors.gold }}
        size="large"
      >
        Connect
      </Button>
    </Space.Compact>
  );

  return (
    <Card
      title={
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Title
            level={4}
            style={{ fontFamily: "'Anton', sans-serif", textTransform: 'uppercase', margin: 0 }}
          >
            {selectedId ? `Chat with ${selectedId.substring(0, 8)}...` : 'Chat'}
          </Title>
          <Tooltip title="Copy Your Peer ID">
            <Button
              icon={<ShareAltOutlined />}
              onClick={handleShareId}
              type="text"
              style={{ color: stellarColors.black }}
            />
          </Tooltip>
        </div>
      }
      bordered={false}
      style={{ background: 'white', height: '100%', display: 'flex', flexDirection: 'column' }}
    >
      <div style={{ flex: 1, overflowY: 'auto', marginBottom: '20px', padding: '10px' }}>
        {chatBody}
      </div>
      {chatFooter}
    </Card>
  );
};

export default ChatInterface;
