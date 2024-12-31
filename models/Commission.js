const mongoose = require("mongoose");

const commissionSchema = new mongoose.Schema({
  user: {
    type: mongoose.Types.ObjectId,
    ref: "User",
    required: true,
  },
  percentage: {
    type: Number,
    trim: true,
    required: true,
  },
  totalAmount: {
    type: Number,
    trim: true,
    required: true,
  },
}, { timestamps: true });

const Commission = mongoose.model("Commission", commissionSchema);
module.exports = Commission;
