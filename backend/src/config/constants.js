const ROLES = {
  PASSENGER: "passenger",
  CLERK: "clerk",
  ADMIN: "admin",
};

const BOOKING_STATUS = {
  CONFIRMED: "confirmed",
  CANCELLED: "cancelled",
};

const PAYMENT_STATUS = {
  PENDING: "pending",
  SUCCESS: "success",
  FAILED: "failed",
};

const PAYMENT_METHODS = {
  CARD: "card",
  NET_BANKING: "net_banking",
};

module.exports = {
  ROLES,
  BOOKING_STATUS,
  PAYMENT_STATUS,
  PAYMENT_METHODS,
};