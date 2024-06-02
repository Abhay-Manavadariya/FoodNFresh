const mongoose = require("mongoose");

const orderschema = new mongoose.Schema({
  name: {
    type: String,
    trim: true,
    required: true,
  },
  address: {
    type: String,
    required: true,
  },
  city: {
    type: String,
  },
  state: {
    type: String,
  },
  country: {
    type: String,
    default: "India",
  },
  zipcode: {
    type: Number,
  },
  email: {
    type: String,
    trim: true,
    required: true,
  },
  phonenumber: {
    type: Number,
  },
  items: {
    type: Object,
    required: true,
  },
  ordertime: {
    type: Date,
    default: Date.now,
  },
  payment: {
    type: String,
    default: "COD",
  },
  status: {
    type: String,
    default: "Order_Pending",
  },
  totalprice: {
    type: Number,
  },
  qty: {
    type: Number,
  },
});

module.exports = mongoose.model("order", orderschema);
