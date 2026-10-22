const Booking = require("../models/Booking");
const Train = require("../models/Train");
const asyncHandler = require("../utils/asyncHandler");
const { successResponse, errorResponse } = require("../utils/apiResponse");
const generatePNR = require("../services/pnrService");
const { hasEnoughSeats, reduceSeats, increaseSeats } = require("../services/seatService");
const { BOOKING_STATUS, PAYMENT_STATUS } = require("../config/constants");

const bookTicket = asyncHandler(async (req, res) => {
  const { trainId, passengerName, passengerAge, passengerGender, seatCount } = req.body;

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
    user: req.user._id,
    train: train._id,
    passengerName,
    passengerAge,
    passengerGender,
    seatCount,
    totalFare,
    pnr,
    bookingStatus: BOOKING_STATUS.CONFIRMED,
    paymentStatus: PAYMENT_STATUS.PENDING,
    bookedByClerk: false,
  });

  await reduceSeats(train, seatCount);

  const populatedBooking = await Booking.findById(booking._id)
    .populate("user", "name mobile role")
    .populate("train", "trainName trainNumber source destination departureTime arrivalTime journeyDate fare");

  return successResponse(res, "Ticket booked successfully. Complete payment to confirm.", populatedBooking, 201);
});

const cancelTicket = asyncHandler(async (req, res) => {
  const booking = await Booking.findById(req.params.id).populate("train");

  if (!booking) {
    return errorResponse(res, "Booking not found", 404);
  }

  if (booking.user.toString() !== req.user._id.toString()) {
    return errorResponse(res, "You can cancel only your own bookings", 403);
  }

  if (booking.bookingStatus === BOOKING_STATUS.CANCELLED) {
    return errorResponse(res, "Ticket already cancelled", 400);
  }

  booking.bookingStatus = BOOKING_STATUS.CANCELLED;
  await booking.save();

  const train = await Train.findById(booking.train._id);
  if (train) {
    await increaseSeats(train, booking.seatCount);
  }

  return successResponse(res, "Ticket cancelled successfully", booking);
});

const getMyBookings = asyncHandler(async (req, res) => {
  const bookings = await Booking.find({ user: req.user._id })
    .populate("train", "trainName trainNumber source destination departureTime arrivalTime journeyDate fare")
    .sort({ createdAt: -1 });

  return successResponse(res, "Bookings fetched successfully", bookings);
});

const getBookingByPNR = asyncHandler(async (req, res) => {
  const booking = await Booking.findOne({ pnr: req.params.pnr })
    .populate("user", "name mobile")
    .populate("train", "trainName trainNumber source destination departureTime arrivalTime journeyDate fare");

  if (!booking) {
    return errorResponse(res, "Booking not found for this PNR", 404);
  }

  return successResponse(res, "PNR status fetched successfully", booking);
});

const getBookingById = asyncHandler(async (req, res) => {
  const booking = await Booking.findById(req.params.id)
    .populate("user", "name mobile")
    .populate("train", "trainName trainNumber source destination departureTime arrivalTime journeyDate fare");

  if (!booking) {
    return errorResponse(res, "Booking not found", 404);
  }

  if (
    booking.user._id.toString() !== req.user._id.toString() &&
    req.user.role !== "admin" &&
    req.user.role !== "clerk"
  ) {
    return errorResponse(res, "Access denied", 403);
  }

  return successResponse(res, "Booking fetched successfully", booking);
});

module.exports = {
  bookTicket,
  cancelTicket,
  getMyBookings,
  getBookingByPNR,
  getBookingById,
};