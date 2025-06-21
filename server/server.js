const { PeerServer } = require('peerjs');
const express = require('express');
const cors = require('cors');
require('dotenv').config();

const app = express();

// CORS configuration
app.use(
  cors({
    origin: process.env.CLIENT_URL || 'http://localhost:3000',
    credentials: true,
  }),
);

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({
    status: 'OK',
    timestamp: new Date().toISOString(),
    server: 'P2P Signaling Server',
    version: '1.0.0',
  });
});

// Create PeerJS server
const peerServer = PeerServer({
  port: process.env.PEER_PORT || 9000,
  path: '/peerjs',
  allow_discovery: true,
  proxied: true,
  key: process.env.PEER_KEY || 'peerjs',
  // STUN/TURN servers configuration
  config: {
    iceServers: [
      {
        urls: [
          'stun:stun.l.google.com:19302',
          'stun:stun1.l.google.com:19302',
          'stun:stun2.l.google.com:19302',
          'stun:stun3.l.google.com:19302',
          'stun:stun4.l.google.com:19302',
        ],
      },
      // Add TURN servers if available
      // {
      //   urls: 'turn:your-turn-server.com:3478',
      //   username: 'username',
      //   credential: 'password'
      // }
    ],
  },
});

// PeerJS server events
peerServer.on('connection', (client) => {
  console.log(`🔗 New peer connected: ${client.getId()}`);
});

peerServer.on('disconnect', (client) => {
  console.log(`❌ Peer disconnected: ${client.getId()}`);
});

peerServer.on('error', (error) => {
  console.error('🚨 PeerJS server error:', error);
});

// Start the server
const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`🚀 Signaling server running on port ${PORT}`);
  console.log(`📡 PeerJS server running on port ${process.env.PEER_PORT || 9000}`);
  console.log(`🌐 Health check: http://localhost:${PORT}/health`);
  console.log(`🔗 PeerJS endpoint: http://localhost:${process.env.PEER_PORT || 9000}/peerjs`);
  console.log(`🎯 Client URL: ${process.env.CLIENT_URL || 'http://localhost:3000'}`);
});
