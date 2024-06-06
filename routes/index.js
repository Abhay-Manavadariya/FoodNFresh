const express = require("express");
const router = express.Router();

router.use("/", require("../user/route/router"));
router.use("/admin", require("../admin/route/admin_router"));
router.use("/admin", require("../admin/route/admin_router_auth"));

module.exports = router;
