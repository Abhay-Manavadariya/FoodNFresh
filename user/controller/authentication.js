const fs = require("fs");
const path = require("path");
const { validationResult } = require("express-validator");
const User = require("../models/user");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
require("dotenv").config();

exports.login = (req, res) => {
  const err = req.flash("login_errormsg");
  const alert = req.flash("alert");
  res.render("login", { err, alert });
};

exports.signIn = async (req, res) => {
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    const alert = errors.array();
    req.flash("alert", alert);
    return res.redirect("/login");
  }

  // find the user based on email
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ email });
    if (!user) {
      req.flash(
        "login_errormsg",
        "User with this email doesn't exist. Please sign-up."
      );
      return res.redirect("/login");
    }

    const isAuthenticated = await user.authenticate(password);
    if (!isAuthenticated) {
      req.flash("login_errormsg", "Email and password do not match.");
      return res.redirect("/login");
    }

    const token = jwt.sign({ _id: user._id }, process.env.JWT_SECRET, {
      expiresIn: "7d",
    }); // Token valid for 7 days

    // Set cookie to expire in 7 days (same duration as the token)
    res.cookie("jwt", token, {
      expires: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7 days
      secure: true,
      httpOnly: true,
    });

    res.redirect("/");
  } catch (err) {
    console.error(err);
    req.flash(
      "login_errormsg",
      "An error occurred during login. Please try again."
    );
    res.redirect("/login");
  }
};

exports.register = (req, res) => {
  const error = req.flash("register_errormsg");
  const alert = req.flash("alert");
  res.render("register", { error, alert });
};

exports.signup = async (req, res) => {
  // all the errors if raised in validation part will be binded into the req part

  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    req.flash("alert", errors.array());
    return res.redirect("/register");
  }

  const { email, password, confirmPassword } = req.body;

  if (password !== confirmPassword) {
    req.flash("register_errormsg", "Passwords do not match.");
    return res.redirect("/register");
  }

  try {
    const userExists = await User.findOne({ email });

    if (userExists) {
      req.flash(
        "register_errormsg",
        "Email is already taken. Please use a different email."
      );
      return res.redirect("/register");
    }

    // Read the default image file
    const defaultImagePath = path.join(
      __dirname,
      "../public/src/images/profile_images/No_Image_Available.jpg"
    ); // Adjust the path accordingly
    const defaultImage = fs.readFileSync(defaultImagePath);
    const defaultImageContentType = "image/jpg"; // Adjust if your default image is of different type

    const user = new User({
      ...req.body,
      image: {
        data: defaultImage,
        contentType: defaultImageContentType,
      },
      fileName: "default_profile.png", // You can change this to any appropriate file name
    });

    await user.save();

    req.flash(
      "register_errormsg",
      "Account created successfully. Please log in."
    );
    res.redirect("/register");
  } catch (err) {
    console.error(err);
    req.flash(
      "register_errormsg",
      "An error occurred during registration. Please try again."
    );
    res.redirect("/register");
  }
};

exports.forgot_password_page = (req, res) => {
  const alert = req.flash("alert");
  const changepw = req.flash("changepw");
  const successful = req.flash("successful");
  res.render("forgot_password", { alert, changepw, successful });
};

exports.forgot_password = async (req, res) => {
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    req.flash("alert", errors.array());
    return res.redirect("/forgot_password");
  }

  const { email, password, cpassword } = req.body;

  if (password !== cpassword) {
    req.flash("changepw", "New Password and Confirm Password do not match.");
    return res.redirect("/forgot_password");
  }

  try {
    const salt = bcrypt.genSaltSync(12);
    const hashedPassword = bcrypt.hashSync(password, salt);

    const user = await User.findOneAndUpdate(
      { email },
      { password: hashedPassword, updated: new Date() }
    );

    if (!user) {
      req.flash("alert", "Error during password update. Please try again.");
      return res.redirect("/forgot_password");
    }

    req.flash("successful", "Password changed successfully. Please log in.");
    res.redirect("/forgot_password");
  } catch (err) {
    console.error(err);
    req.flash(
      "alert",
      "An error occurred during password update. Please try again."
    );
    res.redirect("/forgot_password");
  }
};
