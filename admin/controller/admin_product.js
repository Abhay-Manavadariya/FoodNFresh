const Admin = require("../models/admin");
const Category = require("../models/category");
const Product = require("../models/product");
const jwt = require("jsonwebtoken");
require("dotenv").config();

exports.admin_add_new_product_page = async (req, res) => {
  try {
    const cookie = req.cookies.admin_cookie;

    if (!cookie) {
      return res.redirect("/admin/admin_login");
    }

    const decoded = jwt.verify(cookie, process.env.JWT_SECRET);
    const adminId = decoded._id;

    const admin = await Admin.findById(adminId).exec();
    if (!admin) {
      return res.status(400).json({ error: "admin not found" });
    }

    const categories = await Category.find({}).exec();
    const uploaderrormsg = req.flash("uploaderrormsg");
    const success = req.flash("success_msg");

    res.render("admin_add_new_product", {
      admin,
      data: categories,
      uploaderrormsg,
      success,
    });
  } catch (err) {
    console.error("Error during page load:", err);
    res.status(500).send("Internal Server Error");
  }
};

exports.admin_add_product = async (req, res) => {
  try {
    const product = new Product({
      name: req.body.product_name,
      category: req.body.category,
      MRP: req.body.product_MRP,
      product_fileName: req.file.originalname,
      product_photo: {
        data: req.file.buffer,
        contentType: req.file.mimetype,
      },
    });

    await product.save();
    req.flash("success_msg", "Successfully add Product.");

    res.redirect("/admin/admin_add_new_product");
  } catch (error) {
    console.error("Error while adding product:", err);
    req.flash("uploaderrormsg", "Error while adding the product");
    res.redirect("/admin/admin_add_product_category");
  }
};

exports.admin_all_product_page = async (req, res) => {
  try {
    const cookie = req.cookies.admin_cookie;

    if (!cookie) {
      return res.redirect("/admin/admin_login");
    }

    const decoded = jwt.verify(cookie, process.env.JWT_SECRET);
    const adminId = decoded._id;

    const admin = await Admin.findById(adminId).exec();
    if (!admin) {
      return res.status(400).json({ error: "admin not found" });
    }

    const products = await Product.find({}).exec();

    res.render("admin_all_product", {
      admin,
      data: products,
    });
  } catch (err) {
    console.error("Error during page load:", err);
    res.status(500).send("Internal Server Error");
  }
};

exports.admin_all_product_status_change = async (req, res) => {
  try {
    const { product_id, status } = req.params;

    const updatedStatus = status === "1" ? "inactive" : "active";

    const updatedProduct = await Product.findOneAndUpdate(
      { _id: product_id },
      { $set: { status: updatedStatus } }
    );

    if (!updatedProduct) {
      console.log("Product not found or update failed");
    }

    res.redirect("/admin/admin_all_product");
  } catch (error) {
    console.error("Error during record update:", error);
    res.redirect("/admin/admin_all_product");
  }
};
