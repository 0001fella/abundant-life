import mongoose from 'mongoose';

const sermonSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    trim: true,
  },
  speaker: {
    type: String,
    required: true,
    trim: true,
  },
  date: {
    type: Date,
    required: true,
  },
  description: {
    type: String,
    trim: true,
  },
  videoUrl: {
    type: String,
    trim: true,
  },
  audioUrl: {
    type: String,
    trim: true,
  },
  image: {
    type: String,
    trim: true,
  },
}, { timestamps: true });

const Sermon = mongoose.model('Sermon', sermonSchema);
export default Sermon;
