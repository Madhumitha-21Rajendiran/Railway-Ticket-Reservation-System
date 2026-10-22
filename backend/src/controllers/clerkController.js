const Booking = require("../models/Booking");
const Train = require("../models/Train");
const User = require("../models/User");
const asyncHandler = require("../utils/asyncHandler");
const { successResponse, errorResponse } = require("../utils/apiResponse");
const generatePNR = require("../services/pnrService");
const { hasEnoughSeats, reduceSeats, increaseSeats } = require("../services/seatService");
const { BOOKING_STATUS, PAYMENT_STATUS, ROLES } = require("../config/constants");

const findOrCreatePassenger = asyncHandler(async (req, res) => {
  const { mobile, name } = req.body;

  let user = await User.findOne({ mobile });

  if (!user) {
    user = await User.create({
      name: name || "Passenger",
      mobile,
      role: ROLES.PASSENGER,
      isVerified: true,
    });
  }

  return successResponse(res, "Passenger fetched successfully", user);
});

const clerkBookTicket = asyncHandler(async (req, res) => {
  const {
    userId,
    trainId,
    passengerName,
    passengerAge,
    passengerGender,
    seatCount,
  } = req.body;

  const passenger = await User.findById(userId);
  if (!passenger) {
    return errorResponse(res, "Passenger not found", 404);
  }

  const train = await Train.findById(trainId);
  if (!train) {
    return errorResponse(res, "Train not found", 404);
  }

  if (!hasEnoughSeats(train, seatCount)) {
    return errorResponse(res, "Not enough seats available", 400);
  }

  const totalFare = train.fare * seatCount;
  const pnr = generatePNR();

  const booking = await Booking.create({
    user: userId,
    train: train._id,
    passengerName,
    passengerAge,
    passengerGender,
    seatCount,
    totalFare,
    pnr,
    bookingStatus: BOOKING_STATUS.CONFIRMED,
    paymentStatus: PAYMENT_STATUS.PENDING,
    bookedByClerk: true,
  });

  await reduceSeats(train, seatCount);

  const populatedBooking = await Booking.findById(booking._id)
    .populate("user", "name mobile role")
    .populate("train", "trainName trainNumber source destination departureTime arrivalTime journeyDate fare");

  return successResponse(res, "Clerk booked ticket successfully", populatedBooking, 201);
});

const clerkCancelTicket = asyncHandler(async (req, res) => {
  const booking = await Booking.findById(req.params.id).populate("train user");

  if (!booking) {
    return errorResponse(res, "Booking not found", 404);
  }

  if (booking.bookingStatus === BOOKING_STATUS.CANCELLED) {
    return errorResponse(res, "Booking already cancelled", 400);
  }

  booking.bookingStatus = BOOKING_STATUS.CANCELLED;
  await booking.save();

  const train = await Train.findById(booking.train._id);
  if (train) {
    await increaseSeats(train, booking.seatCount);
  }

  return successResponse(res, "Clerk cancelled ticket successfully", booking);
});

const getAllPassengerBookings = asyncHandler(async (req, res) => {
  const { mobile } = req.query;

  let query = {};
  if (mobile) {
    const user = await User.findOne({ mobile });
    if (user) query.user = user._id;
    else query.user = null;
  }

  const bookings = await Booking.find(query)
    .populate("user", "name mobile")
    .populate("train", "trainName trainNumber source destination journeyDate")
    .sort({ createdAt: -1 });

  return successResponse(res, "Passenger bookings fetched successfully", bookings);
});

const getClerkDashboardStats = asyncHandler(async (req, res) => {
  const totalPassengerBookings = await Booking.countDocuments({ bookedByClerk: true });
  const activeBookings = await Booking.countDocuments({
    bookedByClerk: true,
    bookingStatus: BOOKING_STATUS.CONFIRMED,
  });
  const cancelledBookings = await Booking.countDocuments({
    bookedByClerk: true,
    bookingStatus: BOOKING_STATUS.CANCELLED,
  });

  const recentBookings = await Booking.find({ bookedByClerk: true })
    .populate("user", "name mobile")
    .populate("train", "trainName trainNumber")
    .sort({ createdAt: -1 })
    .limit(5);

  return successResponse(res, "Clerk dashboard stats fetched successfully", {
    stats: {
      totalPassengerBookings,
      activeBookings,
      cancelledBookings,
    },
    recentBookings,
  });
});

module.exports = {
  findOrCreatePassenger,
  clerkBookTicket,
  clerkCancelTicket,
  getAllPassengerBookings,
  getClerkDashboardStats,
};