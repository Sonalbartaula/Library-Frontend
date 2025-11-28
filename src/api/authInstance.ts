import axios from "axios";
import { setupAuthInterceptor } from "./interceptors/authInterceptor";

const api = axios.create({
  baseURL: "https://localhost:7281/api",
  withCredentials: false,
  timeout: 15000,
});

// Attach Interceptors
setupAuthInterceptor(api);

export default api;
