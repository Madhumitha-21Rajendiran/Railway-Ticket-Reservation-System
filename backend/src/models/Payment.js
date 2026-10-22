const mongoose = require("mongoose");
const { PAYMENT_METHODS, PAYMENT_STATUS } = require("../config/constants");

const paymentSchema = new mongoose.Schema(
  {
    booking: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Booking",
      required: true,
    },
    amount: {
      type: Number,
      required: true,
      min: 0,
    },
    method: {
      type: String,
      enum: [...Object.values(PAYMENT_METHODS), "upi", "wallet", "razorpay"],
      required: true,
    },
    transactionId: {
      type: String,
      default: null,
      unique: true,
      sparse: true,
    },
    razorpayOrderId: {
      type: String,
      default: null,
      index: true,
    },
    razorpayPaymentId: {
      type: String,
      default: null,
      index: true,
    },
    razorpaySignature: {
      type: String,
      default: null,
    },
    status: {
      type: String,
      enum: Object.values(PAYMENT_STATUS),
      default: PAYMENT_STATUS.PENDING,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Payment", paymentSchema);