const { body } = require("express-validator");

const bookingValidation = [
  body("trainId").notEmpty().withMessage("Train ID is required"),
  body("passengerName").notEmpty().withMessage("Passenger name is required"),
  body("passengerAge").isInt({ min: 1 }).withMessage("Valid age is required"),
  body("passengerGender")
    .isIn(["male", "female", "other"])
    .withMessage("Valid gender is required"),
  body("seatCount").isInt({ min: 1 }).withMessage("Seat count must be at least 1"),
];

const clerkBookingValidation = [
  body("userId").notEmpty().withMessage("User ID is required"),
  body("trainId").notEmpty().withMessage("Train ID is required"),
  body("passengerName").notEmpty().withMessage("Passenger name is required"),
  body("passengerAge").isInt({ min: 1 }).withMessage("Valid age is required"),
  body("passengerGender")
    .isIn(["male", "female", "other"])
    .withMessage("Valid gender is required"),
  body("seatCount").isInt({ min: 1 }).withMessage("Seat count must be at least 1"),
];

const createRazorpayOrderValidation = [
  body("bookingId").notEmpty().withMessage("Booking ID is required"),
];

const verifyRazorpayPaymentValidation = [
  body("bookingId").notEmpty().withMessage("Booking ID is required"),
  body("razorpay_payment_id").notEmpty().withMessage("Razorpay payment ID is required"),
  body("razorpay_order_id").notEmpty().withMessage("Razorpay order ID is required"),
  body("razorpay_signature").notEmpty().withMessage("Razorpay signature is required"),
];

module.exports = {
  bookingValidation,
  clerkBookingValidation,
  createRazorpayOrderValidation,
  verifyRazorpayPaymentValidation,
};