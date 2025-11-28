import type { AxiosInstance } from "axios";


export const setupAuthInterceptor = (api: AxiosInstance) => {
  // REQUEST INTERCEPTOR
  api.interceptors.request.use(
    (config) => {
      const token = localStorage.getItem("token");

      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }

      return config;
    },
    (error) => Promise.reject(error)
  );

  // RESPONSE INTERCEPTOR
  api.interceptors.response.use(
    (response) => response,
    (error) => {
      if (error.response && error.response.status === 401) {
        // SESSION OUT / TOKEN EXPIRED
        localStorage.removeItem("token");
        window.location.href = "/login";
      }

      return Promise.reject(error);
    }
  );
};
