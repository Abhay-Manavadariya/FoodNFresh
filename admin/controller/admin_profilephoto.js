const jwt = require("jsonwebtoken");
require("dotenv").config();
const Admin = require("../models/admin");

exports.admin_profile_photo = (req, res) => {
  const token = req.cookies.admin_cookie;
  const decoded = jwt.verify(token, process.env.JWT_SECRET);
  const adminId = decoded._id;
  //console.log("userid cookiee : "+userId);

  if (JSON.stringify(req.file) == undefined) {
    req.flash("uploaderrormsg", "Please upload the Photo");
    res.redirect("/admin/admin_profile");
  } else {
    Admin.findOneAndUpdate(
      { _id: adminId },
      {
        $set: {
          photo: req.file.originalname,

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
