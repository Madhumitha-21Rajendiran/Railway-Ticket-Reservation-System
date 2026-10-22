const { body } = require("express-validator");

const createTrainValidation = [
  body("trainNumber").notEmpty().withMessage("Train number is required"),
  body("trainName").notEmpty().withMessage("Train name is required"),
  body("source").notEmpty().withMessage("Source is required"),
  body("destination").notEmpty().withMessage("Destination is required"),
  body("departureTime").notEmpty().withMessage("Departure time is required"),
  body("arrivalTime").notEmpty().withMessage("Arrival time is required"),
  body("journeyDate").notEmpty().withMessage("Journey date is required"),
  body("totalSeats").isInt({ min: 1 }).withMessage("Total seats must be at least 1"),
  body("availableSeats").isInt({ min: 0 }).withMessage("Available seats must be 0 or more"),
  body("fare").isFloat({ min: 0 }).withMessage("Fare must be valid"),
];

module.exports = {
  createTrainValidation,
};