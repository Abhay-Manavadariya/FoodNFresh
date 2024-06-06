const User = require("../models/user");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
require("dotenv").config();

let State = require("country-state-city").State;
const state = State.getStatesOfCountry("IN");

exports.userDashboard = (req, res) => {
  const token = req.cookies.jwt;

  //console.log(req.params);

  if (!token) {
    res.redirect("/login");
  } else {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    const userId = decoded._id;

    User.findById(userId).exec((err, user) => {
      if (err || !user) {
        return res.status(400).json({
          error: "user not found",
        });
      }

      res.render("user_dashboard", { user: user, cookie: "generated" });
    });
  }
};

exports.account_setting = (req, res) => {
  const token = req.cookies.jwt;
  // console.log(token);

  const uploadpic = req.flash("uploaderrormsg");

  const changepw1 = req.flash("changepw1");

  if (!token) {
    res.redirect("/login");
  } else {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const userId = decoded._id;
    //console.log("userid : "+userId);

    User.findById(userId).exec((err, user) => {
      if (err || !user) {
        return res.status(400).json({
          error: "user not found",
        });
      }
      //console.log(user);
      res.render("account_setting", {
        user,
        cookie: "generated",
        state,
        uploadpic,
        changepw1,
      });
    });
  }
};

exports.logout = (req, res) => {
  res.clearCookie("jwt");
  res.redirect("/");
};

exports.updateUserinfo = (req, res) => {
  updateRecord(req, res);
};

function updateRecord(req, res) {
  const token = req.cookies.jwt;

  if (!token) {
    res.redirect("/login");
  }

  const decoded = jwt.verify(token, process.env.JWT_SECRET);
  const userId = decoded._id;

  User.findOneAndUpdate(
    { _id: userId },
    {
      $set: {
        name: req.body.name,

        email: req.body.email,

        address: req.body.address,

        city: req.body.city,

        state: req.body.state,

        zipCode: req.body.zipCode,

        contact: req.body.contact,

        dob: req.body.dob,

        updated: new Date(),
      },
    },
    (err, doc) => {
      if (!err) {
        res.redirect("/user_dashboard");
      } else {
        console.log("Error during record update : " + err);
      }
    }
  );
}

exports.change_pw = (req, res) => {
  const token = req.cookies.jwt;

  const decoded = jwt.verify(token, process.env.JWT_SECRET);
  const userId = decoded._id;

  const new_pw = req.body.new_pw;
  const confirm_pw = req.body.confirm_pw;
  const current_pw = req.body.current_pw;

  if (new_pw === confirm_pw) {
    //res.send("matched")
    User.findOne({ _id: userId }, function (err, user) {
      if (err) throw err;

      user.comparePassword(current_pw, function (err, isMatch) {
        if (err) throw err;
        //console.log('Password123:', isMatch); // -> Password123: true

        //console.log(`the current password is  : ${new_pw}`);
        const salt = bcrypt.genSaltSync(12);
        const pw = bcrypt.hashSync(new_pw, salt);
        //console.log(`the current password is  : ${pw}`);

        if (isMatch) {
          User.findOneAndUpdate(
            { _id: userId },
            {
              $set: {
                password: pw,
                updated: new Date(),
              },
            },
            (err, doc) => {
              if (!err) {
                res.redirect("/user_dashboard");
              } else {
                res.status(400).json({ err: "error during record update." });
                //console.log('Error during record update : ' + err);
              }
            }
          );
        } else {
          req.flash(
            "changepw1",
            "Original password is not matched with Database."
          );
          res.redirect("/account_setting");
        }
      });

      // // test a failing password
      // user.comparePassword('123Password', function(err, isMatch) {
      //     if (err) throw err;
      //     console.log('123Password:', isMatch); // -> 123Password: false
      // });
    });
  } else {
    req.flash("changepw1", "New Password and Confirm Password are not match");
    res.redirect("/account_setting");
  }
};
