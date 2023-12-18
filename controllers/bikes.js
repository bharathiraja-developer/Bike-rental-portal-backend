const bikes = require("../models/bikes");

const bikeController = {
  showBikes: async (req, res) => {
    try {
      const Bikes = await bikes.find({}, { details: { Available: { gt: 0 } } });
      res.json(Bikes);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },
};

module.exports = bikeController;
