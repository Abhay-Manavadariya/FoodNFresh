const mongoose = require("mongoose");

const categoryschema = new mongoose.Schema({
  name: {
    type: String,
    trim: true,
    required: true,
    unique: true,
  },
  status: {
    type: String,
    default: "active",
  },
  created: {
    type: Date,
    default: Date.now,
  },
  updated: Date,
  category_photo: {
    type: String,
  },
});

module.exports = mongoose.model("category", categoryschema);
