const express = require("express");
const bodyParser = require("body-parser");
const router = express.Router();
router.use(bodyParser.json());

const jwt = require("jsonwebtoken");
require("dotenv").config();

const user = require("../models/user");

const { homepage } = require("../controller/homecontroller");
const {
  loginpage,
  registerpage,
  signin,
  signup,
  forgot_password_page,
  forgot_password,
} = require("../controller/authentication");
const {
  userdashboard,
  account_setting,
  logout,
  updateuserinfo,
  change_pw,
} = require("../controller/user");
const { category } = require("../controller/category");
const {
  order_details_page,
  order_history_page,
  order,
} = require("../controller/order");
const { shopping_cart_page, updatecart } = require("../controller/cart");
const { product } = require("../controller/product");
const { checkout } = require("../controller/checkout");
const { contact } = require("../controller/contact");
const { blog1, blog2, blog3 } = require("../controller/blog");

const { guest } = require("../middleware/guest");
const { check } = require("express-validator");

const multer = require("multer");

router.get("/", homepage);
router.get("/login", guest, loginpage);

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

router.get("/register", guest, registerpage);
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
  signin
);

router.get("/user_dashboard", userdashboard);
router.get("/logout", logout);
router.get("/account_setting", account_setting);
router.post("/account_setting", updateuserinfo);

const storage = multer.diskStorage({
  destination: (req, file, callback) => {
    callback(null, "./user/public/src/images/profile_images");
  },
  filename: (req, file, callback) => {
    callback(null, file.originalname);
  },
});

const upload = multer({
  storage: storage,
  fileFilter(req, file, cb) {
    if (!file.originalname.match(/\.(png|jpg|jpeg)$/)) {
      // upload only png and jpg format
      return cb(new Error("Please upload a jpg | png | jpeg Image file "));
    }
    cb(undefined, true);
  },
});

router.post("/profile_upload", upload.single("originalname"), (req, res) => {
  const token = req.cookies.jwt;
  const decoded = jwt.verify(token, process.env.JWT_SECRET);
  const userId = decoded._id;
  //console.log("userid cookiee : "+userId);

  if (JSON.stringify(req.file) == undefined) {
    req.flash("uploaderrormsg", "Please upload the Photo");
    res.redirect("/account_setting");
  }

  user.findOneAndUpdate(
    { _id: userId },
    {
      $set: {
        photo: req.file.originalname,

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
});

router.post("/change_password", change_pw);

//order
router.get("/order_history", order_history_page);
router.get("/shopping_cart", shopping_cart_page);
router.post("/updatecart", updatecart);
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
