import React, { useEffect, useState } from "react";
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
} from "antd";
import { CopyOutlined, UploadOutlined } from "@ant-design/icons";
import { useAppDispatch, useAppSelector } from "./store/hooks";
import { startPeer, stopPeerSession } from "./store/peer/peerActions";
import * as connectionAction from "./store/connection/connectionActions";
import { DataType, PeerConnection } from "./helpers/peer";
import { useAsyncState } from "./helpers/hooks";
import * as Client from "file-transfer";

import {
  StellarWalletsKit,
  WalletNetwork,
  allowAllModules,
  XBULL_ID,
} from "@creit.tech/stellar-wallets-kit";

const { Title } = Typography;
type MenuItem = Required<MenuProps>["items"][number];

function getItem(
  label: React.ReactNode,
  key: React.Key,
  icon?: React.ReactNode,
  children?: MenuItem[],
  type?: "group"
): MenuItem {
  return {
    key,
    icon,
    children,
    label,
    type,
  } as MenuItem;
}

export const App: React.FC = () => {
  const peer = useAppSelector((state) => state.peer);
  const connection = useAppSelector((state) => state.connection);
  const dispatch = useAppDispatch();

  // Stellar Wallet states
  const [kit, setKit] = useState<StellarWalletsKit | null>(null);
  const [address, setAddress] = useState<string | null>(null);
  const [connecting, setConnecting] = useState(false);

  // Settings popup
  const [settingsOpen, setSettingsOpen] = useState(false);
  const [authorizeAddress, setAuthorizeAddress] = useState("");
  const [revokeAddress, setRevokeAddress] = useState("");

  // Loading states for contract operations
  const [grantLoading, setGrantLoading] = useState(false);
  const [revokeLoading, setRevokeLoading] = useState(false);

  // Permission check states
  const [recipientAddress, setRecipientAddress] = useState("");
  const [hasPermission, setHasPermission] = useState(false);
  const [checkingPermission, setCheckingPermission] = useState(false);

  // Initialize StellarWalletsKit once
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
      console.error("Wallet connection failed", e);
      message.error("Wallet connection failed");
      setConnecting(false);
    }
  }

  async function disconnectWallet() {
    setAddress(null);
    setHasPermission(false);
    setRecipientAddress("");
    dispatch(stopPeerSession());
  }

  // Check permission function
  async function checkPermission(recipientAddr: string) {
    if (!address || !recipientAddr.trim()) {
      setHasPermission(false);
      return;
    }

    setCheckingPermission(true);
    try {
      const contract = new Client.Client({
        ...Client.networks.testnet,
        rpcUrl: "https://soroban-testnet.stellar.org:443",
      });

      const { result } = await contract.has_permission({ 
        grantor: recipientAddr, // The recipient is the grantor who gave permission
        grantee: address // Current user is the grantee who received permission
      });
      
      setHasPermission(result);
      if (result) {
        message.success("Permission verified! You can now connect.");
      } else {
        message.warning("No permission found for this address.");
      }
    } catch (error) {
      console.error("Permission check failed:", error);
      message.error("Failed to check permission");
      setHasPermission(false);
    } finally {
      setCheckingPermission(false);
    }
  }

  // Contract interaction functions
  async function grantPermission(granteeAddress: string) {
    if (!kit || !address) {
      message.error("Wallet not connected");
      return;
    }

    setGrantLoading(true);
    try {
      const contract = new Client.Client({
        ...Client.networks.testnet,
        rpcUrl: "https://soroban-testnet.stellar.org:443",
        allowHttp: true,
        publicKey: address,
        ...await kit.getAddress(),
      });

      const tx = await contract.grant_permission({
        grantor: address,
        grantee: granteeAddress
      });

      await tx.signAndSend({
        signTransaction: kit.signTransaction.bind(kit),
      });

      message.success(`Permission granted: ${granteeAddress}`);
      setAuthorizeAddress("");
    } catch (error) {
      console.error("Grant permission error:", error);
      message.error("Grant permission operation failed");
    } finally {
      setGrantLoading(false);
    }
  }

  async function revokePermission(granteeAddress: string) {
    if (!kit || !address) {
      message.error("Wallet not connected");
      return;
    }
    setRevokeLoading(true);
    try {
      const contract = new Client.Client({
        ...Client.networks.testnet,
        rpcUrl: "https://soroban-testnet.stellar.org:443",
        allowHttp: true,
        publicKey: address,
        ...await kit.getAddress(),
      });

      const tx = await contract.delete_permission({
        grantor: address,
        grantee: granteeAddress
      });

      await tx.signAndSend({
        signTransaction: kit.signTransaction.bind(kit),
      });

      message.success(`Permission revoked: ${granteeAddress}`);
      setRevokeAddress("");
    } catch (error) {
      console.error("Revoke permission error:", error);
      message.error("Revoke permission operation failed");
    } finally {
      setRevokeLoading(false);
    }
  }

  const [fileList, setFileList] = useAsyncState([] as UploadFile[]);
  const [sendLoading, setSendLoading] = useAsyncState(false);

  const handleStopSession = async () => {
    await PeerConnection.closePeerSession();
    dispatch(stopPeerSession());
    setAddress(null);
  };

  const handleConnectOtherPeer = () => {
    connection.id != null
      ? dispatch(connectionAction.connectPeer(connection.id || ""))
      : message.warning("Please enter ID");
  };

  const handleUpload = async () => {
    if (fileList.length === 0) {
      message.warning("Please select file");
      return;
    }
    if (!connection.selectedId) {
      message.warning("Please select a connection");
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
      message.info("Send file successfully");
    } catch (err) {
      await setSendLoading(false);
      console.log(err);
      message.error("Error when sending file");
    }
  };

  const cardStyle = {
    borderRadius: 12,
    boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
    marginBottom: 24,
    padding: 24,
    backgroundColor: "#fff",
  };

  const primaryButtonStyle = {
    borderRadius: 8,
    boxShadow: "0 2px 8px rgba(22, 119, 255, 0.4)",
    transition: "background-color 0.3s ease",
  };

  const dangerButtonStyle = {
    borderRadius: 8,
  };

  const inputStyle = {
    borderRadius: 8,
  };

  return (
    <Row
      justify="center"
      align="top"
      style={{ minHeight: "100vh", backgroundColor: "#f7f9fc", padding: 24 }}
    >
      <Col xs={24} sm={24} md={20} lg={16} xl={12}>
        <Card style={{ ...cardStyle, paddingBottom: 32 }}>
          <Title
            level={2}
            style={{
              textAlign: "center",
              fontWeight: 700,
              color: "#1677ff",
              marginBottom: 32,
              fontSize: 32,
              userSelect: "none",
            }}
          >
            P2P File Transfer
          </Title>

          {/* Show connect wallet button if wallet is not connected */}
          {!address && (
            <Card style={cardStyle}>
              <Button
                onClick={connectWallet}
                disabled={connecting}
                type="primary"
                style={primaryButtonStyle}
                block
                size="large"
              >
                {connecting ? "Connecting..." : "Connect Wallet"}
              </Button>
            </Card>
          )}

          {/* Show operations screen if wallet is connected */}
          {address && (
            <>
              {/* Wallet info and buttons */}
              <Card style={cardStyle} size="small">
                <Space style={{ justifyContent: "space-between", width: "100%" }}>
                  <div
                    style={{
                      fontWeight: 600,
                      fontSize: 16,
                      color: "#1d3557",
                      userSelect: "all",
                    }}
                  >
                    Wallet Address:{" "}

                    <span style={{ fontFamily: "monospace" }}>
                      {address.slice(0, 6)}...{address.slice(-6)}
                    </span>
                    <Button
                      icon={<CopyOutlined />}
                      size="small"
                      style={{ marginLeft: 8 }}
                      onClick={async () => {
                        await navigator.clipboard.writeText(address);
                        message.success("Address copied");
                      }}
                    />
                  </div>

                  <Space>
                    <Button danger onClick={disconnectWallet} style={dangerButtonStyle}>
                      Disconnect
                    </Button>
                    <Button onClick={() => setSettingsOpen(true)}>Settings</Button>
                  </Space>
                </Space>
              </Card>

              {/* Peer info */}
              <Card style={cardStyle} hidden={!peer.started}>
                <Space size="large" wrap>
                  <div
                    style={{
                      fontWeight: 600,
                      fontSize: 16,
                      color: "#1d3557",
                      userSelect: "all",
                    }}
                  >
                    ID: <span style={{ fontFamily: "monospace" }}>{peer.id}</span>
                  </div>
                  <Button
                    icon={<CopyOutlined />}
                    onClick={async () => {
                      await navigator.clipboard.writeText(peer.id || "");
                      message.success("Copied: " + peer.id);
                    }}
                    type="default"
                    shape="circle"
                    size="large"
                  />
                  <Button
                    danger
                    onClick={handleStopSession}
                    style={dangerButtonStyle}
                    size="large"
                  >
                    Stop
                  </Button>
                </Space>
              </Card>

              {/* Connection input and peer connection button */}
              <div hidden={!peer.started}>
                <Card style={cardStyle}>
                  <Space direction="vertical" style={{ width: "100%" }} size="middle">
                    {/* Recipient wallet address input */}
                    <div>
                      <div style={{ marginBottom: 8, fontWeight: 600 }}>
                        Enter Recipient's Wallet Address:
                      </div>
                      <Space.Compact style={{ width: "100%" }}>
                        <Input
                          placeholder="Enter wallet address of file recipient..."
                          value={recipientAddress}
                          onChange={(e) => {
                            setRecipientAddress(e.target.value);
                            setHasPermission(false); // Reset permission when address changes
                          }}
                          style={inputStyle}
                          size="large"
                        />
                        <Button
                          onClick={() => checkPermission(recipientAddress)}
                          loading={checkingPermission}
                          type="default"
                          size="large"
                          disabled={!recipientAddress.trim()}
                        >
                          Check Permission
                        </Button>
                      </Space.Compact>
                    </div>

                    {/* Peer ID input - only show if permission is granted */}
                    {hasPermission && (
                      <div>
                        <div style={{ marginBottom: 8, fontWeight: 600, color: "#52c41a" }}>
                          ✓ Permission verified! Enter Peer ID to connect:
                        </div>
                        <Space.Compact style={{ width: "100%" }}>
                          <Input
                            placeholder="Enter peer ID"
                            onChange={(e) =>
                              dispatch(connectionAction.changeConnectionInput(e.target.value))
                            }
                            required
                            value={connection.id}
                            style={inputStyle}
                            size="large"
                          />
                          <Button
                            onClick={handleConnectOtherPeer}
                            loading={connection.loading}
                            type="primary"
                            style={primaryButtonStyle}
                            size="large"
                          >
                            Connect
                          </Button>
                        </Space.Compact>
                      </div>
                    )}
                  </Space>
                </Card>

                {/* Active connections */}
                <Card
                  style={cardStyle}
                  title="Connections"
                  headStyle={{ fontWeight: 600, color: "#1d3557" }}
                >
                  {connection.list.length === 0 ? (
                    <div style={{ color: "#777", fontStyle: "italic" }}>
                      Waiting for connections...
                    </div>
                  ) : (
                    <Menu
                      selectedKeys={connection.selectedId ? [connection.selectedId] : []}
                      onSelect={(item) => dispatch(connectionAction.selectItem(item.key))}
                      items={connection.list.map((e) => getItem(e, e, null))}
                      style={{ borderRadius: 8, userSelect: "none" }}
                      mode="vertical"
                    />
                  )}
                </Card>

                {/* File sending area */}
                <Card
                  style={cardStyle}
                  title="Send File"
                  headStyle={{ fontWeight: 600, color: "#1d3557" }}
                >
                  <Upload
                    fileList={fileList}
                    maxCount={1}
                    onRemove={() => setFileList([])}
                    beforeUpload={(file) => {
                      setFileList([file]);
                      return false;
                    }}
                    showUploadList={{
                      showRemoveIcon: true,
                      showDownloadIcon: false,
                    }}
                  >
                    <Button
                      icon={<UploadOutlined />}
                      type="default"
                      style={{ borderRadius: 8 }}
                      size="middle"
                    >
                      Select File
                    </Button>
                  </Upload>

                  <Button
                    type="primary"
                    onClick={handleUpload}
                    disabled={fileList.length === 0}
                    loading={sendLoading}
                    style={{
                      ...primaryButtonStyle,
                      marginTop: 16,
                      width: "100%",
                      fontWeight: 600,
                    }}
                    size="large"
                  >
                    {sendLoading ? "Sending..." : "Send"}
                  </Button>
                </Card>
              </div>
            </>
          )}

          {/* Settings Modal */}
          <Modal
            open={settingsOpen}
            onCancel={() => setSettingsOpen(false)}
            footer={null}
            title="Settings"
          >
            <Space direction="vertical" size="large" style={{ width: "100%" }}>
              <div>
                <b>Grant Permission</b>
                <Space.Compact style={{ width: "100%", marginTop: 8 }}>
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
                  >
                    Grant
                  </Button>
                </Space.Compact>
              </div>
              <div>
                <b>Revoke Permission</b>
                <Space.Compact style={{ width: "100%", marginTop: 8 }}>
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
              </div>
            </Space>
          </Modal>

        </Card>
      </Col>
    </Row>
  );

};

export default App;