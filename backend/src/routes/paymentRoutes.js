const express = require("express");
const router = express.Router();

const protect = require("../middleware/authMiddleware");
const validate = require("../middleware/validateMiddleware");
const {
  createRazorpayOrder,
  verifyRazorpayPayment,
} = require("../controllers/paymentController");
const {
  createRazorpayOrderValidation,
  verifyRazorpayPaymentValidation,
} = require("../validations/bookingValidation");

router.use(protect);

router.post(
  "/create-order",
  createRazorpayOrderValidation,
  validate,
  createRazorpayOrder
);

router.post(
  "/verify",
  verifyRazorpayPaymentValidation,
  validate,
  verifyRazorpayPayment
);

module.exports = router;