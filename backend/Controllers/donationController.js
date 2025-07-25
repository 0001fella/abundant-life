import Donation from '../models/donationModel.js';

// @desc    Get all donations
export const getDonations = async (req, res) => {
  try {
    const donations = await Donation.find().sort({ createdAt: -1 });
    res.status(200).json(donations);
  } catch (err) {
    console.error('Get Donations Error:', err.message);
    res.status(500).json({ error: 'Failed to fetch donations' });
  }
};

// @desc    Create a new donation
export const createDonation = async (req, res) => {
  try {
    let { name, amount, method, date } = req.body;

    name = name?.trim();
    method = method?.trim();
    date = date?.trim();

    if (!name || !amount || !method || !date) {
      return res.status(400).json({
        error: 'Name, amount, method, and date are required.',
        received: req.body,
      });
    }

    const parsedDate = new Date(date);
    if (isNaN(parsedDate.getTime())) {
      return res.status(400).json({ error: 'Invalid date format.' });
    }

    const newDonation = await Donation.create({
      name,
      amount,
      method,
      date: parsedDate,
    });

    res.status(201).json(newDonation);
  } catch (err) {
    console.error('Create Donation Error:', err.message);
    res.status(500).json({ error: 'Failed to create donation' });
  }
};

// @desc    Delete a donation
export const deleteDonation = async (req, res) => {
  try {
    const deleted = await Donation.findByIdAndDelete(req.params.id);
    if (!deleted) {
      return res.status(404).json({ error: 'Donation not found' });
    }
    res.status(200).json({ message: 'Donation deleted successfully' });
  } catch (err) {
    console.error('Delete Donation Error:', err.message);
    res.status(500).json({ error: 'Failed to delete donation' });
  }
};
