import Prayer from '../models/Prayer.js';

// @desc    Get all prayer requests
// @route   GET /api/prayers
export const getAllPrayers = async (req, res) => {
  try {
    const prayers = await Prayer.find().sort({ createdAt: -1 });
    res.status(200).json(prayers);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to fetch prayers' });
  }
};

// @desc    Create a new prayer request
// @route   POST /api/prayers
export const createPrayer = async (req, res) => {
  try {
    const { name = 'Anonymous', request } = req.body;

    if (!request || request.trim() === '') {
      return res.status(400).json({ error: 'Prayer request text is required' });
    }

    const newPrayer = new Prayer({ name, request });
    const savedPrayer = await newPrayer.save();

    res.status(201).json(savedPrayer);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to save prayer' });
  }
};
