const Admin = require("../models/admin");
const User = require("../../user/models/user");
const Order = require("../../user/models/order");
const jwt = require("jsonwebtoken");
require("dotenv").config();

exports.admin_homepage = async (req, res) => {
  try {
    const cookie = req.cookies.admin_cookie;
    if (!cookie) {
      return res.redirect("/admin/admin_login");
    }

    const decoded = jwt.verify(cookie, process.env.JWT_SECRET);
    const adminId = decoded._id;

    const admin = await Admin.findById(adminId);
    if (!admin) {
      return res.status(400).json({ error: "Admin not found" });
    }

    const no_of_customer = await User.countDocuments();
    const order_request = await Order.countDocuments({
      status: "Order_Pending",
    });
    const order_completed = await Order.countDocuments({
      status: "Order_Delivered",
    });

    res.render("admin", {
      admin,
      no_of_customer,
      order_request,
      order_completed,
    });
  } catch (error) {
    console.error("Error in admin_homepage:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};
