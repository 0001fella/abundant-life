import Sermon from '../models/sermonModel.js';

// @desc    Get all sermons
export const getSermons = async (req, res) => {
  try {
    const sermons = await Sermon.find().sort({ date: -1 });
    res.status(200).json(sermons);
  } catch (err) {
    console.error('Error fetching sermons:', err.message);
    res.status(500).json({ error: 'Failed to fetch sermons' });
  }
};

// @desc    Create a new sermon
export const createSermon = async (req, res) => {
  try {
    let { title, preacher, scripture, videoUrl, date, description } = req.body;

    title = title?.trim();
    preacher = preacher?.trim();
    scripture = scripture?.trim();
    videoUrl = videoUrl?.trim();
    description = description?.trim();
    date = date?.trim();

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

    const savedSermon = await newSermon.save();
    res.status(201).json(savedSermon);
  } catch (err) {
    console.error('Error creating sermon:', err.message);
    res.status(500).json({ error: 'Failed to create sermon' });
  }
};

// @desc    Update a sermon
export const updateSermon = async (req, res) => {
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
    console.error('Error updating sermon:', err.message);
    res.status(500).json({ error: 'Failed to update sermon' });
  }
};

// @desc    Delete a sermon
export const deleteSermon = async (req, res) => {
  try {
    const deleted = await Sermon.findByIdAndDelete(req.params.id);

    if (!deleted) {
      return res.status(404).json({ error: 'Sermon not found' });
    }

    res.json({ message: 'Sermon deleted successfully' });
  } catch (err) {
    console.error('Error deleting sermon:', err.message);
    res.status(500).json({ error: 'Failed to delete sermon' });
  }
};
