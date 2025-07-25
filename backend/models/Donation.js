import mongoose from 'mongoose';

const donationSchema = new mongoose.Schema({
  donorName: {
    type: String,
    required: true,
    trim: true,
    default: 'Anonymous'
  },
  amount: {
    type: Number,
    required: true,
    min: [0, 'Donation amount must be positive']
  },
  intentType: {
    type: String,
    enum: ['tithe', 'offering', 'project', 'other'],
    required: true,
    trim: true
  },
  intent: {
    type: String,
    required: true,
    trim: true
  },
  message: {
    type: String,
    trim: true
  },
  donatedAt: {
    type: Date,
    default: Date.now
  }
}, { timestamps: true });

const Donation = mongoose.model('Donation', donationSchema);
export default Donation;
