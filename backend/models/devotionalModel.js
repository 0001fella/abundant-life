import mongoose from "mongoose";

const devotionalSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    trim: true,
  },
  snippet: {
    type: String,
    required: true,
    trim: true,
  },
  scripture: {
    type: String,
    required: true,
    trim: true,
  },
  date: {
    type: Date,
    required: true,
  },
  image: {
    type: String,
    trim: true,
    default: '', // Optional field, default to empty string
  },
}, { timestamps: true });

export default mongoose.model("Devotional", devotionalSchema);
