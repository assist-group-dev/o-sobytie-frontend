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
  isFetchingProfile: boolean;
  fetchProfileError: boolean;
}

export const useCabinetStore = create<CabinetState>()(
  persist(
    (set, get) => ({
      userData: null,
      setUserData: (data) => set({ userData: data, fetchProfileError: false }),
      subscription: null,
      setSubscription: (subscription) => set({ subscription }),
      isFetchingProfile: false,
      fetchProfileError: false,
      fetchProfile: async () => {
        const state = get();
        if (state.isFetchingProfile || state.fetchProfileError) {
          return;
        }

        set({ isFetchingProfile: true, fetchProfileError: false });
        try {
          const response = await api.get<UserProfile>("/users/profile");
          set({ userData: response.data, isFetchingProfile: false, fetchProfileError: false });
        } catch (error) {
          console.error("Failed to fetch profile:", error);
          set({ isFetchingProfile: false, fetchProfileError: true });
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
