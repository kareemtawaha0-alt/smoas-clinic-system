import { api } from "./api.js";

export const invoiceService = {
  async list(params) {
    const { data } = await api.get("/invoices", { params });
    return data;
  },
  async generate(payload) {
    const { data } = await api.post("/invoices/generate", payload);
    return data;
  },
  async pay(id, amount) {
    const { data } = await api.post(`/invoices/${id}/pay`, { amount });
    return data;
  }
};
