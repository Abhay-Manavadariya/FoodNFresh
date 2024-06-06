const jwt = require("jsonwebtoken");
require("dotenv").config();
const Admin = require("../models/admin");

exports.admin_profile_photo = async (req, res) => {
  try {
    const token = req.cookies.admin_cookie;
    if (!token) {
      return res.redirect("/admin/admin_login");
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const adminId = decoded._id;

    if (!req.file) {
      req.flash("uploaderrormsg", "Please upload the Photo");
      return res.redirect("/admin/admin_profile");
    }

    const updateData = {
      fileName: req.file.originalname,
      image: {
        data: req.file.buffer,
        contentType: req.file.mimetype,
      },
      updated: new Date(),
    };

    const admin = await Admin.findByIdAndUpdate(adminId, updateData);

    res.redirect("/admin/");
  } catch (err) {
    console.error("Error during record update:", err);
    req.flash("uploaderrormsg", "Error during record update");
    res.redirect("/admin/admin_profile");
  }
};
