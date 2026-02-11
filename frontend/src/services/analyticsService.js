import { api } from "./api.js";

export const analyticsService = {
  async dashboard(role, params) {
    const { data } = await api.get(`/analytics/${role}`, { params });
    return data;
  }
};
