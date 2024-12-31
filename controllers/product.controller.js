const LevelPercentage = require("../models/LevelPercentage");
const Product = require("../models/Product");

exports.createProduct = async (req, res) => {
  try {
    console.log(req.body);
    const { name, price, paymentNumber1, paymentNumber2 } = req.body;
    // Check if product already exists
    const listProduct = await Product.find({});
    if (listProduct.length > 0) {
      // res.json({ message: "Product Already Added", success: false });
      // return;
      let existingProduct = await Product.findOne({ name });
      existingProduct.price = price;
      existingProduct.paymentNumber1 = paymentNumber1;
      existingProduct.paymentNumber2 = paymentNumber2;
      await existingProduct.save();
      return res.json({ existingProduct, success: true });
    }
    const existingProduct = await Product.findOne({ name });
    if (existingProduct) {
      // If product exists, update its price
      existingProduct.price = price;
      existingProduct.paymentNumber1 = paymentNumber1;
      existingProduct.paymentNumber2 = paymentNumber2;
      await existingProduct.save();
      res.json({ existingProduct, success: true });
    } else {
      // If product doesn't exist, create a new one
      const product = await Product.create({
        name: name,
        price: price,
        paymentNumber1: paymentNumber1,
        paymentNumber2: paymentNumber2,
      });
      res.json({ product, success: true });
    }
  } catch (error) {
    console.log(error)
    res.status(500).json({ error: error.message });
  }
};
exports.deleteProduct = async (req, res) => {
  try {
    // await Product.deleteMany({});
    await LevelPercentage.deleteMany({});
    res.status(200).json({ messagee: "SuccesFully delete" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
exports.getProduct = async (req, res) => {
  try {
    const products = await Product.find();
    res.json(products[0]);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
exports.getProductById = async (req, res) => {
  try {
    const productId = req.params.id;
    const product = await Product.findById(productId);
    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }
    res.json(product);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
exports.updateProductbyId = async (req, res) => {
  try {
    const productId = req.params.id;
    const { price } = req.body;
    const product = await Product.findByIdAndUpdate(
      productId,
      { price },
      { new: true }
    );
    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }
    res.json(product);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.deleteProductById = async (req, res) => {
  try {
    const productId = req.params.id;
    const product = await Product.findByIdAndDelete(productId);
    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }
    res.json({ message: "Product deleted successfully" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
exports.updateLevelPercentage = async (req, res) => {
  let levelInputs = JSON.parse(req.body.levelInputs);
  const existlevelPert = await LevelPercentage.countDocuments();

  const newLevelData = levelInputs.map((element, index) => {
    const values = Object.values(element); // Extract the values from the object
    return {
      level: `${values[0]}`,
      percentagePrice: `${values[1]}`,
    };
  });
  if (existlevelPert >= 5) {
    for (const { level, percentagePrice } of newLevelData) {
      const filter = { level }; // Filter by the 'level' field
      const update = { $set: { level, percentagePrice } }; // Update only the 'percentagePrice' field

      const result = await LevelPercentage.updateOne(filter, update);
      console.log(
        `Matched ${result.matchedCount} and modified ${result.modifiedCount} documents for level ${level}`
      );
    }

    return res
      .status(200)
      .json({ message: "Successfully updated level prices", success: true });
  }

  await LevelPercentage.insertMany(newLevelData);
  return res
    .status(201)
    .json({ message: "New Level is Created", success: true });
};
exports.getLevelPercentage = async (req, res) => {
  try {
    const result = await LevelPercentage.find({});
    return res.status(200).json({ result, message: "sucess" });
  } catch (error) {
    console.error(error);
  }
};
