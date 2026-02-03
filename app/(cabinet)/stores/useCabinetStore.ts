import { create } from "zustand";
import { persist } from "zustand/middleware";

interface Subscription {
  title: string;
  duration: string;
  tariff: string;
  deliveryDate: string;
  deliveryTime: string;
  premiumLevel: string;
  city: string;
  street: string;
  house: string;
  apartment: string;
  phone: string;
}

interface CabinetState {
  userData: Record<string, unknown> | null;
  setUserData: (data: Record<string, unknown> | null) => void;
  subscription: Subscription | null;
  setSubscription: (subscription: Subscription | null) => void;
}

export const useCabinetStore = create<CabinetState>()(
  persist(
    (set) => ({
      userData: null,
      setUserData: (data) => set({ userData: data }),
      subscription: null,
      setSubscription: (subscription) => set({ subscription }),
    }),
    {
      name: "cabinet-storage",
    }
  )
);
