const mongoose = require("mongoose");
const { ROLES } = require("../config/constants");

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      trim: true,
      default: "Passenger",
    },
    mobile: {
      type: String,
      required: true,
      unique: true,
      match: /^[6-9]\d{9}$/,
    },
    firebaseUid: {
      type: String,
      default: null,
      index: true,
    },
    role: {
      type: String,
      enum: Object.values(ROLES),
      default: ROLES.PASSENGER,
    },
    isVerified: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("User", userSchema);