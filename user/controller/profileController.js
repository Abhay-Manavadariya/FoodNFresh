const jwt = require("jsonwebtoken");
const User = require("../models/user"); // Ensure the correct path
require("dotenv").config();

exports.uploadProfileImage = async (req, res) => {
  try {
    const token = req.cookies.jwt;

    if (!token) {
      req.flash("uploaderrormsg", "Unauthorized access, please login first");
      return res.redirect("/login");
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const userId = decoded._id;

    if (!req.file) {
      req.flash("uploaderrormsg", "Please upload a photo");
      return res.redirect("/account_setting");
    }

    const updateData = {
      fileName: req.file.originalname,
      image: {
        data: req.file.buffer,
        contentType: req.file.mimetype,
      },
      updated: new Date(),
    };

    const user = await User.findByIdAndUpdate(userId, updateData);

    if (!user) {
      req.flash("uploaderrormsg", "User not found");
      return res.redirect("/account_setting");
    }

    res.redirect("/user_dashboard");
  } catch (error) {
    console.error("Error in profile_upload:", error);
    req.flash(
      "uploaderrormsg",
      "An error occurred during profile photo upload"
    );
    res.redirect("/account_setting");
  }
};
