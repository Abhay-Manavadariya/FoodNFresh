const Admin = require("../models/admin");
const jwt = require("jsonwebtoken");
require("dotenv").config();

exports.admin_grocery_details_page = (req, res) => {
  const cookie = req.cookies.admin_cookie;
  if (cookie) {
    getpage(req, res, "admin_grocery_store_details", cookie);
  } else {
    res.redirect("/admin/admin_login");
  }
};

function getpage(req, res, pagename, cookie) {
  const decoded = jwt.verify(cookie, process.env.JWT_SECRET);
  const adminId = decoded._id;

  Admin.findById(adminId).exec((err, admin) => {
    if (err || !admin) {
      return res.status(400).json({
        error: "admin not found",
      });
    }

    res.render(pagename, { admin });
  });
}

exports.admin_grocery_details = (req, res) => {
  const token = req.cookies.admin_cookie;

  if (!token) {
    res.redirect("/admin/admin_login");
  } else {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const adminid = decoded._id;

    Admin.findOneAndUpdate(
      { _id: adminid },
      {
        $set: {
          store_name: req.body.store_name,

          store_address: req.body.store_address,

          store_city: req.body.store_city,

          store_state: req.body.store_state,

          store_postcode: req.body.store_postcode,

          updated: new Date(),
        },
      },
      (err, doc) => {
        if (!err) {
          res.redirect("/admin/");
        } else {
          console.log("Error during record update : " + err);
        }
      }
    );
  }
};
