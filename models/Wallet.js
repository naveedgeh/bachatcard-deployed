const mongoose = require("mongoose");
const { nonWorking } = require("../controllers/user.controllers");

const WalletSchema = new mongoose.Schema(
    {
      nonworking: {
        type: Number,
        default: 0,
      },
      topup: {
        type: Number,
        default: 0,
      },
      pkr: {
        type: Number,
        default: 0,
      },
      commission: {
        type: Number,
        default: 0,
      },
      userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
      },
      transactions: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: "Wallet"
      }]
    },
    { timestamps: true }
  );
  
  module.exports = mongoose.model("Wallet", WalletSchema);