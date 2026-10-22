import api from "./api";

export const createRazorpayOrderApi = async (payload) => {
  const res = await api.post("/payments/create-order", payload);
  return res.data;
};

export const verifyRazorpayPaymentApi = async (payload) => {
  const res = await api.post("/payments/verify", payload);
  return res.data;
};