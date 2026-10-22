import api from "./api";

export const createBookingApi = async (payload) => {
  const res = await api.post("/bookings", payload);
  return res.data;
};

export const getMyBookingsApi = async () => {
  const res = await api.get("/bookings/my");
  return res.data;
};

export const cancelBookingApi = async (id) => {
  const res = await api.put(`/bookings/${id}/cancel`);
  return res.data;
};

export const getPnrStatusApi = async (pnr) => {
  const res = await api.get(`/bookings/pnr/${pnr}`);
  return res.data;
};

export const getBookingByIdApi = async (id) => {
  const res = await api.get(`/bookings/${id}`);
  return res.data;
};