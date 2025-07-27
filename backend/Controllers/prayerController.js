import Prayer from '../models/Prayer.js';

// GET all prayers
export const getAllPrayers = async (req, res) => {
  try {
    const prayers = await Prayer.find().sort({ createdAt: -1 });
    res.status(200).json(prayers);
  } catch (error) {
    console.error('[GET /api/prayers] Error:', error);
    res.status(500).json({ message: 'Failed to fetch prayers' });
  }
};

// POST a new prayer
export const createPrayer = async (req, res) => {
  try {
    const { name, message } = req.body;
    if (!name || !message) {
      return res.status(400).json({ message: 'Name and message are required' });
    }

    const newPrayer = await Prayer.create({ name, message });
    res.status(201).json(newPrayer);
  } catch (error) {
    console.error('[POST /api/prayers] Error:', error);
    res.status(500).json({ message: 'Failed to create prayer' });
  }
};
