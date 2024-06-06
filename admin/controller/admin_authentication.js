const Admin = require("../models/admin");
const jwt = require("jsonwebtoken");
require("dotenv").config();
const { validationResult } = require("express-validator");
const fs = require("fs");
const path = require("path");

exports.admin_loginpage = (req, res) => {
  const error = req.flash("admin_login_errormsg");
  const alert = req.flash("admin_alert");
  res.render("admin_login", { alert, error });
};

exports.admin_login = async (req, res) => {
  try {
    // Validate input
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      const alert = errors.array();
      req.flash("admin_alert", alert);
      return res.redirect("/admin/admin_login");
    }

    // Extract email and password from request body
    const { email, password } = req.body;

    // Find the admin based on email
    const admin = await Admin.findOne({ email });
    if (!admin) {
      req.flash(
        "admin_login_errormsg",
        "This email doesn't exist. Please sign up."
      );
      return res.redirect("/admin/admin_login");
    }

    // Authenticate admin
    const isMatch = await admin.authenticate(password);
    if (!isMatch) {
      req.flash("admin_login_errormsg", "Email and password do not match.");
      return res.redirect("/admin/admin_login");
    }

    // Generate token and set cookie
    const token = jwt.sign({ _id: admin._id }, process.env.JWT_SECRET);
    res.cookie("admin_cookie", token, {
      expire: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
      secure: true,
      httpOnly: true,
    });

    // Redirect to admin dashboard
    res.redirect("/admin/");
  } catch (error) {
    console.error("Error in admin_login:", error);
    req.flash(
      "admin_login_errormsg",
      "An unexpected error occurred. Please try again."
    );
    res.redirect("/admin/admin_login");
  }
};

exports.admin_registerpage = (req, res) => {
  const alert = req.flash("admin_alert");
  const errormsg = req.flash("admin_register_errormsg");
  res.render("admin_register", { alert, errormsg });
};

exports.admin_register = async (req, res) => {
  try {
    // Validate input
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      const alert = errors.array();
      req.flash("admin_alert", alert);
      return res.redirect("/admin/admin_register");
    }

    const { password, cpassword, email } = req.body;

    // Check if passwords match
    if (password !== cpassword) {
      req.flash("admin_register_errormsg", "Passwords do not match.");
      return res.redirect("/admin/admin_register");
    }

    // Check if admin already exists
    const adminExists = await Admin.findOne({ email });
    if (adminExists) {
      req.flash(
        "admin_register_errormsg",
        "Email is already taken. Please sign up with a different email."
      );
      return res.redirect("/admin/admin_register");
    }

    // Read the default image file
    const defaultImagePath = path.join(
      __dirname,
      "../public/admin_src/assets/images/admin_profile_images/No_Image_Available.jpg"
    ); // Adjust the path accordingly
    const defaultImage = fs.readFileSync(defaultImagePath);
    const defaultImageContentType = "image/jpg"; // Adjust if your default image is of different type

    // Create and save new admin
    const admin = new Admin({
      ...req.body,
      image: {
        data: defaultImage,
        contentType: defaultImageContentType,
      },
      fileName: "default_profile.png",
    });
    await admin.save();

    req.flash(
      "admin_register_errormsg",
      "Account created successfully. Please log in."
    );
    res.redirect("/admin/admin_register");
  } catch (error) {
    console.error("Error in admin_register:", error);
    req.flash(
      "admin_register_errormsg",
      "An unexpected error occurred. Please try again."
    );
    res.redirect("/admin/admin_register");
  }
};
