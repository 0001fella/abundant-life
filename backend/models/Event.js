import mongoose from 'mongoose';

const eventSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String },
  date: { type: Date, required: true },
  location: { type: String },
  image: {
    type: String, // e.g., '/uploads/event123.jpg'
    required: false
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  category: {
    type: String,
    required: true,
    enum: [
      'General Church Events',
      'Men',
      'Women',
      'Children',
      'Youths',
      'Teens',
      'Visionaries'
    ],
    default: 'General Church Events'
  }
});

const Event = mongoose.model('Event', eventSchema);

export default Event;
