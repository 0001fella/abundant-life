import User from '../models/User.js';
import bcrypt from 'bcryptjs';
import sharp from 'sharp'; // Optional: for image processing

export const updateAdminProfile = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, email, phone, currentPassword, newPassword } = req.body;

    const user = await User.findById(id).select('+password');
    if (!user) return res.status(404).json({ message: 'User not found' });

    if (currentPassword && newPassword) {
      const match = await user.matchPassword(currentPassword);
      if (!match) return res.status(400).json({ message: 'Incorrect current password' });
      user.password = newPassword;
    }

    user.name = name || user.name;
    user.email = email || user.email;
    user.phone = phone || user.phone;

    if (req.file) {
      const buffer = await sharp(req.file.buffer).resize({ width: 200 }).png().toBuffer();
      user.profileImage = buffer.toString('base64'); // or save the file path to disk
    }

    await user.save();
    res.status(200).json({ message: 'Profile updated successfully', user });
  } catch (error) {
    console.error('Update failed:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};
