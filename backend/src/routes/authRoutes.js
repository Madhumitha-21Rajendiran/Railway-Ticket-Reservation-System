const express = require("express");
const router = express.Router();

const { firebaseLogin, getProfile } = require("../controllers/authController");
const protect = require("../middleware/authMiddleware");

router.post("/firebase-login", firebaseLogin);
router.get("/profile", protect, getProfile);

module.exports = router;