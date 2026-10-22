const dotenv = require("dotenv");
const mongoose = require("mongoose");

dotenv.config();

const connectDB = require("../config/db");
const User = require("../models/User");
const Train = require("../models/Train");
const Booking = require("../models/Booking");
const Payment = require("../models/Payment");

const sampleUsers = [
  {
    name: "Admin User",
    mobile: "9876543210",
    role: "admin",
    isVerified: true,
  },
  {
    name: "Clerk User",
    mobile: "9876543211",
    role: "clerk",
    isVerified: true,
  },
  {
    name: "YourName",
    mobile: "9876543212",
    role: "passenger",
    isVerified: true,
  },
  {
    name: "Madhumitha",
    mobile: "9876543213",
    role: "passenger",
    isVerified: true,
  },
];

const sampleTrains = [
  {
    trainNumber: "12637",
    trainName: "Pandian Express",
    source: "Chennai",
    destination: "Madurai",
    departureTime: "21:40",
    arrivalTime: "06:35",
    journeyDate: new Date("2026-04-10"),
    totalSeats: 120,
    availableSeats: 118,
    fare: 560,
  },
  {
    trainNumber: "12623",
    trainName: "Chennai Mail",
    source: "Chennai",
    destination: "Coimbatore",
    departureTime: "22:15",
    arrivalTime: "07:10",
    journeyDate: new Date("2026-04-10"),
    totalSeats: 150,
    availableSeats: 145,
    fare: 640,
  },
  {
    trainNumber: "16127",
    trainName: "Guruvayur Express",
    source: "Chennai",
    destination: "Tiruchirappalli",
    departureTime: "08:25",
    arrivalTime: "14:55",
    journeyDate: new Date("2026-04-11"),
    totalSeats: 100,
    availableSeats: 96,
    fare: 350,
  },
  {
    trainNumber: "22671",
    trainName: "Tejas Express",
    source: "Madurai",
    destination: "Chennai",
    departureTime: "06:00",
    arrivalTime: "13:10",
    journeyDate: new Date("2026-04-12"),
    totalSeats: 90,
    availableSeats: 90,
    fare: 890,
  },
  {
    trainNumber: "12674",
    trainName: "Cheran Express",
    source: "Coimbatore",
    destination: "Chennai",
    departureTime: "22:50",
    arrivalTime: "06:45",
    journeyDate: new Date("2026-04-12"),
    totalSeats: 130,
    availableSeats: 130,
    fare: 610,
  },
];

const runSeed = async () => {
  try {
    await connectDB();

    await Payment.deleteMany();
    await Booking.deleteMany();
    await Train.deleteMany();
    await User.deleteMany();

    const users = await User.insertMany(sampleUsers);
    const trains = await Train.insertMany(sampleTrains);

    const passenger1 = users.find((u) => u.mobile === "9876543212");
    const passenger2 = users.find((u) => u.mobile === "9876543213");

    const booking1 = await Booking.create({
      user: passenger1._id,
      train: trains[0]._id,
      passengerName: "Sanjay",
      passengerAge: 22,
      passengerGender: "male",
      seatCount: 2,
      totalFare: 1120,
      pnr: "PNR2604101001",
      bookingStatus: "confirmed",
      paymentStatus: "success",
      bookedByClerk: false,
    });

    const booking2 = await Booking.create({
      user: passenger2._id,
      train: trains[1]._id,
      passengerName: "Madhumitha",
      passengerAge: 21,
      passengerGender: "female",
      seatCount: 1,
      totalFare: 640,
      pnr: "PNR2604101002",
      bookingStatus: "confirmed",
      paymentStatus: "success",
      bookedByClerk: true,
    });

    await Payment.create({
      booking: booking1._id,
      amount: 1120,
      method: "card",
      transactionId: "TXN2604101001",
      status: "success",
    });

    await Payment.create({
      booking: booking2._id,
      amount: 640,
      method: "net_banking",
      transactionId: "TXN2604101002",
      status: "success",
    });

    console.log("Seed data inserted successfully");
    console.log("Admin Login Mobile: 9876543210");
    console.log("Clerk Login Mobile: 9876543211");
    console.log("Passenger Login Mobile: 9876543212");
    console.log("Passenger Login Mobile: 9876543213");

    await mongoose.connection.close();
    process.exit(0);
  } catch (error) {
    console.error("Seed failed:", error);
    await mongoose.connection.close();
    process.exit(1);
  }
};

runSeed();