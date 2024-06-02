const Admin = require("../models/admin");
const jwt = require("jsonwebtoken");
require("dotenv").config();
const { validationResult } = require("express-validator");

exports.admin_loginpage = (req, res) => {
  const error = req.flash("admin_login_errormsg");
  const alert = req.flash("admin_alert");
  res.render("admin_login", { alert, error });
};

exports.admin_login = (req, res) => {
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    const alert = errors.array();

    req.flash("admin_alert", alert);
    res.redirect("/admin/admin_login");
  } else {
    // find the user based on email
    const { email, password } = req.body;
    // console.log(email,"   ",password);

    Admin.findOne({ email }, async (err, admin) => {
      //console.log(user)
      if (err || !admin) {
        req.flash(
          "admin_login_errormsg",
          "User with this email is doesn't exist . please sign-in"
        );
        res.redirect("/admin/admin_login");
      } else {
        // console.log(user.password);
        const x = await admin.authenticate(password);
        // console.log(x);

        if (x) {
          const token = jwt.sign({ _id: admin._id }, process.env.JWT_SECRET);

          // persist the token as 't' in cookie with expiry date
          //console.log(token);
          res.cookie("admin_cookie", token, {
            expire: new Date() + 9999,
            secure: true,
            httpOnly: true,
          });

          res.redirect("/admin/");
        } else {
          req.flash(
            "admin_login_errormsg",
            "email and password are not matching"
          );
          res.redirect("/admin/admin_login");
        }
      }
    });
  }
};

exports.admin_registerpage = (req, res) => {
  const alert = req.flash("admin_alert");
  const errormsg = req.flash("admin_register_errormsg");
  res.render("admin_register", { alert, errormsg });
  //res.render("admin_register");
};

exports.admin_register = async (req, res) => {
  // all the errors if raised in validation part will be binded into the req part
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    const alert = errors.array();

    req.flash("admin_alert", alert);
    res.redirect("/admin/admin_register");
  } else {
    const password = req.body.password;
    const cpassword = req.body.cpassword;

    if (password === cpassword) {
      const adminexists = await Admin.findOne({ email: req.body.email });

      if (adminexists) {
        req.flash(
          "admin_register_errormsg",
          "Email is already taken signup with different email"
        );
        res.redirect("/admin/admin_register");
      } else {
        const admin = await new Admin(req.body);
        await admin.save();
        req.flash(
          "admin_register_errormsg",
          "Account created successfully. Please Login."
        );
        res.redirect("/admin/admin_register");
      }
    } else {
      req.flash("admin_register_errormsg", "Password doesn't match.");
      res.redirect("/admin/admin_register");
    }
  }
};
