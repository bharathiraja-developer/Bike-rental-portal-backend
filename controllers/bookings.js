const booking = require("../models/bookings");

const bookController = {
  showbike: async (req, res) => {
    const username = req.params.email;
    try {
      const Bookings = await booking.findOne({ username });
      res.json(Bookings);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },
};

module.exports = bookController;
