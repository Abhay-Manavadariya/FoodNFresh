const Admin = require("../models/admin");
const Order = require("../../user/models/order");
const jwt = require("jsonwebtoken");
require("dotenv").config();

exports.admin_pending_order_list_page = async (req, res) => {
  try {
    const cookie = req.cookies.admin_cookie;
    if (!cookie) {
      return res.redirect("/admin/admin_login");
    }

    const decoded = jwt.verify(cookie, process.env.JWT_SECRET);
    const adminId = decoded._id;

    const admin = await Admin.findById(adminId).exec();
    if (!admin) {
      return res.status(400).json({ error: "admin not found" });
    }

    const data = await Order.find({ status: "Order_Pending" })
      .populate("userId", "name")
      .exec();

    res.render("admin_pending_order_list", { admin, data });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Internal server error" });
  }
};

exports.admin_processing_order_list_page = async (req, res) => {
  try {
    const cookie = req.cookies.admin_cookie;

    if (!cookie) {
      return res.redirect("/admin/admin_login");
    }

    const decoded = jwt.verify(cookie, process.env.JWT_SECRET);
    const adminId = decoded._id;

    const order_id = req.query.order_id;

    // Update the order status if order_id is provided
    if (order_id) {
      await Order.findByIdAndUpdate(order_id, {
        status: "Order_Packing",
      }).exec();
    }

    // Fetch all orders with status "Order_Packing"
    const data = await Order.find({ status: "Order_Packing" })
      .populate("userId", "name")
      .exec();

    // Find the admin details
    const admin = await Admin.findById(adminId).exec();
    if (!admin) {
      return res.status(400).json({ error: "admin not found" });
    }

    res.render("admin_processing_order_list", { admin, data });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Internal server error" });
  }
};

exports.admin_shipped_order_list_page = async (req, res) => {
  try {
    const cookie = req.cookies.admin_cookie;

    if (!cookie) {
      return res.redirect("/admin/admin_login");
    }

    const decoded = jwt.verify(cookie, process.env.JWT_SECRET);
    const adminId = decoded._id;

    const order_id = req.query.order_id;

    // Update the order status if order_id is provided
    if (order_id) {
      await Order.findByIdAndUpdate(order_id, {
        status: "Order_Shipping",
      }).exec();
    }

    // Fetch all orders with status "Order_Shipping"
    const data = await Order.find({ status: "Order_Shipping" })
      .populate("userId", "name")
      .exec();

    // Find the admin details
    const admin = await Admin.findById(adminId).exec();
    if (!admin) {
      return res.status(400).json({ error: "admin not found" });
    }

    res.render("admin_shipped_order_list", { admin, data });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Internal server error" });
  }
};

exports.admin_completed_order_list_page = async (req, res) => {
  try {
    const cookie = req.cookies.admin_cookie;

    if (!cookie) {
      return res.redirect("/admin/admin_login");
    }

    const decoded = jwt.verify(cookie, process.env.JWT_SECRET);
    const adminId = decoded._id;

    const order_id = req.query.order_id;

    // Update the order status if order_id is provided
    if (order_id) {
      try {
        await Order.findByIdAndUpdate(order_id, {
          status: "Order_Delivered",
        }).exec();
      } catch (err) {
        console.log("Error during record update : " + err);
      }
    }

    // Fetch all orders with status "Order_Delivered"
    const data = await Order.find({ status: "Order_Delivered" })
      .populate("userId", "name")
      .exec();

    // Find the admin details
    const admin = await Admin.findById(adminId).exec();
    if (!admin) {
      return res.status(400).json({ error: "admin not found" });
    }

    res.render("admin_completed_order_list", { admin, data });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Internal server error" });
  }
};

exports.admin_reject_order_list_page = async (req, res) => {
  try {
    const cookie = req.cookies.admin_cookie;

    if (!cookie) {
      return res.redirect("/admin/admin_login");
    }

    const decoded = jwt.verify(cookie, process.env.JWT_SECRET);
    const adminId = decoded._id;

    const order_id = req.query.order_id;

    // Update the order status to "Order_Rejected" if order_id is provided
    if (order_id) {
      try {
        await Order.findByIdAndUpdate(order_id, {
          status: "Order_Rejected",
        }).exec();
      } catch (err) {
        console.log("Error during record update: " + err);
      }
    }

    // Fetch all orders with status "Order_Rejected"
    const data = await Order.find({ status: "Order_Rejected" })
      .populate("userId", "name")
      .exec();

    // Find the admin details
    const admin = await Admin.findById(adminId).exec();
    if (!admin) {
      return res.status(400).json({ error: "admin not found" });
    }

    res.render("admin_reject_order_list", { admin, data });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Internal server error" });
  }
};

exports.admin_order_details_page = async (req, res) => {
  try {
    const cookie = req.cookies.admin_cookie;

    if (!cookie) {
      return res.redirect("/admin/admin_login");
    }

    const decoded = jwt.verify(cookie, process.env.JWT_SECRET);
    const adminId = decoded._id;

    const order_id = req.query.order_id;

    // Find the admin
    const admin = await Admin.findById(adminId).exec();
    if (!admin) {
      return res.status(400).json({ error: "admin not found" });
    }

    // Find the order and populate user information
    const data = await Order.findById(order_id).populate("userId").exec();
    if (!data) {
      return res.status(400).json({ error: "order not found" });
    }

    res.render("admin_order_details", { admin, data });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Internal server error" });
  }
};
