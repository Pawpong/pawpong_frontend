import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { ProfileFormSchemaType } from "@/app/(main)/profile/profile-schema";

export type ProfileFormData = ProfileFormSchemaType;
export type ParentItem = ProfileFormData["parents"][number];
export type BreedingAnimalItem = ProfileFormData["animals"][number];

interface ProfileStore {
  profileData: ProfileFormData | null;
  setProfileData: (data: ProfileFormData) => void;
  clearProfileData: () => void;
}

export const useProfileStore = create<ProfileStore>()(
  persist(
    (set) => ({
      profileData: null,
      setProfileData: (data) => set({ profileData: data }),
      clearProfileData: () => set({ profileData: null }),
    }),
    {
      name: "profile-storage",
    }
  )
);
