const Admin = require("../models/admin");
const User = require("../../user/models/user");

const jwt = require("jsonwebtoken");
require("dotenv").config();

exports.admin_customer_list_page = (req, res) => {
  const cookie = req.cookies.admin_cookie;
  if (cookie) {
    const decoded = jwt.verify(cookie, process.env.JWT_SECRET);
    const adminId = decoded._id;

    User.find({}, function (err, posts) {
      if (err) {
        console.log(err);
      } else {
        Admin.findById(adminId).exec((err, admin) => {
          if (err || !admin) {
            return res.status(400).json({
              error: "admin not found",
            });
          }

          res.render("admin_customer", { admin, posts });
        });
      }
    });
  } else {
    res.redirect("/admin/admin_login");
  }
};
