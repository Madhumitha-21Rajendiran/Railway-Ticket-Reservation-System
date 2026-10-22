const mongoose = require("mongoose");
const { BOOKING_STATUS, PAYMENT_STATUS } = require("../config/constants");

const bookingSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    train: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Train",
      required: true,
    },
    passengerName: {
      type: String,
      required: true,
      trim: true,
    },
    passengerAge: {
      type: Number,
      required: true,
      min: 1,
    },
    passengerGender: {
      type: String,
      enum: ["male", "female", "other"],
      required: true,
    },
    seatCount: {
      type: Number,
      required: true,
      min: 1,
    },
    totalFare: {
      type: Number,
      required: true,
      min: 0,
    },
    pnr: {
      type: String,
      required: true,
      unique: true,
    },
    bookingStatus: {
      type: String,
      enum: Object.values(BOOKING_STATUS),
      default: BOOKING_STATUS.CONFIRMED,
    },
    paymentStatus: {
      type: String,
      enum: Object.values(PAYMENT_STATUS),
      default: PAYMENT_STATUS.PENDING,
    },
    bookedByClerk: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Booking", bookingSchema);