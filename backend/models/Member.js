import mongoose from 'mongoose';

const memberSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    trim: true
  },
  role: {
    type: String,
    default: 'member',
    enum: ['member', 'admin', 'moderator'], // Customize as needed
    trim: true
  },
  joinedAt: {
    type: Date,
    default: Date.now
  }
}, { timestamps: true });

const Member = mongoose.model('Member', memberSchema);
export default Member;
