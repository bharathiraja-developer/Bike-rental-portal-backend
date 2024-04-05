const moongose = require("mongoose");

const bookingSchema = new moongose.Schema({
  username: String,
  details: Array,
});

module.exports = moongose.model("booking", bookingSchema, "bookings");
