const booking = require("../models/bookings");

const bookController = {
  showbike: async (req, res) => {
    try {
      const { username } = req.body;
      const Bookings = await booking.findOne({ username });
      res.json(Bookings);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },
};

module.exports = bookController;
