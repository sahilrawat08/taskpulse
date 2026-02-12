const dotenv = require('dotenv');
const connectDB = require('./config/db');

dotenv.config();
connectDB();

console.log('Database connection test...');