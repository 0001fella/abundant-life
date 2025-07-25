import mongoose from 'mongoose';

const resourceSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: String,
  file: { type: String, required: true },
  createdAt: { type: Date, default: Date.now }
});

const Resource = mongoose.model('Resource', resourceSchema);
export default Resource;
