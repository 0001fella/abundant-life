import Devotional from '../models/devotionalModel.js';

// @desc    Get all devotionals
export const getDevotionals = async (req, res) => {
  try {
    const devotionals = await Devotional.find().sort({ date: -1 });
    res.status(200).json(devotionals);
  } catch (err) {
    console.error('Get Devotionals Error:', err.message);
    res.status(500).json({ error: 'Failed to fetch devotionals', details: err.message });
  }
};

// @desc    Create a new devotional
export const createDevotional = async (req, res) => {
  try {
    let { title, snippet, scripture, date } = req.body;

    // Sanitize inputs
    title = title?.trim();
    snippet = snippet?.trim();
    scripture = scripture?.trim();
    date = date?.trim();

    // Validate presence
    if (!title || !snippet || !scripture || !date) {
      return res.status(400).json({
        error: 'Title, snippet, scripture, and date are required.',
        received: req.body
      });
    }

    // Validate date format
    const parsedDate = new Date(date);
    if (isNaN(parsedDate.getTime())) {
      return res.status(400).json({ error: 'Invalid date format.' });
    }

    const newDevotional = await Devotional.create({
      title,
      snippet,
      scripture,
      date: parsedDate,
    });

    res.status(201).json(newDevotional);
  } catch (err) {
    console.error('Create Devotional Error:', err.message);
    res.status(500).json({ error: 'Failed to create devotional', details: err.message });
  }
};

// @desc    Update a devotional
export const updateDevotional = async (req, res) => {
  try {
    let { title, snippet, scripture, date } = req.body;

    // Sanitize and validate
    title = title?.trim();
    snippet = snippet?.trim();
    scripture = scripture?.trim();
    date = date?.trim();

    if (!title || !snippet || !scripture || !date) {
      return res.status(400).json({ error: 'All fields are required for update.' });
    }

    const parsedDate = new Date(date);
    if (isNaN(parsedDate.getTime())) {
      return res.status(400).json({ error: 'Invalid date format.' });
    }

    const updated = await Devotional.findByIdAndUpdate(
      req.params.id,
      {
        title,
        snippet,
        scripture,
        date: parsedDate,
      },
      { new: true, runValidators: true }
    );

    if (!updated) {
      return res.status(404).json({ error: 'Devotional not found' });
    }

    res.status(200).json(updated);
  } catch (err) {
    console.error('Update Devotional Error:', err.message);
    res.status(500).json({ error: 'Failed to update devotional', details: err.message });
  }
};

// @desc    Delete a devotional
export const deleteDevotional = async (req, res) => {
  try {
    const deleted = await Devotional.findByIdAndDelete(req.params.id);

    if (!deleted) {
      return res.status(404).json({ error: 'Devotional not found' });
    }

    res.status(200).json({ message: 'Devotional deleted successfully' });
  } catch (err) {
    console.error('Delete Devotional Error:', err.message);
    res.status(500).json({ error: 'Failed to delete devotional', details: err.message });
  }
};
