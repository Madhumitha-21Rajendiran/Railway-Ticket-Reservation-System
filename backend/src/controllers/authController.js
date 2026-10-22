const User = require("../models/User");
const generateToken = require("../utils/generateToken");
const asyncHandler = require("../utils/asyncHandler");
const { successResponse, errorResponse } = require("../utils/apiResponse");
const getFirebaseAdmin = require("../config/firebaseAdmin");

const firebaseLogin = asyncHandler(async (req, res) => {
  const { firebaseIdToken, name } = req.body;

  if (!firebaseIdToken) {
    return errorResponse(res, "Firebase ID token is required", 400);
  }

  try {
    const admin = getFirebaseAdmin();
    const decodedToken = await admin.auth().verifyIdToken(firebaseIdToken);

    const phoneNumber = decodedToken.phone_number;
    const firebaseUid = decodedToken.uid;

    if (!phoneNumber) {
      return errorResponse(res, "Verified Firebase token does not contain phone number", 400);
    }

    const mobile = phoneNumber.replace(/^\+91/, "");

    let user = await User.findOne({ mobile });

    if (!user) {
      user = await User.create({
        name: name || "Passenger",
        mobile,
        role: "passenger",
        isVerified: true,
        firebaseUid,
      });
    } else {
      user.isVerified = true;
      if (name && !user.name) user.name = name;
      if (!user.firebaseUid) user.firebaseUid = firebaseUid;
      await user.save();
    }

    const token = generateToken({
      id: user._id,
      role: user.role,
    });

    return successResponse(res, "Firebase login successful", {
      token,
      user,
    });
  } catch (error) {
    console.error("Firebase token verification failed:", error);
    return errorResponse(res, "Invalid Firebase token", 401);
  }
});

const getProfile = asyncHandler(async (req, res) => {
  return successResponse(res, "Profile fetched successfully", req.user);
});

module.exports = {
  firebaseLogin,
  getProfile,
};