import api from "./api";

export const searchTrainsApi = async (params) => {
  const res = await api.get("/trains/search", { params });
  return res.data;
};

export const getAvailabilityApi = async (id) => {
  const res = await api.get(`/trains/${id}/availability`);
  return res.data;
};