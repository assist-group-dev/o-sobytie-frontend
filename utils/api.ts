import axios, { AxiosInstance, AxiosError, InternalAxiosRequestConfig } from "axios";
import { getApiBaseUrl } from "./backend";

export const api: AxiosInstance = axios.create({
  baseURL: getApiBaseUrl(),
  withCredentials: true,
  headers: {
    "Content-Type": "application/json",
  },
});

api.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    config.baseURL = getApiBaseUrl();
    
    if (typeof window !== "undefined") {
      const token = localStorage.getItem("access_token");
      if (token && !config.headers.Authorization) {
        config.headers.Authorization = `Bearer ${token}`;
      }
    }
    
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
        if (typeof window !== "undefined") {
          const pathname = window.location.pathname;
          if (pathname.startsWith("/admin")) {
            console.log("[API Interceptor] 401 on admin route, redirecting to /");
            window.location.href = "/";
          }
        }
      } else if (status === 403) {
        console.error("Forbidden");
        if (typeof window !== "undefined") {
          const pathname = window.location.pathname;
          if (pathname.startsWith("/admin")) {
            console.log("[API Interceptor] 403 on admin route, redirecting to /");
            window.location.href = "/";
          }
        }
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
