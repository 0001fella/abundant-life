// controllers/eventController.js
import Event from '../models/Event.js';

// @desc    Get all events
// @route   GET /api/events
export const getEvents = async (req, res) => {
  try {
    const events = await Event.find().sort({ createdAt: -1 });
    res.json(events);
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
};

// @desc    Create a new event
// @route   POST /api/events
export const createEvent = async (req, res) => {
  try {
    const {
      title,
      description,
      date,
      location,
      category = 'General Church Events'
    } = req.body;

    const newEvent = new Event({
      title,
      description,
      date,
      location,
      category,
      image: req.file ? `/uploads/${req.file.filename}` : null
    });

    const saved = await newEvent.save();
    res.status(201).json(saved);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

// @desc    Update an event
// @route   PUT /api/events/:id
export const updateEvent = async (req, res) => {
  try {
    const {
      title,
      description,
      date,
      location,
      category
    } = req.body;

    const updates = {
      title,
      description,
      date,
      location,
      category
    };

    // Only update image if a new one is uploaded
    if (req.file) {
      updates.image = `/uploads/${req.file.filename}`;
    }

    const updated = await Event.findByIdAndUpdate(
      req.params.id,
      updates,
      { new: true, runValidators: true }
    );

    if (!updated) {
      return res.status(404).json({ error: 'Event not found' });
    }

    res.json(updated);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Update failed' });
  }
};

// @desc    Delete an event
// @route   DELETE /api/events/:id
export const deleteEvent = async (req, res) => {
  try {
    const deleted = await Event.findByIdAndDelete(req.params.id);
    if (!deleted) {
      return res.status(404).json({ error: 'Event not found' });
    }
    res.json({ message: 'Event deleted' });
  } catch (err) {
    res.status(500).json({ error: 'Delete failed' });
  }
};
