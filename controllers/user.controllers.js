const ErrorResponse = require("../utils/errorResponse");
const uploadImage = require("../helpers/helpers");
const User = require("../models/User");
const { calculateCommissionCheck } = require("./commission.controller"); // Adjust the path as necessary

const ReferalUser = require("../models/ReferralUser");
const Request = require("../models/Request");
const Withdrawal = require("../models/Withdrawal");
const Wallet = require("../models/Wallet");
const bcryptjs = require("bcryptjs");
const mongoose = require("mongoose");
const jsonwebtoken = require("jsonwebtoken");

const JWT_KEY = process.env.JWT_KEY;
const JWT_RESET_KEY = process.env.JWT_RESET_KEY;
const nodemailer = require("nodemailer");
const { pipeline } = require("nodemailer/lib/xoauth2");
const ReferralUser = require("../models/ReferralUser");
const Commission = require("../models/Commission");
const Notification = require("../models/Notification");
const cron = require("node-cron");
var admin = require("firebase-admin");

var serviceAccount = require("../firebase.json");

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
});

async function message(data, token, userId) {
  try {
    // Create a new category
    const notification = await Notification.create({ ...data, userId });

    const message = {
      notification: data,
      token: token, // FCM token of the device you want to send the notification to
    };

    admin
      .messaging()
      .send(message)
      .then((response) => {
        console.log("Successfully sent message:", response);
      })
      .catch((error) => {
        console.log("Error sending message:", error);
      });
  } catch (err) {
    console.log(err);
    return next(new ErrorResponse(err.message, 400));
  }
}

exports.userSignup = async (req, res, next) => {
  try {
    const { referralid } = req.body;
    let parentUser = null; // Initialize parentUser as null
    let parentCount = 0;
    if (referralid) {
      parentUser = await User.findOne({ referralid });
      if (!parentUser) {
        throw new Error("Invalid referral ID. Parent user not found.");
      }
      // parentCount = await ReferralUser.countDocuments({
      //   parent: parentUser._id,
      // });
      // if (parentCount > 4) {
      //   throw new Error("Your Referral Limit is complete this id.");
      // }
    }

    let userInfoEmail = await User.findOne({ username: req.body.email });
    if (userInfoEmail) {
      success = false;
      return res
        .status(400)
        .json({ error: "Account with this email already exists" });
    }
    let userInfoPhone = await User.findOne({
      phoneNumber: req.body.phoneNumber,
    });
    if (userInfoPhone) {
      success = false;
      return res
        .status(400)
        .json({ error: "Account with this Phone number already exists" });
    }

    const salt = bcryptjs.genSaltSync(10);
    const hash = bcryptjs.hashSync(req.body.password, salt);

    const user = new User({
      username: req.body.email,
      firstname: req.body.firstname,
      lastname: req.body.lastname,
      phoneNumber: req.body.phoneNumber,
      fcm_token: req.body.fcm_token,
      password: hash,
    });
    if (parentUser) {
      await ReferalUser.create({
        user: user._id,
        parent: parentUser._id,
        level: parentCount == 0 ? 2 : parentCount + 1,
      });
    }
    const wallet = await Wallet.create({
      userId: user.id,
      nonworking: 0,
      topup: 0,
      pkr: 0,
    });
    user.wallet = wallet.id;

    const token = jsonwebtoken.sign(
      {
        data: [user.email, user._id],
        role: "user",
      },
      "" + process.env.JWT_SECRET
    );

    const result = await user.save();

    return res.status(200).json({
      success: true,
      message: "Signed Up Successfully",
      token: token,
      data: result,
    });
  } catch (err) {
    console.error(err.message);
    return next(new ErrorResponse(err.message, 400));
  }
};

exports.fcm_token = async (req, res, next) => {
  try {
    const userId = req.body.userId;

    // Update user details
    const updatedUser = await User.findOneAndUpdate(
      { _id: mongoose.Types.ObjectId(userId) },
      { fcm_token: req.body.fcm_token }
    );

    if (!updatedUser) {
      return res.status(400).json({
        success: false,
        message: "User Update Failed",
        data: null,
      });
    }

    return res.status(200).json({
      success: true,
      message: "User Updated Successfully",
      data: updatedUser,
    });
  } catch (err) {
    return next(new ErrorResponse(err, 400));
  }
};

exports.brandSignup = async (req, res, next) => {
  try {
    if (req.body.referralid) {
      parentUser = await User.findOne({ referralid: req.body.referralid });
      if (!parentUser) {
        throw new Error("Invalid referral ID. Parent user not found.");
      }
      parentCount = await ReferralUser.countDocuments({
        parent: parentUser._id,
      });

      if (parentCount > 4) {
        throw new Error("Your Referral Limit is complete this id.");
      }
    }
    let userInfoEmail = await User.findOne({ username: req.body.email });
    if (userInfoEmail) {
      success = false;
      return res
        .status(400)
        .json({ error: "Account with this email already exists" });
    }
    let userInfoPhone = await User.findOne({
      phoneNumber: req.body.phoneNumber,
    });
    if (userInfoPhone) {
      success = false;
      return res
        .status(400)
        .json({ error: "Account with this Phone number already exists" });
    }

    // let isExist = await User.findOne({ referralid: req.body.referralid });
    // if (!isExist) {
    //   return res
    //     .status(400)
    //     .json({ error: "Your Referral Id is not connect any user" });
    // }
    const salt = bcryptjs.genSaltSync(10);
    const hash = bcryptjs.hashSync(req.body.password, salt);

    let user = new User({
      username: req.body.email,
      referralid: req.body.referralid,
      brandname: req.body.brandname,
      brandcategory: req.body.brandcategory,
      phoneNumber: req.body.phoneNumber,
      password: hash,
      brand: true,
    });

    const token = jsonwebtoken.sign(
      {
        data: [user.email, user._id],
        role: "user",
      },
      "" + process.env.JWT_SECRET
    );
    try {
      const result = await user.save();
      return res.status(200).json({
        success: true,
        message: "Signed Up Successfully",
        token: token,
        data: result,
      });
    } catch (e) {
      console.log(e);
      return next(new ErrorResponse(e.message, 400));
    }
  } catch (err) {
    return next(new ErrorResponse(err, 400));
  }
};

exports.getAllUsers = async (req, res, next) => {
  try {
    let user = await User.find({ status: true, brand: false }).populate(
      "wallet"
    );
    if (user) {
      return res.status(200).json({
        success: true,
        message: "All Users found",
        data: user,
      });
    }
    return res.status(200).json({
      success: true,
      message: "No User found",
      data: user,
    });
  } catch (err) {
    return next(new ErrorResponse(err, 400));
  }
};

exports.getAllNotifications = async (req, res, next) => {
  try {
    let notifications = await Notification.find({
      userId: mongoose.Types.ObjectId(req.params.id),
    });
   
    if (notifications) {
      return res.status(200).json({
        success: true,
        message: "All Notifications found",
        data: notifications,
      });
    }
    return res.status(200).json({
      success: true,
      message: "No Notification found",
      data: notifications,
    });
  } catch (err) {
    return next(new ErrorResponse(err, 400));
  }
};

exports.getAllBrands = async (req, res, next) => {
  try {
    let user = await User.find({ status: true, brand: true });
    if (user) {
      return res.status(200).json({
        success: true,
        message: "All Users found",
        data: user,
      });
    }
    return res.status(200).json({
      success: true,
      message: "No User found",
      data: user,
    });
  } catch (err) {
    return next(new ErrorResponse(err, 400));
  }
};

exports.getSingleUserById = async (req, res, next) => {
  const id = req.body.id;
  try {
    let user = await User.findOne({
      _id: mongoose.Types.ObjectId(id),
    }).populate("wallet");
    if (user) {
      return res.status(200).json({
        success: true,
        message: "user found",
        data: user,
      });
    }
    return res.status(200).json({
      success: true,
      message: "user not found",
      data: user,
    });
  } catch (err) {
    return next(new ErrorResponse(err, 400));
  }
};

exports.userLogin = async (req, res, next) => {
  try {
    const rest = await User.findOne({ username: req.body.email });
    if (!rest) {
      // this means result is null
      return next(new ErrorResponse("Incorrect email address", 401));
    } else {
      // email did exist
      // so lets match password
      if (bcryptjs.compareSync(req.body.password, rest.password)) {
        // great, allow this user access
        const token = jsonwebtoken.sign(
          {
            data: [rest.email, rest._id],
            role: rest.status,
          },
          process.env.JWT_SECRET,
          { expiresIn: "2d" }
        );
        // Get the current date
        let currentDate = new Date();

        // Calculate the date 6 months ago
        let sixMonthsAgo = new Date();
        sixMonthsAgo.setMonth(currentDate.getMonth() - 6);

        // Assuming creditCard is an object with a paidDate property

        // Your code here for when the paidDate is more than 6 months ago

        if (rest?.creditCard.paid == true) {
          if (rest?.creditCard.paidDate < sixMonthsAgo) {
            await User.updateOne(
              {
                _id: rest._id,
                "creditCard.paidDate": {
                  $lt: new Date(new Date().setMonth(new Date().getMonth() - 6)),
                },
              },
              { $set: { "creditCard.paid": false } }
            );
          }
        }
        // Schedule the cron job to run every 6 months
        // cron.schedule("0 0 1 */6 *", async () => {
        //   console.log(
        //     "Running a job every 6 months at midnight on the 1st of the month."
        //   );
        //   await User.updateOne(
        //     {
        //       _id: rest._id,
        //       "creditCard.paidDate": {
        //         $lt: new Date(new Date().setMonth(new Date().getMonth() - 6)),
        //       },
        //     },
        //     { $set: { "creditCard.paid": false } }
        //   );
        //   // Update user inactivity
        // });

        const commission = await Commission.findOne({ user: rest._id });

        let result = { ...rest._doc };
        result.commission = commission;
        return res.status(200).json({
          success: true,
          message: "Logged In Successfully",
          data: { token: token, result },
        });
      } else {
        return next(new ErrorResponse("Incorrect password", 401));
      }
    }
  } catch (err) {
    return next(new ErrorResponse(err, 400));
  }
};

exports.updateUser = async (req, res, next) => {
  try {
    const userId = req.user.data[1];
    const { password, username, phoneNumber, email } = req.body;

    let updateFields = {};

    if (password) {
      const salt = bcryptjs.genSaltSync(10);
      const hash = bcryptjs.hashSync(password, salt);
      updateFields.password = hash;
    }

    if (req.files && req.files.profilePhoto) {
      const profilePhotoUploaded = await uploadImage.uploadImage(
        req.files.profilePhoto,
        next
      );
      updateFields.profilePhoto = profilePhotoUploaded.photoPath;
    }

    if (username) updateFields.username = username;
    if (phoneNumber) updateFields.phoneNumber = phoneNumber;
    if (email) updateFields.email = email;

    // Update user details
    const updatedUser = await User.findOneAndUpdate(
      { _id: mongoose.Types.ObjectId(userId) },
      updateFields,
      { new: true }
    );

    if (!updatedUser) {
      return res.status(400).json({
        success: false,
        message: "User Update Failed",
        data: null,
      });
    }

    return res.status(200).json({
      success: true,
      message: "User Updated Successfully",
      data: updatedUser,
    });
  } catch (err) {
    return next(new ErrorResponse(err, 400));
  }
};

////// Requests ///////

exports.saveRequest = async (req, res, next) => {
  try {
    const { userId, paymentMethod, phoneNumber, amount, purpose } = req.body;

    // Check if the request contains a screenshot
    if (!req.files || !req.files.screenshot) {
      return res.status(400).json({
        success: false,
        message: "Screenshot image is required",
        data: null,
      });
    }

    // Upload screenshot image using the uploadImage utility function
    const screenshotImage = req.files.screenshot;
    const screenshotPhotoUploaded = await uploadImage.uploadImage(
      screenshotImage,
      next
    );

    // Create new request object
    const newRequest = new Request({
      paymentMethod,
      phoneNumber,
      amount,
      purpose,
      userId,
      screenshot: screenshotPhotoUploaded.photoPath, // Assuming the uploadImage function returns an object with the photoPath property
    });

    // Save request to database
    await newRequest.save();

    return res.status(201).json({
      success: true,
      message: "Request saved successfully",
      data: newRequest,
    });
  } catch (err) {
    return next(new ErrorResponse(err, 400));
  }
};

exports.acceptRequest = async (req, res, next) => {
  try {
    const request = await Request.findByIdAndUpdate(req.body.id, {
      status: "accepted",
    });

    if (!request) {
      return res
        .status(400)
        .json({ success: false, message: "User Accepted Failed!" });
    }

    let requests = await Request.find({})
      .populate("userId")
      .sort({ createdAt: -1 });
    let user = await User.findById(request.userId);

    if (request) {
      if (request.purpose === "Buy Card") {
        try {
          var token = user.fcm_token;

          var notification = {
            title: "Payment Request Accepted Successfully!",
            body: `Dear user, Congratulations! We are pleased to inform you that you have successfully ${request.purpose} of Rs ${request.amount}`,
          };

          message(notification, token, request.userId);

          user.creditCard.paid = true;
          user.save();
          await calculateCommissionCheck(request.userId, request.amount);
          console.log("Commission calculated successfully");
        } catch (error) {
          console.error("Error calculating commission:", error);
        }
      } else {
        var token = user.fcm_token;

        var notification = {
          title: "Payment Request Accepted Successfully!",
          body: `Dear user, Your account has been successfully Topup with Rs ${request.amount} PKR`,
        };

        message(notification, token, request.userId);
      }

      return res.status(200).json({
        success: true,
        message: "User Accepted Successfully!",
        data: requests,
      });
    }

    return res.status(200).json({
      success: true,
      message: "No User found",
      data: requests,
    });
  } catch (err) {
    return next(new ErrorResponse(err, 400));
  }
};

exports.declineRequest = async (req, res, next) => {
  try {
    const activatedUser = await Request.findByIdAndUpdate(req.body.id, {
      status: "declined",
    });
    if (!activatedUser) {
      return res.status("User Deactivated Failed", 400);
    }

    let request = await Request.find({})
      .populate("userId")
      .sort({ createdAt: -1 });
    let user = await User.findById(activatedUser.userId);
    if (request) {
      var token = user.fcm_token;

      var notification = {
        title: "Payment Request Decline",
        body: "Payment Request has been declined by the Admin",
      };

      message(notification, token, activatedUser.userId);

      return res.status(200).json({
        success: true,
        message: "Request Declined Successfully!",
        data: request,
      });
    }
    return res.status(200).json({
      success: true,
      message: "No User found",
      data: request,
    });
  } catch (err) {
    return next(new ErrorResponse(err, 400));
  }
};

exports.getAllRequests = async (req, res, next) => {
  try {
    let request = await Request.find()
      .populate("userId")
      .sort({ createdAt: -1 });
    if (request) {
      return res.status(200).json({
        success: true,
        message: "All Request found",
        data: request,
      });
    }
    return res.status(200).json({
      success: false,
      message: "No Request found",
      data: request,
    });
  } catch (err) {
    return next(new ErrorResponse(err, 400));
  }
};

///// Withdrawals /////

exports.saveWithdrawal = async (req, res, next) => {
  try {
    const {
      userId,
      paymentMethod,
      accountTitle,
      phoneNumber,
      IBAN,
      pkr,
      commission,
    } = req.body;
    // Create new request object
    var amount = parseInt(pkr) + parseInt(commission);

    const wallet = await Wallet.findOne({ userId: userId, status: "pending" });

    wallet.pkr = wallet.pkr - pkr;
    wallet.commission = wallet.commission - commission;
    wallet.save();

    const newWithdrawal = new Withdrawal({
      paymentMethod,
      phoneNumber,
      accountTitle,
      amount,
      IBAN,
      userId,
    });

    let user = await User.findById(userId);
    var token = user.fcm_token;

    var notification = {
      title: "Withdrawal Request Accepted Successfully!",
      body: `Dear user, We would like to inform you that your withdrawal request of ${amount} has been forwarded to the admin for processing. We will notify you as soon as the request is completed. Thank you`,
    };

    message(notification, token, userId);

    // Save request to database
    await newWithdrawal.save();

    return res.status(201).json({
      success: true,
      message: "Withdrawal saved successfully",
      data: newWithdrawal,
    });
  } catch (err) {
    return next(new ErrorResponse(err, 400));
  }
};

exports.acceptWithdrawal = async (req, res, next) => {
  try {
    const deactivatedUser = await Withdrawal.findByIdAndUpdate(req.body.id, {
      status: "accepted",
    });
    if (!deactivatedUser) {
      return res.status("Withdrawal Accepted Failed!", 400);
    }

    let withdrawal = await Withdrawal.find({}).sort({ createdAt: -1 });
    let user = await User.findById(deactivatedUser.userId);
    if (withdrawal) {
      var token = user.fcm_token;

      var notification = {
        title: "Withdrawal Request Accepted Successfully!",
        body: `Dear user, We are pleased to inform you that your withdrawal request has been accepted. The funds will be transferred to your ${deactivatedUser.paymentMethod} within the next 48 hours. Thank you!`,
      };

      message(notification, token, deactivatedUser.userId);

      return res.status(200).json({
        success: true,
        message: "Withdrawal Accepted Successfully!",
        data: withdrawal,
      });
    }
    return res.status(200).json({
      success: true,
      message: "No User found",
      data: withdrawal,
    });
  } catch (err) {
    return next(new ErrorResponse(err, 400));
  }
};

exports.declineWithdrawal = async (req, res, next) => {
  try {
    const activatedUser = await Withdrawal.findByIdAndUpdate(req.body.id, {
      status: "declined",
    });
    if (!activatedUser) {
      return res.status("withdrawal Deactivated Failed", 400);
    }

    let withdrawal = await Withdrawal.find({}).sort({ createdAt: -1 });
    let user = await User.findById(activatedUser.userId);
    user.pkr = parseInt(user.pkr) + parseInt(activatedUser.amount);
    user.save();
    if (withdrawal) {
      var token = user.fcm_token;

      var notification = {
        title: "Withdrawal Request Declined!",
        body: `
          Dear user, We regret to inform you that we are currently unable to process your request at this time due to technical difficulties.
        `,
      };

      message(notification, token, activatedUser.userId);

      return res.status(200).json({
        success: true,
        message: "Request Declined Successfully!",
        data: withdrawal,
      });

      return res.status(200).json({
        success: true,
        message: "users found",
        data: user,
      });
    }
    return res.status(200).json({
      success: true,
      message: "No User found",
      data: user,
    });
  } catch (err) {
    return next(new ErrorResponse(err, 400));
  }
};

exports.getAllWithdrawal = async (req, res, next) => {
  try {
    let request = await Withdrawal.find()
      .populate("userId")
      .sort({ createdAt: -1 });
    if (request) {
      return res.status(200).json({
        success: true,
        message: "All Withdrawal found",
        data: request,
      });
    }
    return res.status(200).json({
      success: false,
      message: "No Withdrawal found",
      data: request,
    });
  } catch (err) {
    return next(new ErrorResponse(err, 400));
  }
};

exports.userSwap = async (req, res, next) => {
  try {
    const { id, pkr } = req.body;
    // Update user details
    const wallet = await Wallet.findOne({
      userId: mongoose.Types.ObjectId(id),
    });

    wallet.nonworking = 0;
    wallet.topup = 0;
    wallet.pkr = pkr;
    wallet.save();

    const users = await User.find({ status: true, brand: false }).populate(
      "wallet"
    );

    if (!wallet) {
      return res.status(400).json({
        success: false,
        message: "User Swapped unsuccessfull",
        data: null,
      });
    }

    return res.status(200).json({
      success: true,
      message: `Amount is swapped successfully`,
      data: users,
    });
  } catch (err) {
    return next(new ErrorResponse(err, 400));
  }
};

exports.nonWorking = async (req, res, next) => {
  try {
    const { id, amount } = req.body;
    // Update user details
    const wallet = await Wallet.findOne({
      userId: mongoose.Types.ObjectId(id),
    });

    wallet.nonworking = wallet.nonworking + parseInt(amount);
    wallet.save();

    const users = await User.find({ status: true, brand: false }).populate(
      "wallet"
    );

    if (!wallet) {
      return res.status(400).json({
        success: false,
        message: "Top Up unsuccessfull",
        data: null,
      });
    }

    return res.status(200).json({
      success: true,
      message: `Amount of ${amount} is Top Up successfully`,
      data: users,
    });
  } catch (err) {
    return next(new ErrorResponse(err, 400));
  }
};

exports.userTopup = async (req, res, next) => {
  try {
    const { id, amount } = req.body;
    // Update user details
    const wallet = await Wallet.findOne({
      userId: mongoose.Types.ObjectId(id),
    });

    wallet.topup = wallet.topup + parseInt(amount);
    wallet.save();

    const users = await User.find({ status: true, brand: false }).populate(
      "wallet"
    );

    if (!wallet) {
      return res.status(400).json({
        success: false,
        message: "Top Up unsuccessfull",
        data: null,
      });
    }

    return res.status(200).json({
      success: true,
      message: `Amount of ${amount} is Top Up successfully`,
      data: users,
    });
  } catch (err) {
    return next(new ErrorResponse(err, 400));
  }
};

exports.pkrTopup = async (req, res, next) => {
  try {
    const { id, pkr } = req.body;
    // Update user details
    const wallet = await Wallet.findOne({
      userId: mongoose.Types.ObjectId(id),
    });
    console.log(wallet);
    wallet.pkr = wallet.pkr + parseInt(pkr);
    wallet.save();

    const users = await User.find({ status: true, brand: false }).populate(
      "wallet"
    );

    if (!wallet) {
      return res.status(400).json({
        success: false,
        message: "Top Up unsuccessfull",
        data: null,
      });
    }

    return res.status(200).json({
      success: true,
      message: `Amount of ${pkr} is Top Up successfully`,
      data: users,
    });
  } catch (err) {
    return next(new ErrorResponse(err, 400));
  }
};

exports.deleteUser = async (req, res, next) => {
  try {
    const deletedUser = await User.deleteMany({ _id: { $in: req.body.ids } });
    if (!deletedUser) {
      return res.status("User Delete Failed!", 400);
    }
    let user = await User.find({}).sort({ createdAt: -1 });
    if (user) {
      return res.status(200).json({
        success: true,
        message: "User Deleted Successfully!",
        data: user,
      });
    }
    return res.status(200).json({
      success: true,
      message: "No User found",
      data: user,
    });
  } catch (err) {
    return next(new ErrorResponse(err, 400));
  }
};

exports.deactivateUser = async (req, res, next) => {
  try {
    const deactivatedUser = await User.findByIdAndUpdate(req.body.id, {
      status: false,
    });
    if (!deactivatedUser) {
      return res.status("User Deactivated Failed!", 400);
    }
    let user = await User.find({}).sort({ createdAt: -1 });
    if (user) {
      return res.status(200).json({
        success: true,
        message: "User Deactivated Successfully!",
        data: user,
      });
    }
    return res.status(200).json({
      success: true,
      message: "No User found",
      data: user,
    });
  } catch (err) {
    return next(new ErrorResponse(err, 400));
  }
};

exports.activateUser = async (req, res, next) => {
  try {
    const activatedUser = await User.findByIdAndUpdate(req.body.id, {
      status: true,
    });
    if (!activatedUser) {
      return res.status("User Delete Failed", 400);
    }
    let user = await User.find({}).sort({ createdAt: -1 });
    if (user) {
      return res.status(200).json({
        success: true,
        message: "users found",
        data: user,
      });
    }
    return res.status(200).json({
      success: true,
      message: "No User found",
      data: user,
    });
  } catch (err) {
    return next(new ErrorResponse(err, 400));
  }
};

exports.forgetPassword = async (req, res, next) => {
  try {
    const email = req.body.email;
    const user = await User.findOne({ username: email });
    const userId = user.id;
   
    if (!user) {
      return res.status(403).json({
        success: false,
        message: "Not Send ",
        data: null,
      });
    } else {
      const token = jsonwebtoken.sign({ _id: userId }, JWT_RESET_KEY, {
        expiresIn: "30m",
      });
      const CLIENT_URL = "https://password.zeemarketing.net";
      const output = `
        <h2>Please click on below link to reset your account password</h2>
        <p>${CLIENT_URL}/${token}</p>
        <p><b>NOTE: </b> The activation link expires in 30 minutes.</p>
      `;

      const transporter = nodemailer.createTransport({
        host: "mail.zeemarketing.net",
        secureConnection: false,
        tls: {
          rejectUnauthorized: false,
        },
        port: 587,
        auth: {
          user: "noreply@zeemarketing.net",
          pass: "Qj)NJtPeH8;(",
        },
      });
      // send mail with defined transport object
      const mailOptions = {
        from: '"Zee Marketing" <noreply@zeemarketing.net>', // sender address
        to: email, // list of receivers
        subject: "Account Password Reset:  ✔", // Subject line
        html: output, // html body
      };

      transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
          console.log(error);
        } else {
          console.log("Mail sent : %s", info.response);
        }
      });

      return res.status(200).json({
        success: true,
        message: "Email Send to your Account.",
        data: null,
      });
    }
  } catch (err) {
    return next(new ErrorResponse(err, 400));
  }
};

exports.VerifyJWTToken = async (req, res, next) => {
  try {
    const token = req.body.token;
    jsonwebtoken.verify(token, JWT_RESET_KEY, async (err, decodedToken) => {
      if (err) {
        return res.status(403).json({
          success: false,
          message: "Session Expired",
          data: null,
        });
      } else {
        const { _id } = decodedToken;
        return res.status(200).json({
          success: true,
          message: "User Found",
          data: _id,
        });
      }
    });
  } catch (err) {
    return next(new ErrorResponse(err, 400));
  }
};

exports.resetPassword = async (req, res, next) => {
  
  try {
    const token = req.body.token;
    const newPassword = req.body.password;

    if (!token || !newPassword) {
      return res.status(400).json({
        success: false,
        message: "Token and newPassword are required.",
        data: null,
      });
    }

    const decoded = jsonwebtoken.verify(token, JWT_RESET_KEY);
    const userId = decoded._id;

    const salt = bcryptjs.genSaltSync(10);
    const hash = bcryptjs.hashSync(newPassword, salt);

    const user = await User.findByIdAndUpdate(userId, { password: hash });

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found.",
        data: null,
      });
    }

    return res.status(200).json({
      success: true,
      message: "Password updated successfully.",
      data: null,
    });
  } catch (err) {
    return next(new ErrorResponse(err, 400));
  }
};
exports.getRefferalUser = async (req, res, next) => {
  const { referralid } = req.params;
  const user = await User.findOne({ referralid });
  if (!user) {
    return res.status(400).json("User not found");
  }

  // const tree = { user };
  let firstchildren = await getChildren(user._id);
  const tree = {
    ...user.toObject(),
    children: firstchildren,
  };
  async function getChildren(parentId) {
   
    const children = await ReferralUser.find({
      parent: parentId,
    }).populate("user");
    const childNodes = [];

    for (const child of children) {
      const newchildren = await getChildren(child.user._id);

      // Create the node and include children within user
      const node = {
        user: {
          ...child.user.toObject(), // Convert user to plain object to add properties
          children: newchildren,
        },
        level: child.level,
      };

      // Add the node to the childNodes array
      childNodes.push(node);
    }
    return childNodes;
  }

  return res.status(200).json(tree);
};

const getUserDetailswithId = async (user) => {
  const result = await User.findOne({ _id: user });
  return result;
};
exports.getRefferalUserByParentId = async (req, res) => {
  const { id } = req.params;
  const result = await ReferralUser.find({ parent: id }).populate({
    path: "user",
  });
  res.status(200).json(result);
};

// exports.countActiveAndInactiveUsers = async (req, res) => {
//   const { userid } = req.params;
//   try {
//     // Function to determine if a user is active
//     const isActive = async (user) => {
//       return user.creditCard.paid;
//     };

//     // Recursive function to count active and inactive referrals by level
//     const countReferrals = async (users, level, result, parentId) => {
//       if (level > 5) return; // Limit to 5 levels

//       if (!result[level]) {
//         result[level] = {
//           parentId: parentId || "",
//           level: level,
//           active: 0,
//           inactive: 0,
//         };
//       }

//       const nextLevelUsers = [];
//       for (const user of users) {
//         result[level].parentId = parentId;
//         const userIsActive = await isActive(user);
//         if (userIsActive) {
//           result[level].active++;
//         } else {
//           result[level].inactive++;
//         }

//         const children = await ReferralUser.find({ parent: user._id }).populate(
//           "user"
//         );
//         nextLevelUsers.push(...children.map((child) => child.user));
//       }

//       // Recursively count referrals at the next level
//       if (nextLevelUsers.length > 0) {
//         await countReferrals(nextLevelUsers, level + 1, result, users[0]._id);
//       }
//     };

//     const rootUser = await ReferralUser.findOne({ user: userid }).populate(
//       "user"
//     );

//     if (!rootUser) {
//       return res.status(404).json({ message: "User not found" });
//     }

//     // Initialize the result object
//     const result = {};

//     // Get the children of the root user (level 1)
//     const firstLevelUsers = await ReferralUser.find({
//       parent: rootUser.user._id,
//     }).populate("user");

//     if (firstLevelUsers.length === 0) {
//       return res.status(200).json({ message: "No referrals found" });
//     }

//     // Start counting from the children of the root user at level 1
//     await countReferrals(
//       firstLevelUsers.map((ref) => ref.user),
//       1,
//       result,
//       rootUser.user._id
//     );

//     // Convert result object to an array sorted by levels
//     const response = Object.values(result).sort((a, b) => a.level - b.level);

//     // Send the response with the counts
//     return res.status(200).json(response);
//   } catch (error) {
//     console.error("Error in counting referrals:", error);
//     return res.status(500).json({ message: "Internal server error" });
//   }
// };

exports.countActiveAndInactiveUsers = async (req, res) => {
  const { userid } = req.params;
  try {
    // Function to determine if a user is active
    const isActive = async (user) => {
      return user.creditCard.paid;
    };

    // Recursive function to count active and inactive referrals by level
    const countReferrals = async (users, level, result, parentId) => {
      if (level > 5) return; // Limit to 5 levels

      if (!result[level]) {
        result[level] = {
          parentId: parentId || "",
          level: level,
          active: 0,
          inactive: 0,
          users: [],
        };
      }

      const nextLevelUsers = [];
      for (const user of users) {
        const userIsActive = await isActive(user);
        if (userIsActive) {
          result[level].active++;
        } else {
          result[level].inactive++;
        }

        result[level].users.push({
          userId: user._id,
          username: user.username,
          email: user.email,
          phoneNumber: user.phoneNumber,
          firstname: user.firstname,
          lastname: user.lastname,
          profilePhoto: user.profilePhoto,
          creditCard: user.creditCard,
          status: user.status,
        });

        const children = await ReferralUser.find({ parent: user._id }).populate(
          "user"
        );
        nextLevelUsers.push(...children.map((child) => child.user));
      }

      // Recursively count referrals at the next level
      if (nextLevelUsers.length > 0) {
        await countReferrals(nextLevelUsers, level + 1, result, users[0]._id);
      }
    };

    const rootUser = await User.findOne({ _id: userid });

    if (!rootUser) {
      return res.status(404).json({ message: "User not found" });
    }

    // Initialize the result object
    const result = {};

    // Get the children of the root user (level 1)
    const firstLevelUsers = await ReferralUser.find({
      parent: rootUser._id,
    }).populate("user");
    
    if (firstLevelUsers.length === 0) {
      return res.status(200).json({ message: "No referrals found" });
    }

    // Start counting from the children of the root user at level 1
    await countReferrals(
      firstLevelUsers.map((ref) => ref.user),
      1,
      result,
      rootUser?._id
    );

    // Convert result object to an array sorted by levels
    const response = Object.values(result).sort((a, b) => a.level - b.level);

    // Send the response with the counts and user details
    return res.status(200).json(response);
  } catch (error) {
    console.error("Error in counting referrals:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
};
