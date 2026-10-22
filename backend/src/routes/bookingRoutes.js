const express = require("express");
const router = express.Router();

const protect = require("../middleware/authMiddleware");
const validate = require("../middleware/validateMiddleware");
const {
  bookTicket,
  cancelTicket,
  getMyBookings,
  getBookingByPNR,
  getBookingById,
} = require("../controllers/bookingController");
const { bookingValidation } = require("../validations/bookingValidation");

router.get("/pnr/:pnr", getBookingByPNR);

router.use(protect);

router.post("/", bookingValidation, validate, bookTicket);
router.get("/my", getMyBookings);
router.get("/:id", getBookingById);
router.put("/:id/cancel", cancelTicket);

module.exports = router;