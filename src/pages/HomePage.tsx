import React, { useEffect, useState } from 'react';
import {
  Button,
  Card,
  Col,
  Input,
  Menu,
  MenuProps,
  message,
  Modal,
  Row,
  Space,
  Typography,
  Upload,
  UploadFile,
} from 'antd';
import { FileOutlined, SendOutlined, CheckCircleOutlined, LinkOutlined } from '@ant-design/icons';
import { useAppDispatch, useAppSelector } from '../store/hooks';
import { startPeer, stopPeerSession } from '../store/peer/peerActions';
import * as connectionAction from '../store/connection/connectionActions';
import { DataType, PeerConnection } from '../helpers/peer';
import { useAsyncState } from '../helpers/hooks';
import * as Client from 'file-transfer';

import {
  StellarWalletsKit,
  WalletNetwork,
  allowAllModules,
  XBULL_ID,
} from '@creit.tech/stellar-wallets-kit';

const { Title, Text } = Typography;
type MenuItem = Required<MenuProps>['items'][number];

function getItem(
  label: React.ReactNode,
  key: React.Key,
  icon?: React.ReactNode,
  children?: MenuItem[],
  type?: 'group',
): MenuItem {
  return {
    key,
    icon,
    children,
    label,
    type,
  } as MenuItem;
}

export const HomePage: React.FC = () => {
  const peer = useAppSelector((state) => state.peer);
  const connection = useAppSelector((state) => state.connection);
  const dispatch = useAppDispatch();

  // Stellar Wallet states
  const [kit, setKit] = useState<StellarWalletsKit | null>(null);
  const [address, setAddress] = useState<string | null>(null);
  const [connecting, setConnecting] = useState(false);

  // Settings popup
  const [settingsOpen, setSettingsOpen] = useState(false);
  const [authorizeAddress, setAuthorizeAddress] = useState('');
  const [revokeAddress, setRevokeAddress] = useState('');

  // Loading states for contract operations
  const [grantLoading, setGrantLoading] = useState(false);
  const [revokeLoading, setRevokeLoading] = useState(false);

  // Permission check states
  const [recipientAddress, setRecipientAddress] = useState('');
  const [hasPermission, setHasPermission] = useState(false);
  const [checkingPermission, setCheckingPermission] = useState(false);

  // Stellar Brand Colors
  const stellarColors = {
    gold: '#FDDA24',
    black: '#0F0F0F',
    white: '#F6F7F8',
  };

  useEffect(() => {
    const newKit = new StellarWalletsKit({
      network: WalletNetwork.TESTNET,
      selectedWalletId: XBULL_ID,
      modules: allowAllModules(),
    });
    setKit(newKit);
  }, []);

  async function connectWallet() {
    if (!kit) return;

    setConnecting(true);
    try {
      await kit.openModal({
        onWalletSelected: async (wallet) => {
          await kit.setWallet(wallet.id);
          const { address } = await kit.getAddress();
          setAddress(address);
          setConnecting(false);
          dispatch(startPeer());
        },
        onClosed: () => setConnecting(false),
      });
    } catch (e) {
      console.error('Wallet connection failed', e);
      message.error('Wallet connection failed');
      setConnecting(false);
    }
  }

  async function disconnectWallet() {
    setAddress(null);
    setHasPermission(false);
    setRecipientAddress('');
    dispatch(stopPeerSession());
  }

  async function checkPermission(recipientAddr: string) {
    if (!address || !recipientAddr.trim()) {
      setHasPermission(false);
      return;
    }

    setCheckingPermission(true);
    try {
      const contract = new Client.Client({
        ...Client.networks.testnet,
        rpcUrl: 'https://soroban-testnet.stellar.org:443',
      });

      const { result } = await contract.has_permission({
        grantor: recipientAddr,
        grantee: address,
      });

      setHasPermission(result);
      if (result) {
        message.success('Permission verified! You can now connect.');
      } else {
        message.warning('No permission found for this address.');
      }
    } catch (error) {
      console.error('Permission check failed:', error);
      message.error('Failed to check permission');
      setHasPermission(false);
    } finally {
      setCheckingPermission(false);
    }
  }

  async function grantPermission(granteeAddress: string) {
    if (!kit || !address) {
      message.error('Wallet not connected');
      return;
    }

    setGrantLoading(true);
    try {
      const contract = new Client.Client({
        ...Client.networks.testnet,
        rpcUrl: 'https://soroban-testnet.stellar.org:443',
        allowHttp: true,
        publicKey: address,
        ...(await kit.getAddress()),
      });

      const tx = await contract.grant_permission({
        grantor: address,
        grantee: granteeAddress,
      });

      await tx.signAndSend({
        signTransaction: kit.signTransaction.bind(kit),
      });

      message.success(`Permission granted: ${granteeAddress}`);
      setAuthorizeAddress('');
    } catch (error) {
      console.error('Grant permission error:', error);
      message.error('Grant permission operation failed');
    } finally {
      setGrantLoading(false);
    }
  }

  async function revokePermission(granteeAddress: string) {
    if (!kit || !address) {
      message.error('Wallet not connected');
      return;
    }
    setRevokeLoading(true);
    try {
      const contract = new Client.Client({
        ...Client.networks.testnet,
        rpcUrl: 'https://soroban-testnet.stellar.org:443',
        allowHttp: true,
        publicKey: address,
        ...(await kit.getAddress()),
      });

      const tx = await contract.delete_permission({
        grantor: address,
        grantee: granteeAddress,
      });

      await tx.signAndSend({
        signTransaction: kit.signTransaction.bind(kit),
      });

      message.success(`Permission revoked: ${granteeAddress}`);
      setRevokeAddress('');
    } catch (error) {
      console.error('Revoke permission error:', error);
      message.error('Revoke permission operation failed');
    } finally {
      setRevokeLoading(false);
    }
  }

  const [fileList, setFileList] = useAsyncState([] as UploadFile[]);
  const [sendLoading, setSendLoading] = useAsyncState(false);

  const handleConnectOtherPeer = () => {
    connection.id != null
      ? dispatch(connectionAction.connectPeer(connection.id || ''))
      : message.warning('Please enter ID');
  };

  const handleUpload = async () => {
    if (fileList.length === 0) {
      message.warning('Please select file');
      return;
    }
    if (!connection.selectedId) {
      message.warning('Please select a connection');
      return;
    }
    try {
      await setSendLoading(true);
      let file = fileList[0] as unknown as File;
      let blob = new Blob([file], { type: file.type });

      await PeerConnection.sendConnection(connection.selectedId, {
        dataType: DataType.FILE,
        file: blob,
        fileName: file.name,
        fileType: file.type,
      });
      await setSendLoading(false);
      message.success('File sent successfully!');
    } catch (err) {
      await setSendLoading(false);
      console.log(err);
      message.error('Error when sending file');
    }
  };

  return (
    <div
      style={{
        minHeight: '100vh',
        background: stellarColors.white,
        color: stellarColors.black,
        padding: '40px 20px',
        fontFamily: "'Inter', sans-serif",
      }}
    >
      <Row justify="center" align="top">
        <Col xs={24} sm={24} md={22} lg={20} xl={18}>
          {/* Header */}
          <div style={{ textAlign: 'center', marginBottom: 60 }}>
            <Title
              level={1}
              style={{
                fontFamily: "'Anton', sans-serif",
                color: stellarColors.black,
                fontSize: '3rem',
                fontWeight: 700,
                textTransform: 'uppercase',
                letterSpacing: '1px',
                marginBottom: 15,
              }}
            >
              STELLAR TRANSFER HUB
            </Title>
            <Text
              style={{
                fontFamily: "'Lora', serif",
                fontSize: '1.2rem',
                color: '#555',
                maxWidth: '600px',
                margin: '0 auto',
              }}
            >
              Unlock real-world utility with secure, decentralized file sharing powered by the
              Stellar network.
            </Text>
          </div>

          {/* Wallet Connection Section */}
          {!address && (
            <div
              style={{
                background: stellarColors.gold,
                padding: '60px 40px',
                textAlign: 'center',
              }}
            >
              <Title
                level={2}
                style={{
                  fontFamily: "'Anton', sans-serif",
                  color: 'black',
                  fontWeight: 700,
                  textTransform: 'uppercase',
                }}
              >
                DIGITAL WALLETS
              </Title>
              <Text
                style={{
                  fontFamily: "'Lora', serif",
                  color: 'rgba(0,0,0,0.7)',
                  fontSize: 16,
                  display: 'block',
                  marginBottom: 40,
                  maxWidth: '400px',
                  margin: '0 auto 40px auto',
                }}
              >
                Embark on your Stellar journey. Connect your wallet to begin.
              </Text>
              <Button
                onClick={connectWallet}
                disabled={connecting}
                type="primary"
                size="large"
                style={{
                  height: 60,
                  padding: '0 50px',
                  fontSize: 18,
                  background: stellarColors.black,
                  border: 'none',
                  color: stellarColors.gold,
                  fontWeight: 600,
                  textTransform: 'uppercase',
                }}
              >
                {connecting ? 'Connecting...' : 'Connect Wallet'}
              </Button>
            </div>
          )}

          {/* Main Application */}
          {address && (
            <>
              {/* Wallet Info Bar */}
              <Card
                style={{
                  borderRadius: 0,
                  marginBottom: 30,
                  background: 'white',
                  border: `1px solid #eee`,
                }}
              >
                <Row align="middle" justify="space-between">
                  <Col>
                    <Space>
                      <CheckCircleOutlined style={{ color: '#52c41a', fontSize: 20 }} />
                      <Text strong>Wallet Connected:</Text>
                      <Text style={{ fontFamily: 'monospace' }}>{address}</Text>
                    </Space>
                  </Col>
                  <Col>
                    <Space>
                      <Button onClick={() => setSettingsOpen(true)}>Settings</Button>
                      <Button danger onClick={disconnectWallet}>
                        Disconnect
                      </Button>
                    </Space>
                  </Col>
                </Row>
              </Card>

              <Row gutter={[24, 24]}>
                <Col xs={24} lg={12}>
                  <Space direction="vertical" size="large" style={{ width: '100%' }}>
                    {/* Connection Setup */}
                    {peer.started && (
                      <Card
                        title={
                          <Title
                            level={4}
                            style={{
                              fontFamily: "'Anton', sans-serif",
                              textTransform: 'uppercase',
                              margin: 0,
                            }}
                          >
                            Connection Setup
                          </Title>
                        }
                        bordered={false}
                        style={{ background: 'white', height: '100%' }}
                      >
                        <Space direction="vertical" size="large" style={{ width: '100%' }}>
                          <div>
                            <Text
                              strong
                              style={{
                                fontFamily: "'Inter', sans-serif",
                                textTransform: 'uppercase',
                              }}
                            >
                              Recipient's Wallet Address
                            </Text>
                            <Space.Compact style={{ width: '100%', marginTop: 8 }}>
                              <Input
                                placeholder="Enter wallet address..."
                                value={recipientAddress}
                                onChange={(e) => {
                                  setRecipientAddress(e.target.value);
                                  setHasPermission(false);
                                }}
                                size="large"
                                style={{ borderRadius: 0 }}
                              />
                              <Button
                                type="primary"
                                loading={checkingPermission}
                                onClick={() => checkPermission(recipientAddress)}
                                disabled={!recipientAddress.trim()}
                                style={{
                                  background: stellarColors.black,
                                  color: stellarColors.gold,
                                  borderRadius: 0,
                                }}
                                size="large"
                              >
                                Check
                              </Button>
                            </Space.Compact>
                          </div>
                          {hasPermission && (
                            <div>
                              <Text
                                strong
                                style={{
                                  fontFamily: "'Inter', sans-serif",
                                  textTransform: 'uppercase',
                                }}
                              >
                                Peer ID
                              </Text>
                              <Space.Compact style={{ width: '100%', marginTop: 8 }}>
                                <Input
                                  placeholder="Enter peer ID..."
                                  value={connection.id}
                                  onChange={(e) =>
                                    dispatch(connectionAction.changeConnectionInput(e.target.value))
                                  }
                                  size="large"
                                  style={{ borderRadius: 0 }}
                                />
                                <Button
                                  type="primary"
                                  loading={connection.loading}
                                  onClick={handleConnectOtherPeer}
                                  style={{
                                    background: stellarColors.black,
                                    color: stellarColors.gold,
                                    borderRadius: 0,
                                  }}
                                  size="large"
                                >
                                  Connect
                                </Button>
                              </Space.Compact>
                            </div>
                          )}
                        </Space>
                      </Card>
                    )}

                    {/* Active Connections */}
                    {peer.started && (
                      <Card
                        title={
                          <Title
                            level={4}
                            style={{
                              fontFamily: "'Anton', sans-serif",
                              textTransform: 'uppercase',
                              margin: 0,
                            }}
                          >
                            Active Connections
                          </Title>
                        }
                        bordered={false}
                        style={{ background: 'white', height: '100%' }}
                      >
                        {connection.list.length > 0 ? (
                          <Menu
                            selectedKeys={connection.selectedId ? [connection.selectedId] : []}
                            onSelect={(info: { key: string }) =>
                              dispatch(connectionAction.selectItem(info.key))
                            }
                            items={connection.list.map((e) => getItem(e, e, <LinkOutlined />))}
                            mode="vertical"
                          />
                        ) : (
                          <Text type="secondary">Waiting for connections...</Text>
                        )}
                      </Card>
                    )}
                  </Space>
                </Col>

                <Col xs={24} lg={12}>
                  {/* File Transfer */}
                  {peer.started && (
                    <Card
                      bordered={false}
                      style={{
                        background: stellarColors.black,
                        color: 'white',
                        height: '100%',
                        display: 'flex',
                        flexDirection: 'column',
                      }}
                    >
                      <Title
                        level={4}
                        style={{
                          fontFamily: "'Anton', sans-serif",
                          color: 'white',
                          textTransform: 'uppercase',
                          margin: 0,
                        }}
                      >
                        Send File
                      </Title>
                      <div
                        style={{
                          flex: 1,
                          display: 'flex',
                          flexDirection: 'column',
                          justifyContent: 'space-between',
                          marginTop: 24,
                        }}
                      >
                        <Upload.Dragger
                          fileList={fileList}
                          maxCount={1}
                          onRemove={() => setFileList([])}
                          beforeUpload={(file) => {
                            setFileList([file]);
                            return false;
                          }}
                          style={{
                            background: '#1a1a1a',
                            border: `2px dashed ${stellarColors.gold}`,
                            flex: 1,
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                          }}
                        >
                          <div>
                            <p className="ant-upload-drag-icon">
                              <FileOutlined style={{ color: stellarColors.gold, fontSize: 48 }} />
                            </p>
                            <p
                              className="ant-upload-text"
                              style={{
                                color: 'white',
                                fontFamily: "'Anton', sans-serif",
                                fontSize: '1.2rem',
                              }}
                            >
                              CLICK OR DRAG FILE
                            </p>
                            <p className="ant-upload-hint" style={{ color: '#999' }}>
                              Select the file you want to transfer.
                            </p>
                          </div>
                        </Upload.Dragger>
                        <Button
                          type="primary"
                          onClick={handleUpload}
                          disabled={fileList.length === 0 || !connection.selectedId}
                          loading={sendLoading}
                          icon={<SendOutlined />}
                          size="large"
                          style={{
                            width: '100%',
                            height: 60,
                            background: stellarColors.gold,
                            border: 'none',
                            color: stellarColors.black,
                            fontWeight: 600,
                            marginTop: 24,
                            textTransform: 'uppercase',
                          }}
                        >
                          {sendLoading ? 'Sending...' : 'Send File'}
                        </Button>
                      </div>
                    </Card>
                  )}
                </Col>
              </Row>

              {/* Settings Modal */}
              <Modal
                open={settingsOpen}
                onCancel={() => setSettingsOpen(false)}
                footer={null}
                title={
                  <Title
                    level={3}
                    style={{
                      fontFamily: "'Anton', sans-serif",
                      textTransform: 'uppercase',
                      margin: 0,
                    }}
                  >
                    Permission Settings
                  </Title>
                }
              >
                <Space direction="vertical" size="large" style={{ width: '100%' }}>
                  <Card
                    title={
                      <Title
                        level={5}
                        style={{
                          fontFamily: "'Anton', sans-serif",
                          textTransform: 'uppercase',
                          margin: 0,
                        }}
                      >
                        Grant Permission
                      </Title>
                    }
                  >
                    <Space.Compact style={{ width: '100%' }}>
                      <Input
                        placeholder="Enter address..."
                        value={authorizeAddress}
                        onChange={(e) => setAuthorizeAddress(e.target.value)}
                      />
                      <Button
                        type="primary"
                        loading={grantLoading}
                        onClick={() => grantPermission(authorizeAddress)}
                        disabled={!authorizeAddress.trim()}
                        style={{ background: stellarColors.black, color: stellarColors.gold }}
                      >
                        Grant
                      </Button>
                    </Space.Compact>
                  </Card>
                  <Card
                    title={
                      <Title
                        level={5}
                        style={{
                          fontFamily: "'Anton', sans-serif",
                          textTransform: 'uppercase',
                          margin: 0,
                        }}
                      >
                        Revoke Permission
                      </Title>
                    }
                  >
                    <Space.Compact style={{ width: '100%' }}>
                      <Input
                        placeholder="Enter address..."
                        value={revokeAddress}
                        onChange={(e) => setRevokeAddress(e.target.value)}
                      />
                      <Button
                        danger
                        loading={revokeLoading}
                        onClick={() => revokePermission(revokeAddress)}
                        disabled={!revokeAddress.trim()}
                      >
                        Revoke
                      </Button>
                    </Space.Compact>
                  </Card>
                </Space>
              </Modal>
            </>
          )}
        </Col>
      </Row>
    </div>
  );
};

export default HomePage;
