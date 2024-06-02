const express = require("express");
const router = express.Router();

const multer = require("multer");

const { check } = require("express-validator");

const { admin_homepage } = require("../controller/admin_homecontroller");
const {
  admin_loginpage,
  admin_registerpage,
  admin_register,
  admin_login,
} = require("../controller/admin_authentication");
const {
  admin_logout,
  admin_profile,
  admin_changepw,
  admin_profile_page,
} = require("../controller/admin");

const { admin_profile_photo } = require("../controller/admin_profilephoto");

router.get("/", admin_homepage);
router.get("/admin_login", admin_loginpage);
router.get("/admin_register", admin_registerpage);

router.post(
  "/admin_register",
  [
    check("name", "username is required").notEmpty(),
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
  admin_register
);

router.post(
  "/admin_login",
  [
    check("email", "email is required").isEmail(),
    check("password", "password is required").notEmpty(),
  ],
  admin_login
);

router.get("/admin_logout", admin_logout);

//upload the photo
const storage = multer.diskStorage({
  destination: (req, file, callback) => {
    callback(
      null,
      "./admin/public/admin_src/assets/images/admin_profile_images"
    );
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

router.post(
  "/admin_profile_upload",
  upload.single("originalname"),
  admin_profile_photo
);
router.post("/admin_profile", admin_profile);
router.post("/admin_changepw", admin_changepw);

router.get("/admin_profile", admin_profile_page);

module.exports = router;
