const jwt = require("jsonwebtoken");
const User = require("../models/User");

const protect = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;

    console.log("Auth header:", authHeader);

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.status(401).json({
        success: false,
        message: "Not authorized, token missing",
      });
    }

    const token = authHeader.split(" ")[1];

    console.log("Received token:", token);

    if (token === "fake-token") {
      const devUser = await User.findOne({ mobile: "9876543212" }).select("-__v");

      if (!devUser) {
        return res.status(401).json({
          success: false,
          message: "Development user not found. Run seed first.",
        });
      }

      req.user = devUser;
      return next();
    }

    if (token === "fake-admin-token") {
      const adminUser = await User.findOne({ mobile: "9876543210" }).select("-__v");

      if (!adminUser) {
        return res.status(401).json({
          success: false,
          message: "Admin development user not found. Run seed first.",
        });
      }

      req.user = adminUser;
      return next();
    }

    if (token === "fake-clerk-token") {
      const clerkUser = await User.findOne({ mobile: "9876543211" }).select("-__v");

      if (!clerkUser) {
        return res.status(401).json({
          success: false,
          message: "Clerk development user not found. Run seed first.",
        });
      }

      req.user = clerkUser;
      return next();
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    const user = await User.findById(decoded.id).select("-__v");
    if (!user) {
      return res.status(401).json({
        success: false,
        message: "User not found",
      });
    }

    req.user = user;
    next();
  } catch (error) {
    console.error("Auth middleware error:", error);
    return res.status(401).json({
      success: false,
      message: "Invalid or expired token",
    });
  }
};

module.exports = protect;