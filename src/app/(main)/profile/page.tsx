'use client';
import { Button } from '@/components/ui/button';
import { useBreakpoint } from '@/hooks/use-breakpoint';
import { useMemo, useEffect, useRef, useState } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import { useRouter } from 'next/navigation';
import { useToast } from '@/hooks/use-toast';
import { useForm, FormProvider, type Resolver } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useProfileStore, type ProfileFormData } from '@/stores/profile-store';
import { profileFormSchema } from './profile-schema';
import { useWatch } from 'react-hook-form';
import {
  isFormEmpty,
  validateParents,
  validateAnimals,
  setFormErrors,
  scrollToFirstError,
  isParentEmpty,
  isAnimalEmpty,
} from '@/utils/profile-validation';
import { useBreederProfile, useUpdateBreederProfile } from './_hooks/use-breeder-profile';
import { syncParentPets, syncAvailablePets } from '@/utils/profile-sync';
import { uploadSingleFile, uploadRepresentativePhotos } from '@/api/upload';
import useFormGuard from '@/hooks/use-form-guard';
import useBrowserNavigationGuard from '@/hooks/use-browser-navigation-guard';
import { isVideoUrl } from '@/utils/video-thumbnail';
import { dynamicClient } from '@/utils/dynamic-client';

const ProfileBasicInfo = dynamicClient(() => import('./_components/profile-basic-info'));

const ParentsInfo = dynamicClient(() => import('./_components/parents-info'));

const BreedingAnimals = dynamicClient(() => import('./_components/breeding-animals'));

const ProfileBannerCarousel = dynamicClient(() => import('@/components/profile-banner/profile-banner-carousel'));

const ExitConfirmDialog = dynamicClient(() => import('@/components/exit-confirmation-dialog'));

type BreederProfileApi = {
  breederId?: string;
  breederName?: string;
  breeds?: string[];
  profileImageFileName?: string | null;
  petType?: 'dog' | 'cat';
  specialization?: string[];
  specializationTypes?: string[];
  verificationInfo?: {
    plan?: string;
  };
  profileInfo?: {
    profileDescription?: string;
    description?: string;
    location?: { city: string; district: string };
    representativePhotos?: string[];
    priceRange?: { min?: number; max?: number; display?: string };
    specialization?: string[];
    specializationAreas?: string[];
  };
  parentPetInfo?: Array<{
    petId?: string;
    _id?: string;
    name?: string;
    birthDate?: string | Date;
    breed?: string;
    gender?: 'male' | 'female';
    photoFileName?: string;
    photoUrl?: string;
    description?: string;
    photos?: string[];
  }>;
  availablePetInfo?: Array<{
    petId?: string;
    _id?: string;
    name?: string;
    birthDate?: string | Date;
    breed?: string;
    gender?: 'male' | 'female';
    description?: string;
    status?: string;
    parentInfo?: { mother?: string; father?: string };
    price?: number;
    mainPhoto?: string;
    photos?: string[];
  }>;
};

const normalizePhotoPath = (value: string | undefined): string => {
  if (!value) return '';
  try {
    const url = new URL(value);
    return url.pathname.replace(/^\/+/, '');
  } catch {
    return value.replace(/^\/+/, '');
  }
};

const photoBasename = (value: string | undefined): string => {
  const normalized = normalizePhotoPath(value);
  if (!normalized) return '';
  const parts = normalized.split('/');
  return parts[parts.length - 1] || '';
};

const isSamePhoto = (a: string | undefined, b: string | undefined): boolean => {
  if (!a || !b) return false;
  if (a === b) return true;
  const aPath = normalizePhotoPath(a);
  const bPath = normalizePhotoPath(b);
  if (aPath && bPath && aPath === bPath) return true;
  const aBase = photoBasename(a);
  const bBase = photoBasename(b);
  return !!aBase && !!bBase && aBase === bBase;
};

export default function ProfilePage() {
  const isLgUp = useBreakpoint('lg');
  const router = useRouter();
  const { toast } = useToast();
  const { setProfileData } = useProfileStore();
  const queryClient = useQueryClient();
  const { data: apiProfileData, isLoading } = useBreederProfile();
  // 부모/분양 sync 이전에 프로필 쿼리가 refetch 되면서 구데이터로 form.reset 되는 레이스 방지
  const updateProfileMutation = useUpdateBreederProfile({ invalidateOnSuccess: false });

  // 프로필 이미지 상태
  const [profileImageFile, setProfileImageFile] = useState<File | null>(null);
  const [profileImagePreview, setProfileImagePreview] = useState<string>('');
  const [profileImageRemoved, setProfileImageRemoved] = useState<boolean>(false);

  // 원본 API 데이터를 저장 (변경사항 비교용)
  const originalDataRef = useRef<BreederProfileApi | null>(null);
  // 저장 직후 refetch가 구데이터를 잠깐 내려줄 수 있어, 소개글이 즉시 되돌아가는 현상 방지용
  const lastSavedDescriptionRef = useRef<string | null>(null);
  const lastSavedAtRef = useRef<number>(0);

  const defaultParentId = useMemo(() => `parent-default-${Date.now()}`, []);
  const defaultAnimalId = useMemo(() => `animal-default-${Date.now()}`, []);

  const resolver = zodResolver(profileFormSchema) as Resolver<ProfileFormData>;

  const form = useForm<ProfileFormData>({
    resolver,
    defaultValues: {
      breederName: '',
      description: '',
      location: '',
      breeds: [],
      representativePhotos: [],
      minPrice: '',
      maxPrice: '',
      isCounselMode: false,
      parents: [
        {
          id: defaultParentId,
          name: '',
          birthDate: '',
          breed: [],
          gender: null,
          description: '',
          photos: [],
        },
      ],
      animals: [
        {
          id: defaultAnimalId,
          name: '',
          birthDate: '',
          breed: [],
          gender: null,
          description: '',
          adoptionStatus: '',
          motherId: '',
          fatherId: '',
          price: '',
          isCounselMode: false,
          // photos: [],
        },
      ],
    },
    mode: 'onBlur',
  });

  // 날짜 형식 변환: ISO/Date → YYYYMMDD
  const formatDateToYYYYMMDD = (dateValue: string | Date | undefined): string => {
    if (!dateValue) return '';
    const date = typeof dateValue === 'string' ? new Date(dateValue) : dateValue;
    if (isNaN(date.getTime())) return '';
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}${month}${day}`;
  };

  // 입양 상태 변환: 영어 → 한글
  const convertStatusToKorean = (status: string): string => {
    const statusMap: Record<string, string> = {
      available: '입양 가능',
      reserved: '입양 예정',
      adopted: '입양 완료',
    };
    return statusMap[status] || status;
  };

  // API 데이터로 폼 초기화 (항상 API 데이터 우선)
  useEffect(() => {
    if (apiProfileData) {
      const typedProfile = apiProfileData as BreederProfileApi;
      // 원본 데이터 저장
      originalDataRef.current = typedProfile;

      // 프로필 이미지 초기화
      if (typedProfile.profileImageFileName) {
        setProfileImagePreview(typedProfile.profileImageFileName);
        setProfileImageRemoved(false);
        setProfileImageFile(null);
      } else {
        setProfileImagePreview('');
        setProfileImageRemoved(false);
        setProfileImageFile(null);
      }

      const locationParts = typedProfile.profileInfo?.location;
      const locationString = locationParts ? `${locationParts.city} ${locationParts.district}` : '';
      const priceRange = typedProfile.profileInfo?.priceRange;
      const apiMinPrice = priceRange?.min;
      const apiMaxPrice = priceRange?.max;
      const apiDisplay = priceRange?.display;

      // 가격 상태 구분 (display 필드 우선):
      // - display: 'consultation' -> 상담 후 공개 모드
      // - display: 'not_set' -> 가격 미설정
      // - display: 'range' -> 실제 가격 범위
      // - display 없고 min/max가 0,0 -> 가격 미설정 (legacy)
      const isCounselPrice = apiDisplay === 'consultation';

      // 부모 pet ID를 petId에서 추출 (백엔드에서 petId로 변환됨)
      const parentsData: ProfileFormData['parents'] =
        typedProfile.parentPetInfo?.length && typedProfile.parentPetInfo.length > 0
          ? typedProfile.parentPetInfo.map((pet) => {
              const representativePhoto = pet.photoFileName || pet.photoUrl || pet.photos?.[0];
              // 백엔드가 API 응답 시 이미 대표사진을 제거하고 반환하므로
              // photos 배열을 그대로 사용 (추가사진만 포함되어 있음)
              const additionalPhotos = pet.photos || [];

              return {
                id: pet.petId || pet._id?.toString() || defaultParentId,
                name: pet.name || '',
                birthDate: formatDateToYYYYMMDD(pet.birthDate),
                breed: pet.breed ? [pet.breed] : [],
                gender: pet.gender || null,
                imagePreview: representativePhoto || undefined,
                isVideo: representativePhoto ? isVideoUrl(representativePhoto) : undefined,
                description: pet.description || '',
                photos: additionalPhotos,
              };
            })
          : [
              {
                id: defaultParentId,
                name: '',
                birthDate: '',
                breed: [],
                gender: null,
                description: '',
                photos: [],
              },
            ];

      // 부모 ID 매핑 생성 (animal에서 부모 찾을 때 사용)
      const parentIdMap = new Map<string, string>();
      parentsData.forEach((p) => {
        parentIdMap.set(p.id, p.id);
      });

      const apiDescriptionRaw =
        typedProfile.profileInfo?.profileDescription ?? typedProfile.profileInfo?.description ?? '';
      const apiDescription = apiDescriptionRaw.trim();
      const lastSavedDescription = lastSavedDescriptionRef.current;
      const lastSavedAt = lastSavedAtRef.current;
      const shouldPreferLastSavedDescription =
        lastSavedDescription !== null && Date.now() - lastSavedAt < 7000 && apiDescription !== lastSavedDescription;

      form.reset({
        breederName: typedProfile.breederName || '',
        // 백엔드 응답 필드가 profileDescription/profileDescription/profileInfo.description 등으로 섞여 있을 수 있어 우선순위로 처리
        description: shouldPreferLastSavedDescription ? lastSavedDescription : apiDescription,
        location: locationString,
        breeds: typedProfile.breeds || [],
        representativePhotos: typedProfile.profileInfo?.representativePhotos || [],
        // 가격 처리 (display 필드 기반):
        // - display: 'consultation' -> 빈 문자열 + isCounselMode: true
        // - display: 'not_set' -> 빈 문자열 + isCounselMode: false
        // - display: 'range' -> 실제 가격 + isCounselMode: false
        minPrice:
          apiDisplay === 'range' && apiMinPrice !== undefined && apiMinPrice !== null ? apiMinPrice.toString() : '',
        maxPrice:
          apiDisplay === 'range' && apiMaxPrice !== undefined && apiMaxPrice !== null ? apiMaxPrice.toString() : '',
        // 상담 후 공개 모드 여부를 display 필드로 판단
        isCounselMode: isCounselPrice,
        parents: parentsData,
        animals:
          typedProfile.availablePetInfo?.length && typedProfile.availablePetInfo.length > 0
            ? typedProfile.availablePetInfo.map((pet) => {
                const representativePhoto = pet.mainPhoto || pet.photos?.[0];
                // 분양 개체는 photos 배열에 대표사진(photos[0])이 포함되어 있으므로
                // 첫 번째 요소를 제외한 나머지만 추가사진으로 설정
                const additionalPhotos = (pet.photos || []).slice(1);

                return {
                  id: pet.petId || pet._id?.toString() || defaultAnimalId,
                  name: pet.name || '',
                  birthDate: formatDateToYYYYMMDD(pet.birthDate),
                  breed: pet.breed ? [pet.breed] : [],
                  gender: pet.gender || null,
                  description: pet.description || '',
                  adoptionStatus: convertStatusToKorean(pet.status || ''),
                  motherId: pet.parentInfo?.mother?.toString() || '',
                  fatherId: pet.parentInfo?.father?.toString() || '',
                  price: pet.price?.toString() || '',
                  isCounselMode: pet.price === 0,
                  imagePreview: representativePhoto || undefined,
                  isVideo: representativePhoto ? isVideoUrl(representativePhoto) : undefined,
                  photos: additionalPhotos,
                };
              })
            : [
                {
                  id: defaultAnimalId,
                  name: '',
                  birthDate: '',
                  breed: [],
                  gender: null,
                  description: '',
                  adoptionStatus: '',
                  motherId: '',
                  fatherId: '',
                  price: '',
                  isCounselMode: false,
                  photos: [],
                },
              ],
      });
    }
  }, [apiProfileData, form, defaultParentId, defaultAnimalId]);

  // 고양이/강아지 타입 판별
  const typedData = apiProfileData as BreederProfileApi | undefined;
  const specialization =
    typedData?.profileInfo?.specialization || typedData?.specialization || typedData?.specializationTypes || [];
  const animalType = specialization.includes('cat') ? 'cat' : 'dog';

  // 폼 값들을 watch하여 실시간으로 disabled 상태 체크
  const formValues = useWatch({ control: form.control });
  const data = formValues || form.getValues();
  const isEmpty = isFormEmpty(data as ProfileFormData);
  const {
    formState: { isDirty },
  } = form;
  // 프로필 이미지 파일 변경도 감지
  const hasChanges = isDirty || !!profileImageFile || profileImageRemoved;
  const isDisabled = isEmpty || !hasChanges;

  // 폼 가드 훅 사용 (네비게이션 링크와 로고 클릭만 가드)
  const { showNavigationDialog, handleNavigationConfirm, handleNavigationCancel } = useFormGuard({
    hasChanges,
  });

  // 브라우저 이전/다음/새로고침 가드 훅
  const { showBrowserGuard, handleBrowserConfirm, handleBrowserCancel } = useBrowserNavigationGuard({
    hasChanges,
  });

  // 프로필 이미지 변경 핸들러
  const handleProfileImageChange = (file: File, preview: string) => {
    setProfileImageFile(file);
    setProfileImagePreview(preview);
    setProfileImageRemoved(false);
  };

  // 프로필 이미지 삭제 핸들러
  const handleProfileImageRemove = () => {
    setProfileImageFile(null);
    setProfileImagePreview('');
    setProfileImageRemoved(true);
  };

  const handleEdit = async () => {
    // 비어있는 부모/아이 항목 제거 후 검증 실행
    const current = form.getValues();
    const filteredParents = current.parents?.filter((parent) => !isParentEmpty(parent)) ?? [];
    const filteredAnimals = current.animals?.filter((animal) => !isAnimalEmpty(animal)) ?? [];

    if (filteredParents.length !== current.parents.length) {
      form.setValue('parents', filteredParents, { shouldDirty: true });
    }
    if (filteredAnimals.length !== current.animals.length) {
      form.setValue('animals', filteredAnimals, { shouldDirty: true });
    }

    const isValid = await form.trigger();
    const formData = form.getValues();

    // 검증 수행
    const parentErrors = validateParents(formData.parents);
    const animalErrors = validateAnimals(formData.animals);

    // 기존 에러 클리어
    form.clearErrors('parents');
    form.clearErrors('animals');

    // 에러 설정
    const hasParentErrors = setFormErrors(
      form,
      parentErrors as Array<Record<string, string | undefined> | undefined>,
      'parents',
    );
    const hasAnimalErrors = setFormErrors(
      form,
      animalErrors as Array<Record<string, string | undefined> | undefined>,
      'animals',
    );

    // 에러가 있으면 스크롤하고 리턴
    if (!isValid || hasParentErrors || hasAnimalErrors) {
      scrollToFirstError(parentErrors, animalErrors);
      return;
    }

    // 모든 validation 통과 시 API 호출
    try {
      // 0. 프로필 이미지 업로드/삭제 처리
      let profileImageToSave: string | null | undefined;
      if (profileImageFile) {
        const uploadResult = await uploadSingleFile(profileImageFile, 'profile-images');
        profileImageToSave = uploadResult.fileName;
      } else if (profileImageRemoved) {
        profileImageToSave = null;
      }

      // 0-1. 대표 사진 업로드 (새로 추가된 파일만)
      let uploadedPhotoFileNames: string[] = [];
      const existingPhotoFileNames: string[] = [];
      if (Array.isArray(formData.representativePhotos)) {
        const newFiles: File[] = [];
        for (const photo of formData.representativePhotos) {
          if (photo instanceof File) {
            newFiles.push(photo);
          } else if (typeof photo === 'string') {
            // 기존 URL에서 파일 경로 추출 (CDN URL에서 파일명 추출)
            // 스마일서브 URL 형식: https://kr.object.iwinv.kr/pawpong_bucket/representative/uuid.jpeg
            // 필요한 결과: representative/uuid.jpeg
            try {
              const url = new URL(photo);
              // pathname은 /pawpong_bucket/representative/uuid.jpeg 형식
              // 맨 앞의 / 제거
              let filePath = url.pathname.startsWith('/') ? url.pathname.slice(1) : url.pathname;
              // 스마일서브 URL인 경우 버킷 이름(pawpong_bucket/) 제거
              if (url.hostname.includes('object.iwinv.kr') && filePath.startsWith('pawpong_bucket/')) {
                filePath = filePath.slice('pawpong_bucket/'.length);
              }
              if (filePath) {
                existingPhotoFileNames.push(filePath);
              }
            } catch {
              // URL 파싱 실패 시 원본 문자열 사용 (이미 파일명인 경우)
              existingPhotoFileNames.push(photo);
            }
          }
        }
        // 새 파일 업로드
        if (newFiles.length > 0) {
          const uploadResults = await uploadRepresentativePhotos(newFiles);
          uploadedPhotoFileNames = uploadResults.map((r) => r.fileName);
        }
      }
      const allPhotoFileNames = [...existingPhotoFileNames, ...uploadedPhotoFileNames];

      // 1. 기본 프로필 정보 업데이트
      const locationParts = formData.location?.split(' ') || [];
      const locationInfo =
        locationParts.length >= 2
          ? {
              cityName: locationParts[0],
              districtName: locationParts.slice(1).join(' '),
            }
          : undefined;

      const updateData = {
        // 소개글은 빈 문자열도 허용 (undefined가 아니면 전송)
        profileDescription: formData.description !== undefined ? formData.description : undefined,
        locationInfo,
        profilePhotos: allPhotoFileNames.length > 0 ? allPhotoFileNames : undefined,
        // 가격 처리 (display 필드 포함):
        // - 상담 후 공개 모드 -> 0, 0, display: 'consultation'
        // - 가격 입력 있음 -> 실제 가격 + display: 'range'
        // - 가격 입력 없음(빈 문자열) -> 0, 0, display: 'not_set'
        priceRangeInfo: (() => {
          if (formData.isCounselMode) {
            return { minimumPrice: 0, maximumPrice: 0, display: 'consultation' };
          }

          const minPriceStr = formData.minPrice?.trim() || '';
          const maxPriceStr = formData.maxPrice?.trim() || '';

          // 둘 다 비어있으면 미설정 (not_set)
          if (!minPriceStr && !maxPriceStr) {
            return { minimumPrice: 0, maximumPrice: 0, display: 'not_set' };
          }

          // 둘 다 값이 있으면 실제 가격 범위
          if (minPriceStr && maxPriceStr) {
            const min = parseInt(minPriceStr, 10);
            const max = parseInt(maxPriceStr, 10);

            // 유효한 숫자인지 확인
            if (!isNaN(min) && !isNaN(max)) {
              return {
                minimumPrice: Math.min(min, max),
                maximumPrice: Math.max(min, max),
                display: 'range',
              };
            }
          }

          // 그 외의 경우 (하나만 입력된 경우 등) 미설정
          return { minimumPrice: 0, maximumPrice: 0, display: 'not_set' };
        })(),
        breeds: formData.breeds?.length > 0 ? formData.breeds : undefined,
        profileImage: profileImageToSave,
      };

      await updateProfileMutation.mutateAsync(updateData);

      // 프로필 이미지 상태 리셋
      if (profileImageRemoved) {
        setProfileImageRemoved(false);
        setProfileImagePreview('');
      } else if (profileImageFile) {
        setProfileImageFile(null);
      }

      // 2. 부모견 변경사항 동기화 (ID 매핑 반환)
      const originalParents = originalDataRef.current?.parentPetInfo || [];
      const parentIdMapping = await syncParentPets(originalParents, formData.parents);

      // 3. 분양 개체 변경사항 동기화 (부모 ID 매핑 전달)
      const originalAnimals = originalDataRef.current?.availablePetInfo || [];
      await syncAvailablePets(originalAnimals, formData.animals, parentIdMapping);

      // 4. 모든 저장/동기화 완료 후 한 번만 프로필 쿼리 갱신
      lastSavedDescriptionRef.current = (formData.description ?? '').trim();
      lastSavedAtRef.current = Date.now();
      await queryClient.invalidateQueries({ queryKey: ['breeder-profile'] });
      await queryClient.refetchQueries({ queryKey: ['breeder-profile'] });

      setProfileData(formData);
      toast({
        title: '프로필이 수정되었습니다.',
        position: 'split',
      });

      // 내 프로필 페이지로 이동
      const breederId = (apiProfileData as BreederProfileApi)?.breederId;
      if (breederId) {
        router.push(`/explore/breeder/${breederId}`);
      }
    } catch (error) {
      toast({
        title: '프로필 수정에 실패했습니다.',
        description: error instanceof Error ? error.message : '다시 시도해주세요.',
        position: 'split',
      });
    }
  };

  return (
    <FormProvider {...form}>
      <div className="min-h-screen flex w-full flex-col lg:flex-row">
        {/* 왼쪽 배너 영역: lg 이상에서만 표시 */}
        {isLgUp && (
          <div className="lg:w-1/2 lg:px-12 lg:pt-5 bg-tertiary-500">
            <div className="lg:h-[calc(100vh-4rem)]">
              <ProfileBannerCarousel />
            </div>
          </div>
        )}

        {/* 오른쪽 콘텐츠 영역 */}
        <div className="w-full lg:w-1/2 flex flex-col px-[1.25rem] md:px-[2.5rem] lg:pr-12">
          <div className="flex flex-col gap-8 md:gap-20 items-center pb-20 py-14">
            {/* 프로필 기본 정보 */}
            <ProfileBasicInfo
              form={form}
              profileImagePreview={profileImagePreview}
              onProfileImageChange={handleProfileImageChange}
              onProfileImageRemove={handleProfileImageRemove}
              animal={animalType}
            />
            {/* 엄마 아빠 정보 */}
            <ParentsInfo form={form} />
            {/* 분양 중인 아이 */}
            <BreedingAnimals form={form} />
            {/* 탈퇴하기 링크 */}
          </div>

          {/* 수정하기 버튼 */}
          <div className="fixed bottom-6 left-1/2 -translate-x-1/2 px-8 w-full max-w-[424px] md:bottom-10 md:left-1/2 md:-translate-x-1/2 md:w-[424px] md:px-0 lg:left-[calc(50%+25%)]">
            <Button
              variant="tertiary"
              disabled={isDisabled}
              className=" flex h-12 items-center justify-center min-w-20 px-4 py-3 rounded-lg w-full md:w-[424px]"
              onClick={handleEdit}
            >
              수정하기
            </Button>
          </div>
        </div>
      </div>
      {/* 네비게이션 링크 및 로고 클릭 시 다이얼로그 */}
      {showNavigationDialog && (
        <ExitConfirmDialog
          hasData={hasChanges}
          onConfirm={handleNavigationConfirm}
          onCancel={handleNavigationCancel}
          open={showNavigationDialog}
          onOpenChange={(open: boolean) => {
            if (!open) {
              handleNavigationCancel();
            }
          }}
        />
      )}

      {showBrowserGuard && (
        <ExitConfirmDialog
          hasData={hasChanges}
          onConfirm={handleBrowserConfirm}
          onCancel={handleBrowserCancel}
          open={showBrowserGuard}
          onOpenChange={(open: boolean) => {
            if (!open) {
              handleBrowserCancel();
            }
          }}
        />
      )}
    </FormProvider>
  );
}
