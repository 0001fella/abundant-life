import express from 'express';
import Donation from '../models/Donation.js';

const router = express.Router();

// @route   POST /api/donations
// @desc    Create a new donation
router.post('/', async (req, res) => {
  try {
    let { name, amount, intentType, intent, message } = req.body;

    // Trim all strings
    name = name?.trim();
    intentType = intentType?.trim();
    intent = intent?.trim();
    message = message?.trim();

    // Validate required fields
    if (!amount || !intentType || !intent) {
      return res.status(400).json({
        error: 'Amount, intent type, and intent are required.',
        received: req.body,
      });
    }

    const donation = new Donation({
      name: name || 'Anonymous',
      amount,
      intentType,
      intent,
      message,
    });

    const saved = await donation.save();
    res.status(201).json(saved);
  } catch (err) {
    console.error('Donation POST error:', err.message);
    res.status(500).json({ error: 'Server error' });
  }
});

// @route   GET /api/donations
// @desc    Get all donations
router.get('/', async (req, res) => {
  try {
    const donations = await Donation.find().sort({ createdAt: -1 });
    res.status(200).json(donations);
  } catch (err) {
    console.error('Donation GET error:', err.message);
    res.status(500).json({ error: 'Server error' });
  }
});

// @route   PUT /api/donations/:id
// @desc    Update a donation
router.put('/:id', async (req, res) => {
  try {
    const updated = await Donation.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });

    if (!updated) {
      return res.status(404).json({ error: 'Donation not found' });
    }

    res.status(200).json(updated);
  } catch (err) {
    console.error('Donation PUT error:', err.message);
    res.status(500).json({ error: 'Update failed' });
  }
});

// @route   DELETE /api/donations/:id
// @desc    Delete a donation
router.delete('/:id', async (req, res) => {
  try {
    const deleted = await Donation.findByIdAndDelete(req.params.id);

    if (!deleted) {
      return res.status(404).json({ error: 'Donation not found' });
    }

    res.status(200).json({ message: 'Donation deleted' });
  } catch (err) {
    console.error('Donation DELETE error:', err.message);
    res.status(500).json({ error: 'Delete failed' });
  }
});

export default router;
