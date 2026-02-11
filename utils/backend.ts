export const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL ?? "http://localhost:8276";

export const getApiBaseUrl = (): string => {
  if (typeof window !== "undefined") {
    const isLocalhost = window.location.hostname === "localhost" || 
                       window.location.hostname === "127.0.0.1" ||
                       window.location.hostname.startsWith("192.168.");
    
    if (isLocalhost) {
      if (process.env.NEXT_PUBLIC_BACKEND_URL) {
        const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL;
        const isProductionBackend = backendUrl.includes("osobytie.ru") || backendUrl.includes("https://");
        if (isProductionBackend) {
          return `${backendUrl}/api`;
        }
        return `${backendUrl}/api/v1`;
      }
      return "http://localhost:8276/api/v1";
    }
    
    return "/api";
  }
  
  if (process.env.NEXT_PUBLIC_BACKEND_URL) {
    const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL;
    const isProductionBackend = backendUrl.includes("osobytie.ru") || backendUrl.includes("https://");
    if (isProductionBackend) {
      return `${backendUrl}/api`;
    }
    return `${backendUrl}/api/v1`;
  }
  
  return "/api";
};

export const API_BASE_URL = getApiBaseUrl();

export async function fetchWithAuth(
  url: string,
  options: RequestInit = {}
): Promise<Response> {
  const headers: Record<string, string> = {
    ...(options.headers as Record<string, string>),
  };
  if (!(options.body instanceof FormData)) {
    headers["Content-Type"] = "application/json";
  }
  if (typeof window !== "undefined") {
    const token = localStorage.getItem("access_token");
    if (token) {
      headers.Authorization = `Bearer ${token}`;
    }
  }

  return fetch(url, {
    ...options,
    credentials: "include",
    headers,
  });
}
