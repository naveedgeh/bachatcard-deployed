const mongoose = require("mongoose");

const levelpercentageSchema = new mongoose.Schema(
  {
    level: {
      type: String,
    },
    percentagePrice: {
      type: String,
    },
  },
  { timestamps: true }
);

const LevelPercentage = mongoose.model(
  "LevelPercentage",
  levelpercentageSchema
);

module.exports = LevelPercentage;
