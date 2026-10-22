const Booking = require("../models/Booking");
const Payment = require("../models/Payment");
const asyncHandler = require("../utils/asyncHandler");
const { successResponse, errorResponse } = require("../utils/apiResponse");
const razorpay = require("../config/razorpay");
const { verifyRazorpaySignature } = require("../services/razorpayService");
const { PAYMENT_STATUS } = require("../config/constants");

const createRazorpayOrder = asyncHandler(async (req, res) => {
  const { bookingId } = req.body;

  const booking = await Booking.findById(bookingId)
    .populate("train", "trainName trainNumber source destination journeyDate");

  if (!booking) {
    return errorResponse(res, "Booking not found", 404);
  }

  if (booking.user.toString() !== req.user._id.toString() && req.user.role !== "clerk") {
    return errorResponse(res, "You are not allowed to pay for this booking", 403);
  }

  if (booking.bookingStatus === "cancelled") {
    return errorResponse(res, "Cannot pay for a cancelled booking", 400);
  }

  if (booking.paymentStatus === PAYMENT_STATUS.SUCCESS) {
    return errorResponse(res, "Payment already completed", 400);
  }

  const options = {
    amount: Math.round(booking.totalFare * 100),
    currency: "INR",
    receipt: `booking_${booking._id.toString().slice(-10)}`,
    notes: {
      bookingId: booking._id.toString(),
      pnr: booking.pnr,
    },
  };

  const order = await razorpay.orders.create(options);

  let payment = await Payment.findOne({ booking: booking._id });

  if (!payment) {
    payment = await Payment.create({
      booking: booking._id,
      amount: booking.totalFare,
      method: "razorpay",
      razorpayOrderId: order.id,
      status: PAYMENT_STATUS.PENDING,
    });
  } else {
    payment.razorpayOrderId = order.id;
    payment.status = PAYMENT_STATUS.PENDING;
    await payment.save();
  }

  return successResponse(res, "Razorpay order created successfully", {
    bookingId: booking._id,
    orderId: order.id,
    amount: order.amount,
    currency: order.currency,
    key: process.env.RAZORPAY_KEY_ID,
    booking,
  });
});

const verifyRazorpayPayment = asyncHandler(async (req, res) => {
  const {
    bookingId,
    razorpay_payment_id,
    razorpay_order_id,
    razorpay_signature,
  } = req.body;

  const booking = await Booking.findById(bookingId);
  if (!booking) {
    return errorResponse(res, "Booking not found", 404);
  }

  const payment = await Payment.findOne({ booking: booking._id });
  if (!payment) {
    return errorResponse(res, "Payment record not found", 404);
  }

  const isValid = verifyRazorpaySignature({
    orderId: payment.razorpayOrderId,
    razorpayPaymentId: razorpay_payment_id,
    razorpaySignature: razorpay_signature,
    secret: process.env.RAZORPAY_KEY_SECRET,
  });

  if (!isValid) {
    payment.status = PAYMENT_STATUS.FAILED;
    payment.razorpayPaymentId = razorpay_payment_id || null;
    payment.razorpaySignature = razorpay_signature || null;
    await payment.save();

    booking.paymentStatus = PAYMENT_STATUS.FAILED;
    await booking.save();

    return errorResponse(res, "Payment verification failed", 400);
  }

  payment.status = PAYMENT_STATUS.SUCCESS;
  payment.razorpayPaymentId = razorpay_payment_id;
  payment.razorpaySignature = razorpay_signature;
  payment.transactionId = razorpay_payment_id;
  payment.method = "razorpay";
  await payment.save();

  booking.paymentStatus = PAYMENT_STATUS.SUCCESS;
  await booking.save();

  const updatedBooking = await Booking.findById(booking._id)
    .populate("user", "name mobile")
    .populate("train", "trainName trainNumber source destination departureTime arrivalTime journeyDate fare");

  return successResponse(res, "Payment verified successfully", {
    booking: updatedBooking,
    payment,
  });
});

module.exports = {
  createRazorpayOrder,
  verifyRazorpayPayment,
};