import { create } from "zustand";
import { persist } from "zustand/middleware";

export interface ParentItem {
  id: string;
  name: string;
  birthDate: string;
  breed: string[];
  gender: "male" | "female" | null;
  imagePreview?: string;
  imageFile?: File;
}

export interface BreedingAnimalItem {
  id: string;
  name: string;
  birthDate: string;
  breed: string[];
  gender: "male" | "female" | null;
  imagePreview?: string;
  imageFile?: File;
  description: string;
  adoptionStatus: string;
  parent: string;
  price: string;
  isCounselMode: boolean;
}

export interface ProfileFormData {
  // 프로필 기본 정보
  breederName: string;
  description: string;
  location: string | null;
  breeds: string[];
  representativePhotos: File[] | string[]; // File 객체 또는 이미지 URL
  minPrice: string;
  maxPrice: string;
  isCounselMode: boolean;

  // 부모 정보
  parents: ParentItem[];

  // 분양 중인 아이
  animals: BreedingAnimalItem[];
}

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
