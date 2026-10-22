const express = require("express");
const router = express.Router();

const {
  addTrain,
  updateTrain,
  deleteTrain,
  getAllTrains,
  getAllUsers,
  getAllBookings,
  getDashboardStats,
} = require("../controllers/adminController");

const protect = require("../middleware/authMiddleware");
const allowRoles = require("../middleware/roleMiddleware");
const validate = require("../middleware/validateMiddleware");
const { createTrainValidation } = require("../validations/trainValidation");

router.use(protect, allowRoles("admin"));

router.get("/dashboard", getDashboardStats);

router.get("/trains", getAllTrains);
router.post("/trains", createTrainValidation, validate, addTrain);
router.put("/trains/:id", updateTrain);
router.delete("/trains/:id", deleteTrain);

router.get("/users", getAllUsers);
router.get("/bookings", getAllBookings);

module.exports = router;