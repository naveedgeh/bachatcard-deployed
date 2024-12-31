const express = require("express");
const router = express.Router();
const {
  getCategories,
  createCategory,
  deleteCategory
} = require("../controllers/category.controllers");

router.get("/", getCategories);
router.post("/", createCategory);
router.delete("/", deleteCategory);

module.exports = router;
