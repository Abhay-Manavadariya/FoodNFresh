const Admin = require("../models/admin");
const Category = require("../models/category");
const jwt = require("jsonwebtoken");
require("dotenv").config();

// const path = require('path');
// const sharp = require('sharp');
// const fs = require('fs');

exports.admin_add_product_category_page = async (req, res) => {
  const cookie = req.cookies.admin_cookie;
  const uploaderrormsg = req.flash("uploaderrormsg");
  const success = req.flash("success_msg");

  if (!cookie) {
    return res.redirect("/admin/admin_login");
  }

  try {
    const decoded = jwt.verify(cookie, process.env.JWT_SECRET);
    const adminId = decoded._id;

    const admin = await Admin.findById(adminId).exec();
    if (!admin) {
      return res.status(400).json({ error: "Admin not found" });
    }

    res.render("admin_add_product_category", {
      admin,
      uploaderrormsg,
      success,
    });
  } catch (err) {
    console.error("Error while fetching admin data:", err);
    res.status(500).json({ error: "Internal server error" });
  }
};

exports.admin_all_category_page = async (req, res) => {
  const cookie = req.cookies.admin_cookie;
  if (!cookie) {
    return res.redirect("/admin/admin_login");
  }

  try {
    const decoded = jwt.verify(cookie, process.env.JWT_SECRET);
    const adminId = decoded._id;

    const admin = await Admin.findById(adminId).exec();
    if (!admin) {
      return res.status(400).json({ error: "Admin not found" });
    }

    const categories = await Category.find({}).exec();
    res.render("admin_all_category", { admin, data: categories });
  } catch (err) {
    console.error("Error fetching admin or categories:", err);
    res.status(500).json({ error: "Internal server error" });
  }
};

exports.add_product_category = async (req, res) => {
  try {
    const category = new Category({
      name: req.body.category_name,
      category_fileName: req.file.originalname,
      category_photo: {
        data: req.file.buffer,
        contentType: req.file.mimetype,
      },
    });

    await category.save();

    req.flash("success_msg", "Successfully added Category.");
    res.redirect("/admin/admin_add_product_category");
  } catch (err) {
    console.error("Error while adding product category:", err);
    req.flash("uploaderrormsg", "Error while adding the product category");
    res.redirect("/admin/admin_add_product_category");
  }
};

exports.admin_category_status_change = async (req, res) => {
  try {
    const { category_id, status } = req.params;
    const newStatus = status == 1 ? "inactive" : "active";

    await Category.findOneAndUpdate(
      { _id: category_id },
      { $set: { status: newStatus } }
    ).exec();

    res.redirect("/admin/admin_all_category");
  } catch (err) {
    console.error("Error during record update:", err);
    res.redirect("/admin/admin_all_category");
  }
};
