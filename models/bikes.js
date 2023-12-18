const mongoose = require("mongoose");

const bikeSchema = new mongoose.Schema({
  modelName: String,
  price: Array,
  location: String,
  image: String,
  details: {
    kilometers: String,
    selfstart: Boolean,
    cc: String,
    year: Number,
    brand: String,
    fuel: String,
    Available: Number,
  },
});

module.exports = mongoose.model("Bike", bikeSchema, "bikes");
