import { api } from "./api.js";

export const patientService = {
  async list({ q = "", page = 1, limit = 10 }) {
    const { data } = await api.get("/patients", { params: { q, page, limit } });
    return data;
  },
  async create(payload) {
    const { data } = await api.post("/patients", payload);
    return data;
  },
  async update(id, payload) {
    const { data } = await api.put(`/patients/${id}`, payload);
    return data;
  },
  async remove(id) {
    const { data } = await api.delete(`/patients/${id}`);
    return data;
  }
};
