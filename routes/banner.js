const express = require("express");
const router = express.Router();
const {
  getBanner,
  changeBanner
} = require("../controllers/banner.controllers");

router.get("/", getBanner);
router.post("/", changeBanner);

module.exports = router;
