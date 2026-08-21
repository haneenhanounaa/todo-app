// src/api.js
import axios from "axios";

// عنوان الـ API — محلياً الآن، وعند النشر تغيّره لرابط Railway
const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || "http://localhost:8000/api",
  headers: {
    "Content-Type": "application/json",
    Accept: "application/json",
  },
});

// دوال التعامل مع المهام — كل واحدة تقابل عملية في الـ API
export const taskService = {
  getAll() {
    return api.get("/tasks");
  },
  create(title) {
    return api.post("/tasks", { title });
  },
  update(id, data) {
    return api.put(`/tasks/${id}`, data);
  },
  remove(id) {
    return api.delete(`/tasks/${id}`);
  },
};

export default api;
