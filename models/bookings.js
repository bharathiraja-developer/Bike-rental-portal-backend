const moongose = require("mongoose");

const bookingSchema = new moongose.Schema({
  username: String,
  details: [
    {
      modelName: String,
      price: Array,
      location: String,
      pick: String,
      drop: String,
      image: String,
      bookedAt: String,
      details: {
        kilometers: String,
        selfstart: Boolean,
        cc: String,
        year: Number,
        brand: String,
        fuel: String,
        Available: Number,
      },
    },
  ],
});

module.exports = moongose.model("booking", bookingSchema, "bookings");
