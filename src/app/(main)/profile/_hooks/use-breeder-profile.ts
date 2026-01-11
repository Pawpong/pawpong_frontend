'use client';

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import {
  getBreederProfile,
  updateBreederProfile,
  addParentPet,
  updateParentPet,
  deleteParentPet,
  addAvailablePet,
  updateAvailablePet,
  deleteAvailablePet,
  type ProfileUpdateRequest,
  type ParentPetAddRequest,
  type AvailablePetAddRequest,
} from '@/api/breeder-management';

/**
 * 브리더 프로필 조회 훅
 */
export function useBreederProfile() {
  return useQuery({
    queryKey: ['breeder-profile'],
    queryFn: () => getBreederProfile(),
    staleTime: 1000 * 60 * 5, // 5분
  });
}

/**
 * 브리더 프로필 업데이트 훅
 */
export function useUpdateBreederProfile(options?: { invalidateOnSuccess?: boolean }) {
  const queryClient = useQueryClient();
  const invalidateOnSuccess = options?.invalidateOnSuccess ?? true;

  return useMutation({
    mutationFn: (data: ProfileUpdateRequest) => updateBreederProfile(data),
    onSuccess: () => {
      if (invalidateOnSuccess) {
        queryClient.invalidateQueries({ queryKey: ['breeder-profile'] });
      }
    },
  });
}

/**
 * 부모 반려동물 추가 훅
 */
export function useAddParentPet() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: ParentPetAddRequest) => addParentPet(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['breeder-profile'] });
    },
  });
}

/**
 * 부모 반려동물 수정 훅
 */
export function useUpdateParentPet() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ petId, data }: { petId: string; data: Partial<ParentPetAddRequest> }) =>
      updateParentPet(petId, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['breeder-profile'] });
    },
  });
}

/**
 * 부모 반려동물 삭제 훅
 */
export function useDeleteParentPet() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (petId: string) => deleteParentPet(petId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['breeder-profile'] });
    },
  });
}

/**
 * 분양 가능 반려동물 추가 훅
 */
export function useAddAvailablePet() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: AvailablePetAddRequest) => addAvailablePet(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['breeder-profile'] });
    },
  });
}

/**
 * 분양 가능 반려동물 수정 훅
 */
export function useUpdateAvailablePet() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ petId, data }: { petId: string; data: Partial<AvailablePetAddRequest> }) =>
      updateAvailablePet(petId, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['breeder-profile'] });
    },
  });
}

/**
 * 분양 가능 반려동물 삭제 훅
 */
export function useDeleteAvailablePet() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (petId: string) => deleteAvailablePet(petId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['breeder-profile'] });
    },
  });
}
