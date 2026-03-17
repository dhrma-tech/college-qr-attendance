const express = require('express');
const path = require('path');
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv');

// Load environment variables
const envPath = path.resolve(__dirname, '.env');
console.log(`Loading .env from ${envPath}`);
dotenv.config({ path: envPath, override: true });

const app = express();

// Middleware
app.use(express.json());
app.use(cors());

// Simple logging middleware
app.use((req, res, next) => {
    console.log(`${req.method} ${req.path}`);
    next();
});

// Routes
app.use('/api/auth', require('./routes/authRoutes'));
app.use('/api/admin', require('./routes/adminRoutes'));
app.use('/api/attendance', require('./routes/attendanceRoutes'));
app.use('/api/hod', require('./routes/hodRoutes'));
app.use('/api/notifications', require('./routes/notificationRoutes'));

// Health check route
app.get('/api/health', (req, res) => {
    res.json({ status: 'ok', message: 'College QR Attendance API is running' });
});

// MongoDB Connection Events
mongoose.connection.on('connected', () => console.log('Mongoose connected to DB'));
mongoose.connection.on('error', (err) => console.error('Mongoose connection error:', err));
mongoose.connection.on('disconnected', () => console.log('Mongoose disconnected'));

// Database connection with fallback and retry logic
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/college-attendance';
const MONGODB_LOCAL_URI = process.env.MONGODB_LOCAL_URI || 'mongodb://localhost:27017/college-attendance';

const connectDB = async () => {
  try {
    const options = {
      serverSelectionTimeoutMS: 15000, // Increased to 15 seconds
      socketTimeoutMS: 60000, // 60 seconds
      connectTimeoutMS: 30000, // 30 seconds to connect
      maxPoolSize: 10,
      minPoolSize: 5,
      maxIdleTimeMS: 30000,
      retryWrites: true,
      w: 'majority',
      bufferCommands: false, // Disable mongoose buffering
      // Add additional connection options for Atlas
      ssl: true,
      sslValidate: false
    };

    // Try Atlas first, then fallback to local
    let uri = MONGODB_URI;
    let connectionSource = 'MongoDB Atlas';
    
    console.log(`Attempting to connect to ${connectionSource}...`);
    
    try {
      const conn = await mongoose.connect(uri, options);
      console.log(`${connectionSource} Connected: ${conn.connection.host}`);
    } catch (atlasError) {
      console.error(`${connectionSource} connection failed:`, atlasError.message);
      
      // Fallback to local MongoDB if Atlas fails
      if (atlasError.message && atlasError.message.includes('IP is not in the whitelist')) {
        console.log('Falling back to local MongoDB...');
        uri = MONGODB_LOCAL_URI;
        connectionSource = 'Local MongoDB';
        
        const conn = await mongoose.connect(uri, options);
        console.log(`${connectionSource} Connected: ${conn.connection.host}`);
      } else {
        throw atlasError;
      }
    }
    
    // Handle connection events
    mongoose.connection.on('error', (err) => {
      console.error('MongoDB connection error:', err);
      if (err.message && err.message.includes('IP is not in the whitelist')) {
        console.error('IP WHITELIST ERROR: Please add server IP to MongoDB Atlas whitelist');
        console.error('Visit: https://cloud.mongodb.com/v2/4.6#/clusters/attendancesys/security/network-access');
      }
    });
    
    mongoose.connection.on('disconnected', () => {
      console.log('MongoDB disconnected');
      // Try to reconnect
      setTimeout(connectDB, 5000);
    });
    
    mongoose.connection.on('reconnected', () => {
      console.log('MongoDB reconnected');
    });
    
  } catch (error) {
    console.error('Database connection error:', error);
    if (error.message && error.message.includes('IP is not in the whitelist')) {
      console.error('IP WHITELIST ERROR: Please add server IP to MongoDB Atlas whitelist');
      console.error('Visit: https://cloud.mongodb.com/v2/4.6#/clusters/attendancesys/security/network-access');
    }
    console.log('Retrying connection in 5 seconds...');
    // Retry connection after 5 seconds
    setTimeout(connectDB, 5000);
  }
};

connectDB();

// Health check route
app.get('/api/health', (req, res) => {
    res.json({ 
        status: 'ok', 
        db: mongoose.connection.readyState === 1 ? 'connected' : 'disconnected',
        message: 'College QR Attendance API is running' 
    });
});

// Debug endpoint
app.get('/api/debug-auth', (req, res) => {
    res.json({
        readyState: mongoose.connection.readyState,
        envVar: process.env.MONGODB_URI ? process.env.MONGODB_URI.replace(/:([^:@]+)@/, ':***@') : 'not set',
        cwd: process.cwd(),
        dirname: __dirname,
    });
});

// Serve frontend in production
if (process.env.NODE_ENV === 'production') {
    app.use(express.static(path.join(__dirname, '../frontend/dist')));
    
    app.get('*', (req, res) => {
        res.sendFile(path.resolve(__dirname, '../frontend', 'dist', 'index.html'));
    });
} else {
    app.get('/', (req, res) => {
        res.send('API is running...');
    });
}

// Graceful shutdown
process.on('SIGTERM', () => {
    console.log('SIGTERM received, shutting down gracefully');
    mongoose.connection.close(() => {
        console.log('MongoDB connection closed');
        process.exit(0);
    });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
