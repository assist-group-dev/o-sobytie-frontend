import { create } from "zustand";

interface CabinetState {
  userData: Record<string, unknown> | null;
  setUserData: (data: Record<string, unknown> | null) => void;
}

export const useCabinetStore = create<CabinetState>((set) => ({
  userData: null,
  setUserData: (data) => set({ userData: data }),
}));
