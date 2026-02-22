const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');
const http = require('http');
const { Server } = require('socket.io');
const connectDB = require('./config/db');
const { errorHandler } = require('./middlewares/errorMiddleware');

dotenv.config();
connectDB();

const app = express();
const server = http.createServer(app);

const io = new Server(server, {
  cors: {
    origin: process.env.CLIENT_URL || 'http://localhost:5173',
    methods: ['GET', 'POST'],
  },
});

// Socket.io
io.on('connection', (socket) => {
  socket.on('join', (userId) => {
    socket.join(userId);
  });
  socket.on('joinProject', (projectId) => {
    socket.join(`project_${projectId}`);
  });
  socket.on('leaveProject', (projectId) => {
    socket.leave(`project_${projectId}`);
  });
  socket.on('taskUpdated', (data) => {
    socket.to(`project_${data.projectId}`).emit('taskUpdated', data);
  });
  socket.on('newComment', (data) => {
    socket.to(`project_${data.projectId}`).emit('newComment', data);
  });
});

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors({
  origin: process.env.CLIENT_URL || 'http://localhost:5173',
  credentials: true,
}));

// Routes
app.get('/api/test', (req, res) => {
  res.json({ success: true, message: 'Server is working!' });
});

app.use('/api/auth', require('./routes/authRoutes'));
app.use('/api/projects', require('./routes/projectRoutes'));
app.use('/api/tasks', require('./routes/taskRoutes'));
app.use('/api/users', require('./routes/userRoutes'));
app.use('/api/notifications', require('./routes/notificationRoutes'));

// Comment routes nested under tasks
app.use('/api/tasks/:taskId/comments', require('./routes/commentRoutes'));

app.use(errorHandler);

const PORT = process.env.PORT || 5001;

server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});