const express = require("express");
const { calculateCommission } = require("../controllers/commission.controller");

const router = express.Router();
router.post("/create", calculateCommission);

module.exports = router;
