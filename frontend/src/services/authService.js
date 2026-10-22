import api from "./api";

export const firebaseLoginApi = async (payload) => {
  const res = await api.post("/auth/firebase-login", payload);
  return res.data;
};

export const getProfileApi = async () => {
  const res = await api.get("/auth/profile");
  return res.data;
};