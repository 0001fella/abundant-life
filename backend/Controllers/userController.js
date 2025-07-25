import User from '../models/User.js';
import bcrypt from 'bcryptjs';

export const updateProfile = async (req, res) => {
  try {
    const { name, email, avatar, currentPassword, newPassword } = req.body;

    // ✅ Authenticated user is set by protect middleware
    const user = await User.findById(req.user._id);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // ✅ Update basic info
    if (name) user.name = name;
    if (email) user.email = email;
    if (avatar) user.profileImage = avatar; // cloudinary URL

    // ✅ Password change (optional)
    if (currentPassword && newPassword) {
      const isMatch = await bcrypt.compare(currentPassword, user.password);
      if (!isMatch) {
        return res.status(400).json({ message: 'Current password is incorrect' });
      }

      if (newPassword.length < 6) {
        return res.status(400).json({ message: 'Password must be at least 6 characters' });
      }

      const salt = await bcrypt.genSalt(10);
      user.password = await bcrypt.hash(newPassword, salt);
    }

    const updatedUser = await user.save();

    res.json({
      _id: updatedUser._id,
      name: updatedUser.name,
      email: updatedUser.email,
      profileImage: updatedUser.profileImage,
      role: updatedUser.role,
    });

  } catch (error) {
    console.error('Profile update error:', error);
    res.status(500).json({
      message: 'Profile update failed',
      error: error.message,
    });
  }
};
