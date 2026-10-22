import api from "./api";

export const getClerkDashboardApi = async () => {
  const res = await api.get("/clerk/dashboard");
  return res.data;
};

export const findOrCreatePassengerApi = async (payload) => {
  const res = await api.post("/clerk/find-or-create-passenger", payload);
  return res.data;
};

export const clerkBookTicketApi = async (payload) => {
  const res = await api.post("/clerk/book", payload);
  return res.data;
};

export const getClerkBookingsApi = async (mobile = "") => {
  const res = await api.get("/clerk/bookings", {
    params: mobile ? { mobile } : {},
  });
  return res.data;
};

export const clerkCancelTicketApi = async (id) => {
  const res = await api.put(`/clerk/cancel/${id}`);
  return res.data;
};