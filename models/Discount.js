const mongoose = require("mongoose");

// Define a sub-schema for history objects
const historySchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User"
  },
  username: {
    type: String,
    required: true
  },
  price: {
    type: Number,
    required: true
  },
  createdAt: {
    type: Date,
    default: Date.now // Set default value to current date/time
  }
});

const discountSchema = new mongoose.Schema({
  category: {
    type: String,
    required: true
  },
  brand: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User"
  },
  percentage: {
    type: Number,
    required: true
  },
  price: {
    type: Number,
    required: true
  },
  title: {
    type: String,
    required: true
  },
  description: {
    type: String,
    required: true
  },
  address: {
    type: String,
    required: true
  },
  deal: {
    type: Boolean,
    required: true
  },
  endDate: {
    type: String,
    required: true
  },
  endTime: {
    type: String,
    required: true
  },
  image: {
    type: String,
    required: true
  },
  history: [historySchema] // Array of history objects
}, { timestamps: true });

module.exports = mongoose.model("Discount", discountSchema);
