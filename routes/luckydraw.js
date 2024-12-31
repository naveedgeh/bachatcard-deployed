const express = require("express");
const router = express.Router();
const {
  getLuckyDraws,
  createLuckyDraw,
  deleteLuckyDraw
} = require("../controllers/luckydraw.controllers");

router.get("/", getLuckyDraws);
router.post("/", createLuckyDraw);
router.delete("/", deleteLuckyDraw);

module.exports = router;
