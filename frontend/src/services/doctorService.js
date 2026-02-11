import { api } from "./api.js";

export const doctorService = {
  async list() {
    const { data } = await api.get("/users", { params: { role: "doctor" } });
    return data;
  },
  async create(payload) {
    const { data } = await api.post("/admin/doctors", payload);
    return data;
  }
};
