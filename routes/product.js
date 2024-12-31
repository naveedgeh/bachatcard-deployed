const express = require("express");
const router = express.Router();
const {
  createProduct,
  getProduct,
  getProductById,
  updateProductbyId,
  deleteProductById,
  deleteProduct,
  testing,
  updateLevelPercentage,
  getLevelPercentage,
} = require("../controllers/product.controller");
router.post("/create", createProduct);
router.get("/products", getProduct);
router.get("/products/:id", getProductById);
router.put("/products/:id", updateProductbyId);
router.delete("/products/:id", deleteProduct);
router.delete("/dl", deleteProduct);
// Level Percentage Price update and get
router.post("/level-create", updateLevelPercentage);
router.get("/level", getLevelPercentage);
module.exports = router;
