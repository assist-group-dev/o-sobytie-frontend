import { create } from "zustand";
import { persist } from "zustand/middleware";
import { api } from "@/utils/api";

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

interface UserProfile {
  id: string;
  email: string;
  name: string;
  role: string;
  emailVerified: boolean;
  phone?: string;
  avatar?: string;
  lastLogin?: Date;
}

interface CabinetState {
  userData: UserProfile | null;
  setUserData: (data: UserProfile | null) => void;
  subscription: Subscription | null;
  setSubscription: (subscription: Subscription | null) => void;
  fetchProfile: () => Promise<void>;
  updateProfile: (data: { name?: string; phone?: string; avatar?: string }) => Promise<void>;
}

export const useCabinetStore = create<CabinetState>()(
  persist(
    (set, get) => ({
      userData: null,
      setUserData: (data) => set({ userData: data }),
      subscription: null,
      setSubscription: (subscription) => set({ subscription }),
      fetchProfile: async () => {
        try {
          const response = await api.get<UserProfile>("/users/profile");
          set({ userData: response.data });
        } catch (error) {
          console.error("Failed to fetch profile:", error);
          throw error;
        }
      },
      updateProfile: async (data) => {
        try {
          const response = await api.patch<UserProfile>("/users/profile", data);
          set({ userData: response.data });
        } catch (error) {
          console.error("Failed to update profile:", error);
          throw error;
        }
      },
    }),
    {
      name: "cabinet-storage",
    }
  )
);
