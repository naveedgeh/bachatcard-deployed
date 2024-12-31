const ErrorResponse = require("../utils/errorResponse");
const Category = require("../models/Category");
const uploadImage = require("../helpers/helpers");

exports.getCategories = async (req, res, next) => {
  try {
    let categories = await Category.find();
    if (categories.length > 0) {
      return res.status(200).json({
        success: true,
        message: "Categories found",
        data: categories,
      });
    }
    return res.status(404).json({
      success: true,
      message: "No categories found",
      data: [],
    });
  } catch (err) {
    return next(new ErrorResponse(err.message, 500));
  }
};

exports.createCategory = async (req, res, next) => {
  try {
    const { name } = req.body;

    // Check if the category already exists
    const existingCategory = await Category.findOne({ name });
    if (existingCategory) {
      return res.status(400).json({
        success: false,
        message: "Category already exists",
      });
    }

    let categoryData = { name };

    // Save image if provided
    if (req.files && req.files.image) {
      const uploadedImage = await uploadImage.uploadImage(req.files.image, next);
      categoryData.image = uploadedImage.photoPath;
    }

    // Create a new category
    const category = await Category.create(categoryData);

    return res.status(201).json({
      success: true,
      message: "Category created successfully",
      data: category,
    });
  } catch (err) {
    console.log(err)
    return next(new ErrorResponse(err.message, 400));
  }
};

exports.deleteCategory = async (req, res, next) => {
  try {
    const deletedCategory = await Category.deleteMany({ _id: { $in: req.body.ids } });
    if (!deletedCategory) {
      return res.status(400).json({ success: false, message: "Category Delete Failed!" });
    }
    const categories = await Category.find({});
    if (categories.length > 0) {
      return res.status(200).json({
        success: true,
        message: "Categories Deleted Successfully!",
        data: categories,
      });
    }
    return res.status(404).json({ success: true, message: "No categories found", data: [] });
  } catch (err) {
    return next(new ErrorResponse(err.message, 500));
  }
};