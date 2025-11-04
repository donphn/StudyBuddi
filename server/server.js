import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { createServer } from 'http';
import { createServer as createHttpsServer } from 'https';
import { Server } from 'socket.io';
import { testConnection } from './config/database.js';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

// Get __dirname for ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Import routes
import exampleRoutes from './routes/exampleRoutes.js';
import counterRoutes from './routes/counterRoutes.js';
import userRoutes from './routes/userRoutes.js';
import chatRoutes from './routes/chatRoutes.js';

// Load environment variables
dotenv.config();

const app = express();

// Check if HTTPS should be used
const useHttps = process.env.VITE_USE_HTTPS === 'true';
const certPath = path.join(__dirname, '..', 'cert.crt');
const keyPath = path.join(__dirname, '..', 'cert.key');

let server;
if (useHttps && fs.existsSync(certPath) && fs.existsSync(keyPath)) {
  // Use HTTPS for cross-device camera access
  const options = {
    cert: fs.readFileSync(certPath),
    key: fs.readFileSync(keyPath)
  };
  server = createHttpsServer(options, app);
  console.log('Using HTTPS server');
} else {
  // Use HTTP server
  server = createServer(app);
  if (useHttps) {
    console.log('HTTPS requested but certificates not found. Using HTTP instead.');
    console.log('Run: npm run generate-certs');
  }
}

const io = new Server(server, {
  cors: {
    origin: '*',
    methods: ['GET', 'POST']
  }
});
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Test database connection
testConnection();

// Routes
app.get('/', (req, res) => {
  res.json({ message: 'Welcome to StudyBuddi API' });
});

// API routes
app.use('/api/examples', exampleRoutes);
app.use('/api/counter', counterRoutes);
app.use('/api/users', userRoutes);
app.use('/api/chat', chatRoutes);

// WebRTC Signaling - Track users looking for matches
const matchmakingQueue = [];
const userSessions = new Map(); // Map to store user info and socket info

// Socket.IO connection handling
io.on('connection', (socket) => {
  console.log('Client connected:', socket.id);

  socket.on('disconnect', () => {
    console.log('Client disconnected:', socket.id);

    // Remove from matchmaking queue if disconnected while waiting
    const queueIndex = matchmakingQueue.findIndex(u => u.socketId === socket.id);
    if (queueIndex !== -1) {
      matchmakingQueue.splice(queueIndex, 1);
      console.log('User removed from matchmaking queue');
    }

    // Clean up user session
    userSessions.delete(socket.id);
  });

  // Handle user joining matchmaking
  socket.on('joinMatch', (userInfo) => {
    console.log('User joining match:', userInfo.username, socket.id);

    const user = {
      socketId: socket.id,
      username: userInfo.username,
      userId: userInfo.userId
    };

    // Store user session
    userSessions.set(socket.id, user);

    // Check if there's another user waiting
    if (matchmakingQueue.length > 0) {
      // Match found!
      const matchedUser = matchmakingQueue.shift();

      console.log('Match found:', matchedUser.username, 'with', userInfo.username);

      // Notify both users
      socket.emit('matchFound', {
        peerId: matchedUser.socketId,
        peerUsername: matchedUser.username
      });

      io.to(matchedUser.socketId).emit('matchFound', {
        peerId: socket.id,
        peerUsername: userInfo.username
      });
    } else {
      // Add to queue and wait
      matchmakingQueue.push(user);
      socket.emit('waitingForMatch');
    }
  });

  // Handle user canceling match
  socket.on('cancelMatch', () => {
    console.log('User canceling match:', socket.id);

    const queueIndex = matchmakingQueue.findIndex(u => u.socketId === socket.id);
    if (queueIndex !== -1) {
      matchmakingQueue.splice(queueIndex, 1);
      console.log('User removed from matchmaking queue');
    }

    socket.emit('matchCanceled');
  });

  // Handle WebRTC signaling - offer
  socket.on('sendOffer', (data) => {
    const { peerId, offer } = data;
    console.log('Sending offer to:', peerId);
    io.to(peerId).emit('receiveOffer', {
      offer,
      fromId: socket.id
    });
  });

  // Handle WebRTC signaling - answer
  socket.on('sendAnswer', (data) => {
    const { peerId, answer } = data;
    console.log('Sending answer to:', peerId);
    io.to(peerId).emit('receiveAnswer', {
      answer,
      fromId: socket.id
    });
  });

  // Handle WebRTC signaling - ICE candidates
  socket.on('sendIceCandidate', (data) => {
    const { peerId, candidate } = data;
    io.to(peerId).emit('receiveIceCandidate', {
      candidate,
      fromId: socket.id
    });
  });
});

// Make io accessible to routes
app.set('io', io);

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({
    error: 'Something went wrong!',
    message: err.message
  });
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({ error: 'Route not found' });
});

// Start server with Socket.IO
server.listen(PORT, '0.0.0.0', () => {
  const protocol = useHttps ? 'https' : 'http';
  console.log(`Server is running on port ${PORT}`);
  console.log(`API available at ${protocol}://localhost:${PORT}/api`);
  console.log(`Socket.IO enabled for real-time updates`);
});

export default app;
