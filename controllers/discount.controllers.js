const ErrorResponse = require("../utils/errorResponse");
const Discount = require("../models/Discount");
const uploadImage = require("../helpers/helpers");

exports.getDiscounts = async (req, res, next) => {
  try {
    let discounts = await Discount.find().populate("brand");
    if (discounts.length > 0) {
      return res.status(200).json({
        success: true,
        message: "Discounts found",
        data: discounts,
      });
    }
    return res.status(404).json({
      success: true,
      message: "No discounts found",
      data: [],
    });
  } catch (err) {
    return next(new ErrorResponse(err.message, 500));
  }
};

exports.createDiscount = async (req, res, next) => {
  console.log(req.body);
  try {
    const { category, brand, percentage, price, title, description, address, deal, endDate, endTime } =
      req.body;

    // Check if the discount already exists
    // You may need to adjust this condition based on your schema
    const existingDiscount = await Discount.findOne({ title });
    if (existingDiscount) {
      return res.status(400).json({
        success: false,
        message: "Discount already exists",
      });
    }

    let discountData = {
      category,
      brand,
      percentage,
      price,
      title,
      description,
      address,
      deal,
      endDate,
      endTime,
    };

    // Save image if provided
    if (req.files && req.files.image) {
      const uploadedImage = await uploadImage.uploadImage(
        req.files.image,
        next
      );
      discountData.image = uploadedImage.photoPath;
    }

    // Create a new discount
    const discount = await Discount.create(discountData);

    return res.status(201).json({
      success: true,
      message: "Discount created successfully",
      data: discount,
    });
  } catch (err) {
    return next(new ErrorResponse(err.message, 400));
  }
};

exports.deteteDiscount = async (req, res, next) => {
  try {
    const deletedDiscounts = await Discount.deleteMany({
      _id: { $in: req.body.ids },
    });
    if (!deletedDiscounts) {
      return res
        .status(400)
        .json({ success: false, message: "Discounts Delete Failed!" });
    }
    const discounts = await Discount.find({});
    if (discounts.length > 0) {
      return res.status(200).json({
        success: true,
        message: "Discounts Deleted Successfully!",
        data: discounts,
      });
    }
    return res
      .status(404)
      .json({ success: true, message: "No discounts found", data: [] });
  } catch (err) {
    return next(new ErrorResponse(err.message, 500));
  }
};

exports.scanDiscount = async (req, res, next) => {
  try {
    const scanedDiscount = await Discount.findOne({ _id: req.body.id });
    if (!scanedDiscount) {
      return res
        .status(400)
        .json({ success: false, message: "Discount Scanned Failed!" });
    }
    scanedDiscount.history.push({ userId: req.body.userId, username: req.body.username, price: req.body.price, createdAt: Date.now() });
    scanedDiscount.save();
    return res.status(200).json({
      success: true,
      message: "Discount Availed Successfully!",
      data: scanedDiscount,
    });
  } catch (err) {
    return next(new ErrorResponse(err.message, 500));
  }
};
