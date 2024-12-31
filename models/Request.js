const mongoose = require("mongoose");

const Request = new mongoose.Schema(
  {
    paymentMethod: {
      type: String,
      enum: ["Easypaisa", "Jazzcash", "Binance", "Bank"],
      required: [true, "Please provide payment method"],
    },
    phoneNumber: {
      type: String,
      required: [true, "Please provide phone number"],
    },
    purpose: {
      type: String,
      required: [true, "Please provide the purpose as well"],
    },
    status: {
      type: String,
      default: "pending",
    },
    amount: {
      type: Number,
      required: [true, "Please provide amount"],
    },
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
    screenshot: {
      type: String,
      required: [true, "Please provide screenshot"],
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Request", Request);
