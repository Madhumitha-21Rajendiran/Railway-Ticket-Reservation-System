const Train = require("../models/Train");
const User = require("../models/User");
const Booking = require("../models/Booking");
const asyncHandler = require("../utils/asyncHandler");
const { successResponse, errorResponse } = require("../utils/apiResponse");

const addTrain = asyncHandler(async (req, res) => {
  const existingTrain = await Train.findOne({ trainNumber: req.body.trainNumber });

  if (existingTrain) {
    return errorResponse(res, "Train number already exists", 400);
  }

  const train = await Train.create(req.body);

  return successResponse(res, "Train added successfully", train, 201);
});

const updateTrain = asyncHandler(async (req, res) => {
  const train = await Train.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true,
  });

  if (!train) {
    return errorResponse(res, "Train not found", 404);
  }

  return successResponse(res, "Train updated successfully", train);
});

const deleteTrain = asyncHandler(async (req, res) => {
  const train = await Train.findById(req.params.id);

  if (!train) {
    return errorResponse(res, "Train not found", 404);
  }

  await train.deleteOne();

  return successResponse(res, "Train deleted successfully");
});

const getAllTrains = asyncHandler(async (req, res) => {
  const trains = await Train.find().sort({ createdAt: -1 });
  return successResponse(res, "Trains fetched successfully", trains);
});

const getAllUsers = asyncHandler(async (req, res) => {
  const users = await User.find().sort({ createdAt: -1 });
  return successResponse(res, "Users fetched successfully", users);
});

const getAllBookings = asyncHandler(async (req, res) => {
  const bookings = await Booking.find()
    .populate("user", "name mobile role")
    .populate("train", "trainName trainNumber source destination journeyDate")
    .sort({ createdAt: -1 });

  return successResponse(res, "Bookings fetched successfully", bookings);
});

const getDashboardStats = asyncHandler(async (req, res) => {
  const totalUsers = await User.countDocuments();
  const totalTrains = await Train.countDocuments();
  const totalBookings = await Booking.countDocuments();
  const confirmedBookings = await Booking.countDocuments({ bookingStatus: "confirmed" });
  const cancelledBookings = await Booking.countDocuments({ bookingStatus: "cancelled" });
  const pendingPayments = await Booking.countDocuments({ paymentStatus: "pending" });

  const passengerCount = await User.countDocuments({ role: "passenger" });
  const clerkCount = await User.countDocuments({ role: "clerk" });
  const adminCount = await User.countDocuments({ role: "admin" });

  const recentBookings = await Booking.find()
    .populate("user", "name mobile")
    .populate("train", "trainName trainNumber")
    .sort({ createdAt: -1 })
    .limit(5);

  return successResponse(res, "Dashboard stats fetched successfully", {
    stats: {
      totalUsers,
      totalTrains,
      totalBookings,
      confirmedBookings,
      cancelledBookings,
      pendingPayments,
      passengerCount,
      clerkCount,
      adminCount,
    },
    recentBookings,
  });
});

module.exports = {
  addTrain,
  updateTrain,
  deleteTrain,
  getAllTrains,
  getAllUsers,
  getAllBookings,
  getDashboardStats,
};