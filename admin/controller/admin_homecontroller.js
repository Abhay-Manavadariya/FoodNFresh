const Admin = require("../models/admin");
const User = require("../../user/models/user");
const Order = require("../../user/models/order");
const jwt = require("jsonwebtoken");
require("dotenv").config();

exports.admin_homepage = async (req, res) => {
  const cookie = req.cookies.admin_cookie;
  if (cookie) {
    const decoded = jwt.verify(cookie, process.env.JWT_SECRET);
    const adminId = decoded._id;
    const no_of_customer = await User.find({}).count();
    const order_request = await Order.find({ status: "Order_Pending" }).count();
    const order_completed = await Order.find({
      status: "Order_Delivered",
    }).count();

    Admin.findById(adminId).exec((err, admin) => {
      if (err || !admin) {
        return res.status(400).json({
          error: "admin not found",
        });
      }

      res.render("admin", {
        admin,
        no_of_customer,
        order_request,
        order_completed,
      });
    });
  } else {
    res.redirect("/admin/admin_login");
  }
};
