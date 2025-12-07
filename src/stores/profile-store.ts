import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { ProfileFormSchemaType } from '@/app/(main)/profile/profile-schema';

export type ProfileFormData = ProfileFormSchemaType;
export type ParentItem = ProfileFormData['parents'][number];
export type BreedingAnimalItem = ProfileFormData['animals'][number];

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
      name: 'profile-storage',
      partialize: (state) => {
        if (!state.profileData) return state;

        // 이미지 관련 데이터 제외 (localStorage 용량 제한 방지)
        const sanitizedData: ProfileFormData = {
          ...state.profileData,
          // representativePhotos에서 File 객체 제외, URL 문자열만 유지
          representativePhotos: state.profileData.representativePhotos.filter(
            (photo): photo is string => typeof photo === 'string',
          ),
          // parents에서 imageFile, imagePreview 제외
          parents: state.profileData.parents.map((parent) => ({
            ...parent,
            imageFile: undefined,
            imagePreview: undefined,
          })),
          // animals에서 imageFile, imagePreview 제외
          animals: state.profileData.animals.map((animal) => ({
            ...animal,
            imageFile: undefined,
            imagePreview: undefined,
          })),
        };

        return { ...state, profileData: sanitizedData };
      },
    },
  ),
);
