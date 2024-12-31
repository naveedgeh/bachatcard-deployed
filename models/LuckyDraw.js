const mongoose = require("mongoose");

const luckyDrawSchema = new mongoose.Schema(
  {
    timeframe: {
      type: Object,
      required: true,
    },
    items: [
      {
        type: String,
        required: true,
      },
    ],
    winners: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
      },
    ],
    expired: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("LuckyDraw", luckyDrawSchema);
