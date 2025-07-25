import express from 'express';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import multer from 'multer';
import path from 'path';
import { fileURLToPath } from 'url';

import User from '../models/User.js'; // ✅ Restored import
import Resource from '../models/Resource.js';
import { protect, adminOnly } from '../middleware/authMiddleware.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const router = express.Router();

// ===== Multer Setup =====
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, path.join(__dirname, '../public/uploads/resources'));
  },
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname);
    cb(null, `${Date.now()}-${file.originalname}`);
  }
});
const upload = multer({ storage });

// ===== Admin Login =====
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });
    if (!user) return res.status(401).json({ message: 'Invalid credentials' });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(401).json({ message: 'Invalid credentials' });

    if (user.role !== 'admin') {
      return res.status(403).json({ message: 'Admin access required' });
    }

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
      expiresIn: '1d',
    });

    res.cookie('jwt', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 24 * 60 * 60 * 1000,
    });

    res.status(200).json({
      message: 'Login successful',
      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
      }
    });
  } catch (err) {
    console.error('Login error:', err);
    res.status(500).json({ message: 'Server error during login' });
  }
});

// ===== Admin Dashboard =====
router.get('/dashboard', protect, adminOnly, (req, res) => {
  res.json({ message: 'Welcome to the admin dashboard' });
});

// ===== Get All Resources =====
router.get('/resources', protect, adminOnly, async (req, res) => {
  try {
    const resources = await Resource.find().populate('uploadedBy', 'name email');
    res.json({ resources });
  } catch (err) {
    console.error('Fetch resources error:', err);
    res.status(500).json({ message: 'Failed to load resources' });
  }
});

// ===== Upload Resource =====
router.post('/upload', protect, adminOnly, upload.single('file'), async (req, res) => {
  try {
    const { title, description } = req.body;

    if (!req.file) {
      return res.status(400).json({ message: 'No file uploaded' });
    }

    const filePath = `/uploads/resources/${req.file.filename}`;

    const resource = new Resource({
      title,
      description,
      file: filePath,
      uploadedBy: req.user._id
    });

    await resource.save();

    res.status(201).json({
      success: true,
      message: 'Resource uploaded successfully',
      resource
    });
  } catch (err) {
    console.error('Upload error:', err);
    res.status(500).json({ message: 'Failed to upload resource' });
  }
});

// ===== Edit Resource =====
router.put('/resource/:id', protect, adminOnly, async (req, res) => {
  // Implementation remains the same
});

// ===== Delete Resource =====
router.delete('/resource/:id', protect, adminOnly, async (req, res) => {
  // Implementation remains the same
});

// ===== Test Route =====
router.get('/test', (req, res) => {
  res.send('Admin routes are working!');
});

export default router;
