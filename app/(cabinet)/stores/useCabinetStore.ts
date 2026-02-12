import { create } from "zustand";
import { persist } from "zustand/middleware";
import { api } from "@/utils/api";

export interface SubscriptionFromApi {
  id: string;
  duration: { id: string; name: string; months: number };
  premiumLevel: { id: string; name: string };
  status: string;
  startDate: string;
  nextPaymentDate: string;
  city: string;
  street: string;
  house: string;
  apartment: string;
  phone: string;
  deliveryDate: string;
  deliveryTime: string;
}

export interface QuestionnaireData {
  allergies?: string;
  dietaryRestrictions: string[];
  dietaryRestrictionsOther?: string;
  physicalLimitations: string[];
  physicalLimitationsOther?: string;
  fears: string[];
  fearsOther?: string;
  timePreference: string[];
  dayPreference: string[];
  additionalInfo?: string;
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
  questionnaireCompleted?: boolean;
  questionnaire?: QuestionnaireData | null;
  subscription?: SubscriptionFromApi | null;
  appliedPromos?: AppliedPromo[];
}

export interface AppliedPromo {
  code: string;
  discountPercent: number;
  durationId: string;
  promocodeId?: string;
}

interface CabinetState {
  userData: UserProfile | null;
  setUserData: (data: UserProfile | null) => void;
  subscription: SubscriptionFromApi | null;
  setSubscription: (subscription: SubscriptionFromApi | null) => void;
  appliedPromos: AppliedPromo[];
  setAppliedPromos: (promos: AppliedPromo[]) => void;
  addOrReplaceAppliedPromo: (promo: AppliedPromo) => void;
  removeAppliedPromoByDurationId: (durationId: string) => void;
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
      appliedPromos: [],
      setAppliedPromos: (promos) => set({ appliedPromos: promos }),
      addOrReplaceAppliedPromo: (promo) =>
        set((state) => ({
          appliedPromos: [...state.appliedPromos.filter((p) => p.durationId !== promo.durationId), promo],
        })),
      removeAppliedPromoByDurationId: (durationId) =>
        set((state) => ({ appliedPromos: state.appliedPromos.filter((p) => p.durationId !== durationId) })),
      isFetchingProfile: false,
      fetchProfileError: false,
      fetchProfile: async () => {
        const state = get();
        if (state.isFetchingProfile) {
          return;
        }

        if (state.fetchProfileError) {
          set({ fetchProfileError: false });
        }

        set({ isFetchingProfile: true, fetchProfileError: false });
        try {
          const response = await api.get<UserProfile & { subscription?: SubscriptionFromApi | null }>(
            "/users/profile"
          );
          const data = response.data;
          const userData: UserProfile = {
            id: data.id ?? (data as { _id?: string })._id ?? "",
            email: data.email ?? "",
            name: data.name ?? "",
            role: data.role ?? "",
            emailVerified: data.emailVerified ?? false,
            phone: data.phone,
            avatar: data.avatar,
            lastLogin: data.lastLogin,
            questionnaireCompleted: data.questionnaireCompleted ?? false,
            questionnaire: data.questionnaire ?? null,
            subscription: data.subscription ?? null,
            appliedPromos: data.appliedPromos ?? [],
          };
          set({
            userData,
            subscription: data.subscription ?? null,
            appliedPromos: data.appliedPromos ?? [],
            isFetchingProfile: false,
            fetchProfileError: false,
          });
        } catch (error) {
          console.error("Failed to fetch profile:", error);
          set({ isFetchingProfile: false, fetchProfileError: true });
          throw error;
        }
      },
      updateProfile: async (data) => {
        try {
          const response = await api.patch<UserProfile>("/users/profile", data);
          set({
            userData: response.data,
            appliedPromos: response.data.appliedPromos ?? [],
          });
        } catch (error) {
          console.error("Failed to update profile:", error);
          throw error;
        }
      },
    }),
    {
      name: "cabinet-storage",
      partialize: (state) => ({
        userData: state.userData,
        subscription: state.subscription,
        appliedPromos: state.appliedPromos,
      }),
    }
  )
);
