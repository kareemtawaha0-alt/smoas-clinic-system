import axios from "axios";

export const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || "http://localhost:5000/api",
  timeout: 20000
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem("smoas_token");
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});
