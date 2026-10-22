const express = require("express");
const router = express.Router();

const { searchTrains, getSeatAvailability } = require("../controllers/trainController");

router.get("/search", searchTrains);
router.get("/:id/availability", getSeatAvailability);

module.exports = router;