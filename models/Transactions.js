const mongoose = require("mongoose");

const transactionSchema = new mongoose.Schema(
  {
    amount: {
      type: Number,
      required: true,
    },
    description: {
      type: String,
      required: false,
    }
  },
  { timestamps: true }
);

module.exports = mongoose.model("Transaction", transactionSchema);
