import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import mongoose from 'mongoose';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

import connectDB from './config/db.js';

import authRoutes from './routes/authRoutes.js';
import adminRoutes from './routes/adminRoutes.js';
import testimonialRoutes from './routes/testimonialRoutes.js';
import sermonRoutes from './routes/sermonRoutes.js';
import prayerRoutes from './routes/prayerRoutes.js';
import devotionalRoutes from './routes/devotionalRoutes.js';
import eventRoutes from './routes/eventRoutes.js';
import donationRoutes from './routes/donationRoutes.js';
import resourceRoutes from './routes/resourceRoutes.js';
import memberRoutes from './routes/memberRoutes.js';
import userRoutes from './routes/userRoutes.js';

const app = express();
const PORT = process.env.PORT || 5000;
const CLIENT_URL = process.env.FRONTEND_DEV_URL || 'http://localhost:5173';

app.use(cors({
  origin: CLIENT_URL,
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

app.use((req, res, next) => {
  console.log(`[${new Date().toISOString()}] ${req.method} ${req.path}`);
  next();
});

// Create necessary directories
const publicUploadsDir = path.join(__dirname, 'public', 'uploads');
const sermonsDir = path.join(__dirname, 'public', 'uploads', 'sermons');

[publicUploadsDir, sermonsDir].forEach(dir => {
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
    console.log(`Created directory: ${dir}`);
  }
});

// Serve static files
app.use('/uploads', express.static(publicUploadsDir)); // Serve event images
app.use('/sermons', express.static(sermonsDir));      // Serve sermons
app.use('/resources', express.static(publicUploadsDir)); // Alias for resources

// API Routes
app.use('/api/auth', authRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/testimonials', testimonialRoutes);
app.use('/api/sermons', sermonRoutes);
app.use('/api/prayers', prayerRoutes);
app.use('/api/devotionals', devotionalRoutes);
app.use('/api/events', eventRoutes);
app.use('/api/donations', donationRoutes);
app.use('/api/resources', resourceRoutes);
app.use('/api/members', memberRoutes);
app.use('/api/users', userRoutes);

app.get('/api/health', (req, res) => {
  res.status(200).json({
    status: 'healthy',
    time: new Date(),
    database: mongoose.connection.readyState === 1 ? 'connected' : 'disconnected'
  });
});

if (process.env.NODE_ENV === 'production') {
  const __clientDir = path.resolve(__dirname, '../client/dist');
  app.use(express.static(__clientDir));

  app.get('*', (req, res) => {
    res.sendFile(path.resolve(__clientDir, 'index.html'));
  });
}

app.use('/api/*', (req, res) => {
  res.status(404).json({
    success: false,
    message: 'API route not found',
    requestedPath: req.path,
    availableRoutes: [
      '/api/auth', '/api/admin', '/api/testimonials',
      '/api/sermons', '/api/events', '/api/resources'
    ]
  });
});

app.use((err, req, res, next) => {
  console.error(`[ERROR] ${err.stack}`);
  const status = err.statusCode || 500;
  res.status(status).json({
    success: false,
    message: process.env.NODE_ENV === 'development'
      ? err.message
      : 'Something went wrong',
    ...(process.env.NODE_ENV === 'development' && { stack: err.stack })
  });
});

const startServer = async () => {
  try {
    await connectDB();
    app.listen(PORT, () => {
      console.log(`
🚀 Server running on port ${PORT}
📁 Static files:
   - Event Images: /uploads → ${publicUploadsDir}
   - Sermons: /sermons → ${sermonsDir}
🌐 CORS enabled for: ${CLIENT_URL}
`);
    });
  } catch (error) {
    console.error('❌ Server startup failed:', error);
    process.exit(1);
  }
};

startServer();