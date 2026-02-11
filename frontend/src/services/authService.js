import { api } from "./api.js";

export const authService = {
  async login({ email, password }) {
    const { data } = await api.post("/auth/login", { email, password });
    return data;
  }
};
