const Admin = require("../models/admin");
const Category = require("../models/category");
const jwt = require("jsonwebtoken");
require("dotenv").config();

// const path = require('path');
// const sharp = require('sharp');
// const fs = require('fs');

exports.admin_add_product_category_page = (req, res) => {
  const cookie = req.cookies.admin_cookie;

  const uploaderrormsg = req.flash("uploaderrormsg");

  const success = req.flash("success_msg");

  if (cookie) {
    const decoded = jwt.verify(cookie, process.env.JWT_SECRET);
    const adminId = decoded._id;

    Admin.findById(adminId).exec((err, admin) => {
      if (err || !admin) {
        return res.status(400).json({
          error: "admin not found",
        });
      } else {
        res.render("admin_add_product_category", {
          admin,
          uploaderrormsg,
          success,
        });
      }
    });
  } else {
    res.redirect("/admin/admin_login");
  }
};

exports.admin_all_category_page = (req, res) => {
  const cookie = req.cookies.admin_cookie;
  if (cookie) {
    const decoded = jwt.verify(cookie, process.env.JWT_SECRET);
    const adminId = decoded._id;

    Admin.findById(adminId).exec((err, admin) => {
      if (err || !admin) {
        return res.status(400).json({
          error: "admin not found",
        });
      } else {
        Category.find({}, function (err, data) {
          if (err) {
            console.log(err);
          } else {
            res.render("admin_all_category", { admin, data });
          }
        });
      }
    });
  } else {
    res.redirect("/admin/admin_login");
  }
};

exports.add_product_category = async (req, res) => {
  var image = req.file.filename;

  if (image == undefined) {
    req.flash("uploaderrormsg", "Error while uploading the photo");
    res.redirect("/admin/admin_add_product_category");
  } else {
    // console.log(req.file.path);
    // console.log(req.file.destination);

    // await sharp(req.file.path)
    // .resize(200, 200)
    // .jpeg({ quality: 90 })
    // .toFile(
    //     path.resolve(req.file.destination,image,image)
    // ).then (data => {
    //     console.log("succ",data)
    // })

    const category = new Category({
      name: req.body.category_name,
      category_photo: image,
    });

    await category.save();
    req.flash("success_msg", "Successfully add Category.");

    res.redirect("/admin/admin_add_product_category");
  }
};

exports.admin_category_status_change = (req, res) => {
  var { category_id, status } = req.params;

  if (status == 1) {
    status = "inactive";
  } else {
    status = "active";
  }

  Category.findOneAndUpdate(
    { _id: category_id },

    {
      $set: {
        status: status,
      },
    },
    (err, doc) => {
      if (!err) {
        //console.log("done!!");
        res.redirect("/admin/admin_all_category");
      } else {
        console.log("Error during record update : " + err);
        res.redirect("/admin/admin_all_category");
      }
    }
  );
};
