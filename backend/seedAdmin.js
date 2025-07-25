// seedAdmin.js
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import bcrypt from 'bcryptjs';
import User from './models/User.js';

dotenv.config();

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log('✅ Connected to MongoDB');
  } catch (err) {
    console.error('❌ MongoDB Connection Error:', err);
    process.exit(1);
  }
};

const seedAdmin = async () => {
  await connectDB();

  const existingAdmin = await User.findOne({ email: process.env.ADMIN_EMAIL });
  if (existingAdmin) {
    console.log('⚠️ Admin already exists');
    process.exit(0);
  }

  const hashedPassword = await bcrypt.hash(process.env.ADMIN_PASSWORD, 10);

  const admin = new User({
    email: process.env.ADMIN_EMAIL,
    password: hashedPassword,
    role: 'admin',
  });

  await admin.save();
  console.log('✅ Admin created successfully');
  process.exit(0);
};

seedAdmin();
