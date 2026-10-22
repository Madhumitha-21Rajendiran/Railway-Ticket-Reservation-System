const Train = require("../models/Train");
const asyncHandler = require("../utils/asyncHandler");
const { successResponse, errorResponse } = require("../utils/apiResponse");

const searchTrains = asyncHandler(async (req, res) => {
  const { source, destination, date } = req.query;

  const query = {};

  if (source) query.source = new RegExp(`^${source}$`, "i");
  if (destination) query.destination = new RegExp(`^${destination}$`, "i");

  if (date) {
    const start = new Date(date);
    const end = new Date(date);
    end.setDate(end.getDate() + 1);

    query.journeyDate = { $gte: start, $lt: end };
  }

  const trains = await Train.find(query).sort({ journeyDate: 1 });

  return successResponse(res, "Trains fetched successfully", trains);
});

const getSeatAvailability = asyncHandler(async (req, res) => {
  const train = await Train.findById(req.params.id);

  if (!train) {
    return errorResponse(res, "Train not found", 404);
  }

  return successResponse(res, "Seat availability fetched", {
    trainId: train._id,
    trainNumber: train.trainNumber,
    trainName: train.trainName,
    availableSeats: train.availableSeats,
    fare: train.fare,
  });
});

module.exports = {
  searchTrains,
  getSeatAvailability,
};