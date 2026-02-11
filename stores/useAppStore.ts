import { create } from "zustand";

interface User {
  id: string;
  email: string;
  name: string;
  role: string;
}

interface AppState {
  isLoading: boolean;
  setLoading: (loading: boolean) => void;
  isAuthenticated: boolean;
  user: User | null;
  setAuth: (user: User | null) => void;
  logout: () => void;
}

export const useAppStore = create<AppState>((set) => ({
  isLoading: false,
  setLoading: (loading) => set({ isLoading: loading }),
  isAuthenticated: typeof window !== "undefined" ? !!localStorage.getItem("access_token") : false,
  user: null,
  setAuth: (user) => {
    set({ user, isAuthenticated: user !== null });
    if (!user && typeof window !== "undefined") {
      localStorage.removeItem("access_token");
    }
  },
  logout: () => {
    if (typeof window !== "undefined") {
      localStorage.removeItem("access_token");
    }
    set({ user: null, isAuthenticated: false });
  },
}));
