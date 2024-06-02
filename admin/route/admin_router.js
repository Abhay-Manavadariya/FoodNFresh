const express = require("express");
//const bodyParser = require("body-parser");
const router = express.Router();
//router.use(bodyParser.json());
const multer = require("multer");

const {
  admin_grocery_details,
  admin_grocery_details_page,
} = require("../controller/admin_grocery_details");
const {
  admin_customer_list_page,
} = require("../controller/admin_customer_list");
const {
  admin_pending_order_list_page,
  admin_processing_order_list_page,
  admin_shipped_order_list_page,
  admin_completed_order_list_page,
  admin_reject_order_list_page,
  admin_order_details_page,
} = require("../controller/admin_order_list");

const {
  admin_add_product_category_page,
  add_product_category,
  admin_all_category_page,
  admin_category_status_change,
} = require("../controller/admin_category");
const {
  admin_add_new_product_page,
  admin_add_product,
  admin_all_product_page,
  admin_all_product_status_change,
} = require("../controller/admin_product");

router.get("/admin_customer", admin_customer_list_page);

router.get("/admin_pending_order_list", admin_pending_order_list_page);
router.get("/admin_processing_order_list?*", admin_processing_order_list_page);
router.get("/admin_shipped_order_list", admin_shipped_order_list_page);
router.get("/admin_completed_order_list", admin_completed_order_list_page);
router.get("/admin_reject_order_list", admin_reject_order_list_page);
router.get("/admin_order_details?*", admin_order_details_page);

router.get("/admin_grocery_store_details", admin_grocery_details_page);
router.post("/admin_grocery_details", admin_grocery_details);

router.get("/admin_add_product_category", admin_add_product_category_page);

//upload the photo
const storage = multer.diskStorage({
  destination: "./admin/public/admin_src/assets/images/category",
  filename: (req, file, callback) => {
    callback(null, file.originalname);
  },
});

// const limits = {
//     fields: 10,
//     fileSize: 100 * 75,
//     files: 1,
//   };

const upload = multer({
  storage: storage,
  fileFilter(req, file, cb) {
    if (!file.originalname.match(/\.(png|jpg|jpeg)$/)) {
      // upload only png and jpg format
      return cb(new Error("Please upload a jpg | png | jpeg Image file "));
    }
    cb(undefined, true);
  },
}).single("file");

router.post("/add_product_category", upload, add_product_category);
router.get(
  "/admin_all_category/:category_id/:status",
  admin_category_status_change
);
router.get("/admin_all_category", admin_all_category_page);

router.get("/admin_add_new_product", admin_add_new_product_page);

const storage1 = multer.diskStorage({
  destination: "./admin/public/admin_src/assets/images/product",
  filename: (req, file, callback) => {
    callback(null, file.originalname);
  },
});

const upload1 = multer({
  storage: storage1,
  fileFilter(req, file, cb) {
    if (!file.originalname.match(/\.(png|jpg|jpeg)$/)) {
      // upload only png and jpg format
      return cb(new Error("Please upload a jpg | png | jpeg Image file "));
    }
    cb(undefined, true);
  },
}).single("file");

router.post("/admin_add_product", upload1, admin_add_product);

router.get("/admin_all_product", admin_all_product_page);
router.get(
  "/admin_all_product/:product_id/:status",
  admin_all_product_status_change
);

module.exports = router;
