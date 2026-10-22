const crypto = require("crypto");

const verifyRazorpaySignature = ({
  orderId,
  razorpayPaymentId,
  razorpaySignature,
  secret,
}) => {
  const body = `${orderId}|${razorpayPaymentId}`;

  const expectedSignature = crypto
    .createHmac("sha256", secret)
    .update(body.toString())
    .digest("hex");

  return expectedSignature === razorpaySignature;
};

module.exports = {
  verifyRazorpaySignature,
};