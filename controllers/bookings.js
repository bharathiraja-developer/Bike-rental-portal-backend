const bookings = require("../models/bookings");

const bookController = {
  showbike: async (req, res) => {
    try {
      const { username } = req.body;
      const Booking = await bookings.findOne({ username });
      res.json(Booking);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },
};

module.exports = bookController;
