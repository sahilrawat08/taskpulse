const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');
const connectDB = require('./config/db');
const { errorHandler } = require('./middlewares/errorMiddleware');


dotenv.config();
connectDB();

const app = express();
// Body parser - MUST BE BEFORE ROUTES
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Enable CORS
app.use(cors());

// Test route
// Test route - add this BEFORE /api/auth
app.get('/api/test', (req, res) => {
  console.log(' Test route hit!');
  res.json({ success: true, message: 'Server is working!' });
});

app.use('/api/auth', require('./routes/authRoutes'));

app.use('/api/projects', require('./routes/projectRoutes'));

app.use('/api/tasks', require('./routes/taskRoutes'));

app.use(errorHandler);

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});