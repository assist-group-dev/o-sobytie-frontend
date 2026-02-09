import axios, { AxiosInstance, AxiosError, InternalAxiosRequestConfig } from "axios";

const API_BASE_URL = process.env.NEXT_PUBLIC_BACKEND_URL ?? "http://localhost:8276";

export const api: AxiosInstance = axios.create({
  baseURL: `${API_BASE_URL}/api`,
  withCredentials: true,
  headers: {
    "Content-Type": "application/json",
  },
});

api.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    return config;
  },
  (error: AxiosError) => {
    return Promise.reject(error);
  }
);

api.interceptors.response.use(
  (response) => response,
  (error: AxiosError) => {
    if (error.response) {
      const status = error.response.status;
      const data = error.response.data as { message?: string; errors?: unknown };

      if (status === 401) {
        console.error("Unauthorized");
      } else if (status === 403) {
        console.error("Forbidden");
      } else if (status >= 500) {
        console.error("Server error");
      }

      return Promise.reject({
        status,
        message: data?.message ?? "An error occurred",
        errors: data?.errors,
      });
    }

    return Promise.reject({
      status: 0,
      message: "Network error",
    });
  }
);
