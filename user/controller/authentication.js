const { validationResult } = require("express-validator");
const User = require("../models/user");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
require("dotenv").config();

exports.loginpage = (req, res) => {
  const err = req.flash("login_errormsg");
  const alert = req.flash("alert");
  res.render("login", { err, alert });
};

exports.signin = (req, res) => {
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    const alert = errors.array();

    // res.render('login', {
    //     alert
    // })

    req.flash("alert", alert);
    res.redirect("/login");
  } else {
    // find the user based on email
    const { email, password } = req.body;

    // console.log(email,"   ",password);

    User.findOne({ email }, async (err, user) => {
      //console.log(user)
      if (err || !user) {
        req.flash(
          "login_errormsg",
          "User with this email is doesn't exist . please sign-in"
        );
        res.redirect("/login");
      } else {
        // console.log(user.password);
        const x = await user.authenticate(password);
        // console.log(x);

        if (x) {
          const token = jwt.sign({ _id: user._id }, process.env.JWT_SECRET);

          // persist the token as 't' in cookie with expiry date
          //console.log(token);
          res.cookie("jwt", token, {
            expire: new Date() + 9999,
            secure: true,
            httpOnly: true,
          });
          //return response with user and give to front end client
          //const {_id , name , email} = user
          //return res.json({token , user: {_id , email , name} })

          //res.render("index",{cookie : "generated"});

          //res.redirect('/?e=' + encodeURIComponent({cookie : "generated"}));
          res.redirect("/");
          //'/home?id=' + user._id
          //res.redirect("/");
        } else {
          req.flash("login_errormsg", "email and password are not matching");
          res.redirect("/login");
        }
      }
    });
  }
};

exports.registerpage = (req, res) => {
  const error = req.flash("register_errormsg");
  const alert = req.flash("alert");
  res.render("register", { error, alert });
};

exports.signup = async (req, res) => {
  // all the errors if raised in validation part will be binded into the req part
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    const alert = errors.array();

    req.flash("alert", alert);
    res.redirect("/register");
  } else {
    const password = req.body.password;
    const cpassword = req.body.confirmpassword;

    if (password === cpassword) {
      const userexists = await User.findOne({ email: req.body.email });

      if (userexists) {
        req.flash(
          "register_errormsg",
          "Email is already taken signup with different email"
        );
        res.redirect("/register");
      } else {
        const user = await new User(req.body);
        //console.log(user);
        await user.save();
        req.flash(
          "register_errormsg",
          "Account created successfully. Please Login."
        );
        res.redirect("/register");
      }
    } else {
      req.flash("register_errormsg", "Password doesn't match.");
      res.redirect("/register");
    }
  }
};

exports.forgot_password_page = (req, res) => {
  const alert = req.flash("alert");
  const changepw = req.flash("changepw");
  const successful = req.flash("successful");
  res.render("forgot_password", { alert, changepw, successful });
};

exports.forgot_password = (req, res) => {
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    const alert = errors.array();
    req.flash("alert", alert);
    res.redirect("/forgot_password");
  } else {
    const password = req.body.password;
    const cpassword = req.body.cpassword;
    const email = req.body.email;

    if (password === cpassword) {
      const salt = bcrypt.genSaltSync(12);
      const pw = bcrypt.hashSync(password, salt);

      User.findOneAndUpdate(
        { email: email },
        {
          $set: {
            password: pw,
            updated: new Date(),
          },
        },
        (err, doc) => {
          if (!err) {
            req.flash(
              "successful",
              "Successfully changed password. Please Login."
            );
            res.redirect("/forgot_password");
          } else {
            res.status(400).json({ err: "error during record update." });
          }
        }
      );
    } else {
      req.flash("changepw", "New Password and Confirm Password are not match");
      res.redirect("/forgot_password");
    }
  }
};
