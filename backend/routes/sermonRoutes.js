import express from 'express';
import Sermon from '../models/Sermon.js'; // Ensure the model path is correct

const router = express.Router();

// @route GET /api/sermons
router.get('/', async (req, res) => {
  try {
    const sermons = await Sermon.find().sort({ date: -1 });
    res.json(sermons);
  } catch (err) {
    console.error('GET sermons error:', err.message);
    res.status(500).json({ error: 'Failed to fetch sermons' });
  }
});

// @route POST /api/sermons
router.post('/', async (req, res) => {
  try {
    let { title, preacher, scripture, videoUrl, date, description } = req.body;

    // Optional: trim values
    title = title?.trim();
    preacher = preacher?.trim();
    scripture = scripture?.trim();
    videoUrl = videoUrl?.trim();
    description = description?.trim();

    if (!title || !preacher || !scripture || !videoUrl || !date) {
      return res.status(400).json({
        error: 'Title, preacher, scripture, video URL, and date are required',
        received: req.body,
      });
    }

    const parsedDate = new Date(date);
    if (isNaN(parsedDate.getTime())) {
      return res.status(400).json({ error: 'Invalid date format' });
    }

    const newSermon = new Sermon({
      title,
      preacher,
      scripture,
      videoUrl,
      date: parsedDate,
      description,
    });

    const saved = await newSermon.save();
    res.status(201).json(saved);
  } catch (err) {
    console.error('POST sermon error:', err.message);
    res.status(500).json({ error: 'Failed to create sermon' });
  }
});

// @route PUT /api/sermons/:id
router.put('/:id', async (req, res) => {
  try {
    const updated = await Sermon.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });

    if (!updated) {
      return res.status(404).json({ error: 'Sermon not found' });
    }

    res.json(updated);
  } catch (err) {
    console.error('PUT sermon error:', err.message);
    res.status(500).json({ error: 'Failed to update sermon' });
  }
});

// @route DELETE /api/sermons/:id
router.delete('/:id', async (req, res) => {
  try {
    const deleted = await Sermon.findByIdAndDelete(req.params.id);

    if (!deleted) {
      return res.status(404).json({ error: 'Sermon not found' });
    }

    res.json({ message: 'Sermon deleted successfully' });
  } catch (err) {
    console.error('DELETE sermon error:', err.message);
    res.status(500).json({ error: 'Failed to delete sermon' });
  }
});

export default router;
