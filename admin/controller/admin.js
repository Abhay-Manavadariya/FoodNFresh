const Admin = require("../models/admin");
const jwt = require("jsonwebtoken");
require("dotenv").config();
const bcrypt = require("bcryptjs");

exports.admin_logout = (req, res) => {
  res.clearCookie("admin_cookie");
  res.redirect("/admin/admin_login");
};

exports.admin_profile_page = (req, res) => {
  const cookie = req.cookies.admin_cookie;

  if (cookie) {
    const changepw1 = req.flash("changepw1");

    const decoded = jwt.verify(cookie, process.env.JWT_SECRET);
    const adminId = decoded._id;

    Admin.findById(adminId).exec((err, admin) => {
      if (err || !admin) {
        return res.status(400).json({
          error: "admin not found",
        });
      }

      res.render("admin_profile", { admin, changepw1 });
    });
  } else {
    res.redirect("/admin/admin_login");
  }
};

exports.admin_profile = (req, res) => {
  updateRecord(req, res);
};

function updateRecord(req, res) {
  const token = req.cookies.admin_cookie;

  if (!token) {
    res.redirect("/admin/admin_login");
  } else {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const adminid = decoded._id;
    //console.log("userid : "+userId);

    //console.log(Date);
    //console.log(req.body.dob);
    Admin.findOneAndUpdate(
      { _id: adminid },
      {
        $set: {
          name: req.body.name,

          email: req.body.email,

          address: req.body.address,

          city: req.body.city,

          state: req.body.state,

          contact: req.body.contact,

          dob: req.body.dob,

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
}

exports.admin_changepw = (req, res) => {
  const token = req.cookies.admin_cookie;

  const decoded = jwt.verify(token, process.env.JWT_SECRET);
  const adminId = decoded._id;

  const new_pw = req.body.new_pw;
  const confirm_pw = req.body.confirm_pw;
  const current_pw = req.body.current_pw;

  if (new_pw === confirm_pw) {
    Admin.findOne({ _id: adminId }, function (err, admin) {
      if (err) throw err;

      admin.comparePassword(current_pw, function (err, isMatch) {
        if (err) throw err;

        const salt = bcrypt.genSaltSync(12);
        const pw = bcrypt.hashSync(new_pw, salt);

        if (isMatch) {
          Admin.findOneAndUpdate(
            { _id: adminId },
            {
              $set: {
                password: pw,
                updated: new Date(),
              },
            },
            (err, doc) => {
              if (!err) {
                res.redirect("/admin/");
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
          res.redirect("/admin/admin_profile");
        }
      });
    });
  } else {
    req.flash("changepw1", "New Password and Confirm Password are not match");
    res.redirect("/admin/admin_profile");
  }
};
