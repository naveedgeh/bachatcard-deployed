const express = require("express");
const router = express.Router();
const {
  getDiscounts,
  createDiscount,
  deteteDiscount,
  scanDiscount
} = require("../controllers/discount.controllers");

router.get("/", getDiscounts);
router.post("/", createDiscount);
router.delete("/", deteteDiscount);
router.post("/scan", scanDiscount);

module.exports = router;
