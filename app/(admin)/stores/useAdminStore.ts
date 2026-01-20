import { create } from "zustand";

interface AdminState {
  selectedItems: string[];
  setSelectedItems: (items: string[]) => void;
}

export const useAdminStore = create<AdminState>((set) => ({
  selectedItems: [],
  setSelectedItems: (items) => set({ selectedItems: items }),
}));
