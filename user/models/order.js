const mongoose = require("mongoose");

const orderSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  addressDetails: {
    address: String,
    city: String,
    zipCode: String,
    state: String,
  },
  items: {
    type: Object,
    required: true,
  },
  orderTime: {
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
  totalPrice: {
    type: Number,
  },
});

module.exports = mongoose.model("order", orderSchema);
