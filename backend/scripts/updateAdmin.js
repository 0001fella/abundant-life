// scripts/updateAdmin.js
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import bcrypt from 'bcryptjs';
import User from '../models/User.js';

dotenv.config();

const updateAdmin = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true
    });

    const email = 'fanteskorri36@gmail.com';
    const newPlainPassword = 'fantes36';
    const hashedPassword = bcrypt.hashSync(newPlainPassword, 10);

    const updated = await User.findOneAndUpdate(
      { email },
      {
        $set: {
          password: hashedPassword,
          role: 'admin'
        }
      },
      { new: true }
    );

    if (updated) {
      console.log('✅ Admin user updated successfully:', updated.email);
    } else {
      console.log('❌ Admin user not found');
    }

    mongoose.connection.close();
  } catch (err) {
    console.error('❌ Error updating admin user:', err);
    mongoose.connection.close();
  }
};

updateAdmin();
