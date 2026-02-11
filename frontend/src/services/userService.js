import { api } from "./api.js";

export const userService = {
  async list(role) {
    const { data } = await api.get("/users", { params: { role } });
    return data;
  }
};
