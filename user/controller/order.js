const Order = require("../models/order");
const User = require("../models/user");
const jwt = require("jsonwebtoken");
require("dotenv").config();

exports.order = async (req, res) => {
  try {
    // Check if user is authenticated
    const token = req.cookies.jwt;
    if (!token) {
      return res.redirect("/login");
    }

    // Extract user ID from token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const userId = decoded._id;

    const { address, city, states, zipCode } = req.body;

    // Create new order instance
    const order = await new Order({
      userId: userId,
      items: req.session.cart.items,
      totalPrice: req.body.totalPrice,
      addressDetails: {
        address: address,
        city: city,
        zipCode: zipCode,
        state: states,
      },
    });

    await order.save().then((result) => {
      req.flash("success", "Order Request Sent Successfully.");

      delete req.session.cart;

      res.redirect("/order_history");
    });
  } catch (error) {
    console.error("Error in Order:", error);
    // Flash error message and redirect to checkout page
    req.flash("error", "Order Does not Placed Successfully");
    res.redirect("/checkout");
  }
};

exports.order_details_page = async (req, res) => {
  try {
    const token = req.cookies.jwt;

    if (!token) {
      return res.redirect("/login");
    }

    const order_id = req.query.order_id;
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const userId = decoded._id;

    // Find the order and populate the user data
    const orderData = await Order.findOne({ _id: order_id, userId })
      .populate("userId")
      .exec();

    if (!orderData) {
      req.flash("error", "Order not found");
      return res.redirect("/order_history");
    }

    console.log("orderData :-", orderData);
    // Render the order details page with the combined order and user data
    res.render("order_details", { cookie: "generated", orderData });
  } catch (error) {
    console.error("Error in order_details_page:", error);
    req.flash("error", "An error occurred while fetching the order details");
    res.redirect("/order_history");
  }
};

exports.order_history_page = async (req, res) => {
  try {
    const token = req.cookies.jwt;

    if (!token) {
      return res.redirect("/login");
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const userId = decoded._id;

    const orders = await Order.find({ userId: userId }).sort({ orderTime: -1 });

    res.render("order_history", {
      cookie: "generated",
      orderList: orders,
    });
  } catch (error) {
    console.error("Error in order_history_page:", error);
    req.flash("error", "An error occurred while fetching order history.");
    res.redirect("/login");
  }
};
