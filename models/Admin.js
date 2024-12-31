const mongoose = require("mongoose");
const adminSchema = new mongoose.Schema(
  {
    firstName: {
      type: String,
      default: "",
    },
    lastName: {
      type: String,
      default: "",
    },
    email: {
      type: String,
      required: [true, "Please add email"],
      match: [
        /^(([^<>()[\]\.,;:\s@\"]+(\.[^<>()[\]\.,;:\s@\"]+)*)|(\".+\"))@(([^<>()[\]\.,;:\s@\"]+\.)+[^<>()[\]\.,;:\s@\"]{2,})$/i,
        "Please add a valid email",
      ],
      unique: [true, "This email already exists"],
      lowercase: true,
      trim: true,
    },
    phoneNumber: {
      type: String,
      default: "",
    },
    password: {
      type: String,
      required: [true, "Please provide password"],
    },
    coin: {
      type: Number,
      default: 0,
    },
    ad: {
      type: Number,
      default: 0,
    },
    fee: {
      type: Number,
      default: 0,
    },
    profilePhoto: {
      type: String,
      default: "",
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Admin", adminSchema);
