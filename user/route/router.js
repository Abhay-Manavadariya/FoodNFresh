const express = require("express");
const router = express.Router();
const { check } = require("express-validator");
const multer = require("multer");
const jwt = require("jsonwebtoken");
const { guest } = require("../middleware/guest");
require("dotenv").config();

const user = require("../models/user");
const { homePage } = require("../controller/homeController");
const {
  login,
  register,
  signIn,
  signup,
  forgot_password_page,
  forgot_password,
} = require("../controller/authentication");
const {
  userDashboard,
  account_setting,
  logout,
  updateUserinfo,
  change_pw,
} = require("../controller/user");
const { category } = require("../controller/category");
const {
  order_details_page,
  order_history_page,
  order,
} = require("../controller/order");
const { shopping_cart_page, updateCart } = require("../controller/cart");
const { product } = require("../controller/product");
const { checkout } = require("../controller/checkout");
const { contact } = require("../controller/contact");
const { blog1, blog2, blog3 } = require("../controller/blog");

const profileController = require("../controller/profileController"); // Ensure the correct path

router.get("/", homePage);

router.get("/login", guest, login);
router.get("/forgot_password", forgot_password_page);
router.post(
  "/forgot_password",
  [
    check("username", "username is required").isEmpty(),
    check("email", "email must between 2 to 20 letter")
      .matches(/.+\@.+\..+/)
      .withMessage("Email must contain @")
      .isLength({ min: 4, max: 2000 }),
    check("password", "password is required").notEmpty(),
    check("password")
      .isLength({ min: 6 })
      .withMessage("Password must contain at least 6 characters")
      .matches(/\d/)
      .withMessage("password must contain a number"),
  ],
  forgot_password
);
router.get("/register", guest, register);
router.post(
  "/register",
  [
    check("username", "username is required").isEmpty(),
    check("email", "email is required").isEmail(),
    check("email", "email must between 2 to 20 letter")
      .matches(/.+\@.+\..+/)
      .withMessage("Email must contain @")
      .isLength({ min: 4, max: 2000 }),
    check("password", "password is required").notEmpty(),
    check("password")
      .isLength({ min: 6 })
      .withMessage("Password must contain at least 6 characters")
      .matches(/\d/)
      .withMessage("password must contain a number"),
  ],
  signup
);
router.post(
  "/login",
  [
    check("email", "email is required").isEmail(),
    check("password", "password is required").notEmpty(),
  ],
  signIn
);

router.get("/user_dashboard", userDashboard);
router.get("/logout", logout);
router.get("/account_setting", account_setting);
router.post("/account_setting", updateUserinfo);

const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

router.post(
  "/profile_upload",
  upload.single("image"),
  profileController.uploadProfileImage
);

router.post("/change_password", change_pw);

//order
router.get("/order_history", order_history_page);
router.get("/shopping_cart", shopping_cart_page);
router.post("/updatecart", updateCart);
router.get("/order_details", order_details_page);
router.post("/order", order);

//cateogry
router.get("/category", category);

//product
router.get("/product?*", product);

router.get("/checkout", checkout);

//contact
router.get("/contact", contact);

//blog
router.get("/blog1", blog1);
router.get("/blog2", blog2);
router.get("/blog3", blog3);

module.exports = router;
