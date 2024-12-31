const express = require("express");
const router = express.Router();
const {
  getQuizes,
} = require("../controllers/quizes.controllers");

router.get("/", getQuizes);

module.exports = router;
