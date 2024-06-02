const mongoose = require("mongoose");

const productschema = new mongoose.Schema({
  name: {
    type: String,
    trim: true,
    required: true,
    unique: true,
  },
  category: {
    type: String,
  },
  MRP: {
    type: Number,
  },
  status: {
    type: String,
    default: "active",
  },
  product_photo: {
    type: String,
  },
  created: {
    type: Date,
    default: Date.now,
  },
  updated: Date,
});

module.exports = mongoose.model("product", productschema);
