const mongoose = require("mongoose");

const referralUserSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
    parent: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
    level: {
      type: Number,
    },
  },
  { timestamps: true }
);

const ReferralUser = mongoose.model("ReferalUser", referralUserSchema);

module.exports = ReferralUser;
