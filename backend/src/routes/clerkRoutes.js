const express = require("express");
const router = express.Router();

const protect = require("../middleware/authMiddleware");
const allowRoles = require("../middleware/roleMiddleware");
const validate = require("../middleware/validateMiddleware");
const { clerkBookingValidation } = require("../validations/bookingValidation");
const {
  findOrCreatePassenger,
  clerkBookTicket,
  clerkCancelTicket,
  getAllPassengerBookings,
  getClerkDashboardStats,
} = require("../controllers/clerkController");

router.use(protect, allowRoles("clerk", "admin"));

router.get("/dashboard", getClerkDashboardStats);
router.get("/bookings", getAllPassengerBookings);

router.post("/find-or-create-passenger", findOrCreatePassenger);
router.post("/book", clerkBookingValidation, validate, clerkBookTicket);
router.put("/cancel/:id", clerkCancelTicket);

module.exports = router;