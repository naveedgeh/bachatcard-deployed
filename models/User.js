const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
  {
    username: {
      type: String,
      required: [true, "Please Add email"],
      match: [
        /^(([^<>()[\]\.,;:\s@\"]+(\.[^<>()[\]\.,;:\s@\"]+)*)|(\".+\"))@(([^<>()[\]\.,;:\s@\"]+\.)+[^<>()[\]\.,;:\s@\"]{2,})$/i,
        "Please add a valid email",
      ],
      unique: [true, "This email already exists"],
      lowercase: true,
      trim: true,
    },
    referralid: {
      type: String,
      default: function () {
        const characters =
          "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
        let referralID = "";
        for (let i = 0; i < 8; i++) {
          referralID += characters.charAt(
            Math.floor(Math.random() * characters.length)
          );
        }
        return referralID;
      },
    },
    level: {
      type: Number,
      default: 1,
    },
    brandname: {
      type: String,
    },
    firstname: {
      type: String,
    },
    lastname: {
      type: String,
    },
    profilePhoto: {
      type: String,
      default: "",
    },
    fcm_token: {
      type: String,
      default: "",
    },
    phoneNumber: {
      type: String,
      default: "",
      unique: [true, "This phone number already exists"],
    },
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
    creditCard: {
      creditCardNumber: {
        type: String,
        default: function () {
          // Generate a random 16-digit credit card number with a gap after every 4 digits
          let creditCardNumber = "";
          for (let i = 0; i < 16; i++) {
            if (i > 0 && i % 4 === 0) {
              creditCardNumber += " "; // Insert a gap after every 4 digits
            }
            creditCardNumber += Math.floor(Math.random() * 10);
          }
          return creditCardNumber;
        },
      },
      paid: {
        type: Boolean,
        default: false,
      },
      paidDate: {
        type: Date,
        required: false,
      },
      expiryDate: {
        type: String,
        default: function () {
          const currentDate = new Date();
          const expiryDate = new Date(
            currentDate.setMonth(currentDate.getMonth() + 6)
          );

          const expiryYear = expiryDate.getFullYear().toString().slice(-2);
          const expiryMonth = (expiryDate.getMonth() + 1)
            .toString()
            .padStart(2, "0");

          return `${expiryMonth}/${expiryYear}`;
        },
      },
    },
    brandcategory: {
      type: String,
    },
    brand: {
      type: Boolean,
      default: false,
    },
    password: {
      type: String,
      required: [true, "Please provide password"],
    },
    status: {
      type: Boolean,
      default: true,
    },
    wallet: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Wallet",
    },
  },
  { timestamps: true }
);
module.exports = mongoose.model("User", userSchema);
