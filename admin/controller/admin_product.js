const Admin = require("../models/admin");
const Category = require("../models/category");
const Product = require("../models/product");
const jwt = require("jsonwebtoken");
require("dotenv").config();

exports.admin_add_new_product_page = (req, res) => {
  const cookie = req.cookies.admin_cookie;

  const uploaderrormsg = req.flash("uploaderrormsg");

  const success = req.flash("success_msg");

  if (cookie) {
    // getpage(req,res,"admin_add_new_product",cookie)
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
            res.render("admin_add_new_product", {
              admin,
              data,
              uploaderrormsg,
              success,
            });
          }
        });
      }
    });
  } else {
    res.redirect("/admin/admin_login");
  }
};

exports.admin_add_product = async (req, res) => {
  var image = req.file.filename;

  if (image == undefined) {
    req.flash("uploaderrormsg", "Error while uploading the photo");
    res.redirect("/admin/admin_add_product_category");
  } else {
    const product = new Product({
      name: req.body.product_name,
      category: req.body.category,
      MRP: req.body.product_MRP,
      product_photo: image,
    });

    await product.save();
    req.flash("success_msg", "Successfully add Product.");

    res.redirect("/admin/admin_add_new_product");
  }
};

exports.admin_all_product_page = (req, res) => {
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
        Product.find({}, function (err, data) {
          if (err) {
            console.log(err);
          } else {
            res.render("admin_all_product", { admin, data });
          }
        });
      }
    });
  } else {
    res.redirect("/admin/admin_login");
  }
};

exports.admin_all_product_status_change = (req, res) => {
  var { product_id, status } = req.params;

  if (status == 1) {
    status = "inactive";
  } else {
    status = "active";
  }

  Product.findOneAndUpdate(
    { _id: product_id },

    {
      $set: {
        status: status,
      },
    },
    (err, doc) => {
      if (!err) {
        //console.log("done!!");
        res.redirect("/admin/admin_all_product");
      } else {
        console.log("Error during record update : " + err);
        res.redirect("/admin/admin_all_product");
      }
    }
  );
};
