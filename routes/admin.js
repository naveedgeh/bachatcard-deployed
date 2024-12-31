const express = require("express");
const router = express.Router();
const {
  adminSignup,
  adminLogin,
  getDashboard,
  AdPriceUpdate,
  AdPrice,
  CoinPriceUpdate,
  CoinPrice,
  adminFee,
  adminFeeUpdate
} = require("../controllers/admin.controllers");
const checkAuth = require("../middleware/check-auth");

router.post("/signup", adminSignup);
router.post("/login", adminLogin);
router.post("/ad", AdPriceUpdate);
router.get("/ad", AdPrice);
router.get("/coin", CoinPrice);
router.post("/coin", CoinPriceUpdate);
router.get("/fee", adminFee);
router.post("/fee", adminFeeUpdate);
router.get("/", getDashboard);

module.exports = router;
