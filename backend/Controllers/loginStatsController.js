// Controllers/loginStatsController.js

export const getLoginStats = async (req, res) => {
  try {
    // You can replace this with your real DB stats logic
    res.json({
      today: 5,
      thisWeek: 23,
      total: 102,
    });
  } catch (error) {
    console.error('Error fetching login stats:', error);
    res.status(500).json({ message: 'Server error fetching login stats' });
  }
};

export const getLoginHistory = async (req, res) => {
  try {
    // Example static data; replace with real user login logs
    res.json([
      { user: 'admin', date: '2025-07-25T10:00:00Z' },
      { user: 'pastor', date: '2025-07-27T14:23:00Z' },
    ]);
  } catch (error) {
    console.error('Error fetching login history:', error);
    res.status(500).json({ message: 'Server error fetching login history' });
  }
};
