require('dotenv').config();
const express = require('express');
const cors = require('cors');
const http = require('http');
const { Server } = require('socket.io');
const path = require('path');

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: process.env.SOCKET_CORS_ORIGIN || 'http://localhost:5173',
    methods: ['GET', 'POST']
  }
});

const PORT = process.env.PORT || 3001;

app.use(cors());
app.use(express.json());
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Make io available to routes via app
app.set('io', io);

// Socket.io real-time rooms
io.on('connection', (socket) => {
  socket.on('join-room', (studentId) => {
    socket.join(`student-${studentId}`);
  });
  socket.on('mentor-join', (mentorId) => {
    socket.join('mentor-room');
  });
});

// Routes
app.use('/api/ask', require('./routes/ask'));
app.use('/api/mentor', require('./routes/mentor'));
app.use('/api/auth', require('./routes/auth'));
app.use('/api/packs', require('./routes/packs'));
app.use('/api/match', require('./routes/match'));
app.use('/api/student', require('./routes/student'));

app.get('/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// Use server.listen (not app.listen) for Socket.io
server.listen(PORT, () => {
  console.log('BridgeMinds backend running on port ' + PORT);
});
