import api from "./api";

export const getAdminDashboardApi = async () => {
  const res = await api.get("/admin/dashboard");
  return res.data;
};

export const getAdminTrainsApi = async () => {
  const res = await api.get("/admin/trains");
  return res.data;
};

export const addTrainApi = async (payload) => {
  const res = await api.post("/admin/trains", payload);
  return res.data;
};

export const updateTrainApi = async (id, payload) => {
  const res = await api.put(`/admin/trains/${id}`, payload);
  return res.data;
};

export const deleteTrainApi = async (id) => {
  const res = await api.delete(`/admin/trains/${id}`);
  return res.data;
};

export const getAdminUsersApi = async () => {
  const res = await api.get("/admin/users");
  return res.data;
};

export const getAdminBookingsApi = async () => {
  const res = await api.get("/admin/bookings");
  return res.data;
};