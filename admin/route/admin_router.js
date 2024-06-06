const express = require("express");
const router = express.Router();
const multer = require("multer");

//upload the photo
const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

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

router.post(
  "/add_product_category",
  upload.single("image"),
  add_product_category
);
router.get(
  "/admin_all_category/:category_id/:status",
  admin_category_status_change
);
router.get("/admin_all_category", admin_all_category_page);

router.get("/admin_add_new_product", admin_add_new_product_page);

router.post("/admin_add_product", upload.single("image"), admin_add_product);

router.get("/admin_all_product", admin_all_product_page);
router.get(
  "/admin_all_product/:product_id/:status",
  admin_all_product_status_change
);

module.exports = router;
