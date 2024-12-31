const ErrorResponse = require("../utils/errorResponse");
const Admin = require("../models/Admin");
const Category = require("../models/Category");
const User = require("../models/User");
const Discount = require("../models/Discount");
const LuckyDraw = require("../models/LuckyDraw");
// const Products = require('../models/Product');
const bcryptjs = require("bcryptjs");
const jsonwebtoken = require("jsonwebtoken");

exports.adminSignup = async (req, res, next) => {
  try {
    const salt = bcryptjs.genSaltSync(10);
    const hash = bcryptjs.hashSync(req.body.password, salt);

    let admin = new Admin({
      username: req.body.username,
      email: req.body.email,
      password: hash,
    });
    const token = jsonwebtoken.sign(
      {
        data: [admin.email, admin._id],
        role: "admin",
      },
      "" + process.env.JWT_SECRET
    );
    const result = await admin.save();
    if (!result) {
      return next(new ErrorResponse("Signup failed", 400));
    }
    return res.status(200).json({
      success: true,
      message: "Signup successfull",
      token,
    });
  } catch (err) {
    console.log(err);
    return next(new ErrorResponse(err, 400));
  }
};

exports.CoinPrice = async (req, res, next) => {
  try {
    let admin = await Admin.findOne({});
    if (admin) {
      return res.status(200).json({
        success: true,
        message: "Coin price",
        data: {
          coin: admin.coin
        }
      });
    }
    return res.status(200).json({
      success: true,
      message: "No Data found",
      data: admin,
    });
  } catch (err) {
    return next(new ErrorResponse(err.message, 500));
  }
};

exports.CoinPriceUpdate = async (req, res, next) => {
  try {
    // Update user details
    const admin = await Admin.findOneAndUpdate({}, { coin: req.body.coin });

    if (!admin) {
      return res.status(400).json({
        success: false,
        message: "Coin Price Update Failed",
        data: null,
      });
    }

    return res.status(200).json({
      success: true,
      message: "Coin Price Updated Successfully",
      data: admin,
    });
  } catch (err) {
    console.log(err);
    return next(new ErrorResponse(err, 400));
  }
};

exports.AdPrice = async (req, res, next) => {
  try {
    let admin = await Admin.findOne({});
    if (admin) {
      return res.status(200).json({
        success: true,
        message: "Ad price",
        data: {
          ad: admin.ad
        }
      });
    }
    return res.status(200).json({
      success: true,
      message: "No Data found",
      data: admin,
    });
  } catch (err) {
    return next(new ErrorResponse(err.message, 500));
  }
};

exports.AdPriceUpdate = async (req, res, next) => {
  try {
    // Update user details
    const admin = await Admin.findOneAndUpdate({}, { ad: req.body.ad });

    if (!admin) {
      return res.status(400).json({
        success: false,
        message: "Ad Price Update Failed",
        data: null,
      });
    }

    return res.status(200).json({
      success: true,
      message: "Ad Price Updated Successfully",
      data: admin,
    });
  } catch (err) {
    console.log(err);
    return next(new ErrorResponse(err, 400));
  }
};

exports.adminFee = async (req, res, next) => {
  try {
    let admin = await Admin.findOne({});
    if (admin) {
      return res.status(200).json({
        success: true,
        message: "Admin Fee",
        data: {
          fee: admin.fee
        }
      });
    }
    return res.status(200).json({
      success: true,
      message: "No Data found",
      data: admin,
    });
  } catch (err) {
    return next(new ErrorResponse(err.message, 500));
  }
};

exports.adminFeeUpdate = async (req, res, next) => {
  try {
    // Update user details
    const admin = await Admin.findOneAndUpdate({}, { fee: req.body.fee });

    if (!admin) {
      return res.status(400).json({
        success: false,
        message: "Admin Fee Update Failed",
        data: null,
      });
    }

    return res.status(200).json({
      success: true,
      message: "Admin Fee Updated Successfully",
      data: admin,
    });
  } catch (err) {
    console.log(err);
    return next(new ErrorResponse(err, 400));
  }
};

exports.adminLogin = async (req, res, next) => {
  try {
    const result = await Admin.findOne({ email: req.body.email });
    if (!result) {
      // this means result is null
      return next(new ErrorResponse("Incorrect email address", 200));
    } else {
      // email did exist
      // so lets match password
      if (bcryptjs.compareSync(req.body.password, result.password)) {
        // great, allow this user access
        const token = jsonwebtoken.sign(
          {
            data: [result.email, result._id],
            role: "admin",
          },
          "" + process.env.JWT_SECRET
        );
        return res.status(200).json({
          success: true,
          message: "Successfully Logged in",
          token: token,
        });
      } else {
        return next(new ErrorResponse("Incorrect password", 200));
      }
    }
  } catch (err) {
    return next(new ErrorResponse(err, 400));
  }
};

exports.getDashboard = async (req, res, next) => {
  try {
    let categories = await Category.find();
    let user = await User.find({ brand: false });
    let brand = await User.find({ brand: true });
    let discounts = await Discount.find();
    let luckydraws = await LuckyDraw.find();
    let discountLength = 0;
    let luckydrawLength = 0;
    discounts.map((discount) => {
      discountLength += discount?.history?.length;
    });
    luckydraws.map((luckydraw) => {
      luckydrawLength += luckydraw?.winners?.length;
    });
    if (user && categories && brand) {
      return res.status(200).json({
        success: true,
        message: "Dashboard Data",
        data: {
          user: user.length,
          discount: discountLength,
          brand: brand.length,
          // categories: categories.length,
          // luckydraw: luckydrawLength
        },
      });
    }
    return res.status(200).json({
      success: true,
      message: "No Data found",
      data: [],
    });
  } catch (err) {
    return next(new ErrorResponse(err.message, 500));
  }
};
