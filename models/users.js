const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  username: String,
  passwordHash: String,
  name: String,
  mobile: String,
  address: String,
  bookings: Array,
});

module.exports = mongoose.model("user", userSchema, "users");
