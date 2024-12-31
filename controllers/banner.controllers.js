const ErrorResponse = require("../utils/errorResponse");
const Banner = require("../models/Banner");
const uploadImage = require("../helpers/helpers");

exports.getBanner = async (req, res, next) => {
  try {
    let banner = await Banner.findOne();
    if (banner) {
      return res.status(200).json({
        success: true,
        message: "Banner found",
        data: banner,
      });
    }
    return res.status(200).json({
      success: true,
      message: "Banner not found",
      data: banner,
    });
  } catch (err) {
    return next(new ErrorResponse(err, 400));
  }
};
exports.changeBanner = async (req, res, next) => {
  try {
    // Find the existing banner
    let existingBanner = await Banner.findOne();

    // If no existing banner is found, return an error
    if (!existingBanner) {
      return res.status(400).json({
        success: false,
        message: "No banner found. Create a new one instead of updating.",
      });
    }

    // Update images in the existing banner
    if (req.files) {
      const image0 = await uploadImage.uploadImage(req.files["image[0]"], next);
      const image1 = await uploadImage.uploadImage(req.files["image[1]"], next);
      const image2 = await uploadImage.uploadImage(req.files["image[2]"], next);
      existingBanner.image0 = image0.photoPath
      existingBanner.image1 = image1.photoPath
      existingBanner.image2 = image2.photoPath
    }

    // Save the updated banner
    await existingBanner.save();

    return res.status(200).json({
      success: true,
      message: "Banner updated successfully",
      data: existingBanner,
    });
  } catch (err) {
    return next(new ErrorResponse(err.message, 400));
  }
};

