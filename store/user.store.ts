import { create } from "zustand";

interface UserStore {
  currency: string;
  setCurrency: (currency: string) => void;
  needsOnboarding: boolean | null;
  setNeedsOnboarding: (needsOnboarding: boolean | null) => void;
}

export const useUserStore = create<UserStore>((set) => ({
  currency: "INR",
  setCurrency: (currency: string) => set({ currency }),
  needsOnboarding: null,
  setNeedsOnboarding: (needsOnboarding: boolean | null) =>
    set({ needsOnboarding }),
}));
