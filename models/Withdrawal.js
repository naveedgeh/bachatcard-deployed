const mongoose = require("mongoose");

const Withdrawal = new mongoose.Schema(
  {
    paymentMethod: {
      type: String,
      required: [true, "Please provide payment method"],
    },
    accountTitle: {
      type: String,
      required: [true, "Please provide Account Title"],
    },
    phoneNumber: {
      type: String,
      required: [true, "Please provide phone number"],
    },
    IBAN: {
      type: String,
      required: [true, "Please provide IBAN number"],
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
    }
  },
  { timestamps: true }
);

module.exports = mongoose.model("Withdrawal", Withdrawal);
