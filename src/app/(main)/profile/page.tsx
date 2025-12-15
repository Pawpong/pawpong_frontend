'use client';
import { Button } from '@/components/ui/button';
import { useBreakpoint } from '@/hooks/use-breakpoint';
import { useMemo, useEffect, useRef, useState } from 'react';
import ProfileBasicInfo from './_components/profile-basic-info';
import ParentsInfo from './_components/parents-info';
import BreedingAnimals from './_components/breeding-animals';
import { useToast } from '@/hooks/use-toast';
import { useForm, FormProvider } from 'react-hook-form';
import { useProfileStore, type ProfileFormData } from '@/stores/profile-store';
import { useWatch } from 'react-hook-form';
import {
  isFormEmpty,
  validateParents,
  validateAnimals,
  setFormErrors,
  scrollToFirstError,
} from '@/utils/profile-validation';
import { useBreederProfile, useUpdateBreederProfile } from './_hooks/use-breeder-profile';
import { syncParentPets, syncAvailablePets } from '@/utils/profile-sync';
import { uploadSingleFile, uploadRepresentativePhotos } from '@/lib/upload';
import ProfileBannerCarousel from '@/components/profile-banner/profile-banner-carousel';

export default function ProfilePage() {
  const isLgUp = useBreakpoint('lg');
  const { toast } = useToast();
  const { setProfileData } = useProfileStore();
  const { data: apiProfileData, isLoading } = useBreederProfile();
  const updateProfileMutation = useUpdateBreederProfile();

  // 프로필 이미지 상태
  const [profileImageFile, setProfileImageFile] = useState<File | null>(null);
  const [profileImagePreview, setProfileImagePreview] = useState<string>('');

  // 원본 API 데이터를 저장 (변경사항 비교용)
  const originalDataRef = useRef<any>(null);

  const defaultParentId = useMemo(() => `parent-default-${Date.now()}`, []);
  const defaultAnimalId = useMemo(() => `animal-default-${Date.now()}`, []);

  const form = useForm<ProfileFormData>({
    defaultValues: {
      breederName: '',
      description: '',
      location: null,
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
      // 원본 데이터 저장
      originalDataRef.current = apiProfileData;

      // 프로필 이미지 초기화
      if (apiProfileData.profileImageFileName) {
        setProfileImagePreview(apiProfileData.profileImageFileName);
      }

      const locationParts = apiProfileData.profileInfo?.location;
      const locationString = locationParts ? `${locationParts.city} ${locationParts.district}` : null;

      // 부모 pet ID를 petId에서 추출 (백엔드에서 petId로 변환됨)
      const parentsData =
        apiProfileData.parentPetInfo?.length > 0
          ? apiProfileData.parentPetInfo.map((pet: any) => ({
              id: pet.petId || pet._id?.toString(),
              name: pet.name,
              birthDate: formatDateToYYYYMMDD(pet.birthDate),
              breed: [pet.breed],
              gender: pet.gender,
              imagePreview: pet.photoFileName || undefined,
            }))
          : [
              {
                id: defaultParentId,
                name: '',
                birthDate: '',
                breed: [],
                gender: null,
              },
            ];

      // 부모 ID 매핑 생성 (animal에서 부모 찾을 때 사용)
      const parentIdMap = new Map<string, string>();
      parentsData.forEach((p: any) => {
        parentIdMap.set(p.id, p.id);
      });

      form.reset({
        breederName: apiProfileData.breederName || '',
        description: apiProfileData.profileInfo?.description || '',
        location: locationString,
        breeds: apiProfileData.breeds || [],
        representativePhotos: apiProfileData.profileInfo?.representativePhotos || [],
        minPrice: apiProfileData.profileInfo?.priceRange?.min?.toString() || '',
        maxPrice: apiProfileData.profileInfo?.priceRange?.max?.toString() || '',
        isCounselMode: false,
        parents: parentsData,
        animals:
          apiProfileData.availablePetInfo?.length > 0
            ? apiProfileData.availablePetInfo.map((pet: any) => ({
                id: pet.petId || pet._id?.toString(),
                name: pet.name,
                birthDate: formatDateToYYYYMMDD(pet.birthDate),
                breed: [pet.breed],
                gender: pet.gender,
                description: pet.description || '',
                adoptionStatus: convertStatusToKorean(pet.status || ''),
                motherId: pet.parentInfo?.mother?.toString() || '',
                fatherId: pet.parentInfo?.father?.toString() || '',
                price: pet.price?.toString() || '',
                isCounselMode: pet.price === 0,
                imagePreview: pet.photos?.[0] || undefined,
              }))
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
                },
              ],
      });
    }
  }, [apiProfileData, form, defaultParentId, defaultAnimalId]);

  // 폼 값들을 watch하여 실시간으로 disabled 상태 체크
  const formValues = useWatch({ control: form.control });
  const data = formValues || form.getValues();
  const isEmpty = isFormEmpty(data as ProfileFormData);
  const {
    formState: { isDirty },
  } = form;
  // 프로필 이미지 파일 변경도 감지
  const hasChanges = isDirty || !!profileImageFile;
  const isDisabled = isEmpty || !hasChanges;

  // 프로필 이미지 변경 핸들러
  const handleProfileImageChange = (file: File, preview: string) => {
    setProfileImageFile(file);
    setProfileImagePreview(preview);
  };

  const handleEdit = async () => {
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
    if (hasParentErrors || hasAnimalErrors) {
      scrollToFirstError(parentErrors, animalErrors);
      return;
    }

    // 모든 validation 통과 시 API 호출
    if (isValid) {
      try {
        // 0. 프로필 이미지 업로드 (변경된 경우)
        let profileImageFileName: string | undefined;
        if (profileImageFile) {
          const uploadResult = await uploadSingleFile(profileImageFile, 'profile-images');
          profileImageFileName = uploadResult.fileName;
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
              // 기존 URL에서 파일 경로 추출 (signed URL에서 파일명 추출)
              // signed URL 형식: https://cdn.pawpong.kr/representative/uuid.jpeg?Expires=...
              // 필요한 결과: representative/uuid.jpeg
              try {
                const url = new URL(photo);
                // pathname은 /representative/uuid.jpeg 형식
                // 맨 앞의 / 제거하여 representative/uuid.jpeg 형태로 만듦
                const filePath = url.pathname.startsWith('/') ? url.pathname.slice(1) : url.pathname;
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
          profileDescription: formData.description || undefined,
          locationInfo,
          profilePhotos: allPhotoFileNames.length > 0 ? allPhotoFileNames : undefined,
          priceRangeInfo:
            formData.minPrice && formData.maxPrice
              ? {
                  minimumPrice: parseInt(formData.minPrice),
                  maximumPrice: parseInt(formData.maxPrice),
                }
              : undefined,
          breeds: formData.breeds?.length > 0 ? formData.breeds : undefined,
          profileImage: profileImageFileName,
        };

        await updateProfileMutation.mutateAsync(updateData);

        // 2. 부모견 변경사항 동기화 (ID 매핑 반환)
        const originalParents = originalDataRef.current?.parentPetInfo || [];
        const parentIdMapping = await syncParentPets(originalParents, formData.parents);

        // 3. 분양 개체 변경사항 동기화 (부모 ID 매핑 전달)
        const originalAnimals = originalDataRef.current?.availablePetInfo || [];
        await syncAvailablePets(originalAnimals, formData.animals, parentIdMapping);

        setProfileData(formData);
        toast({
          title: '프로필이 수정되었습니다.',
        });
      } catch (error) {
        toast({
          title: '프로필 수정에 실패했습니다.',
          description: error instanceof Error ? error.message : '다시 시도해주세요.',
        });
      }
    }
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <p className="text-body-s text-grayscale-gray5">로딩 중...</p>
      </div>
    );
  }

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
              variant={undefined}
              disabled={isDisabled}
              className="button-edit-default hover:bg-secondary-600 flex h-12 items-center justify-center min-w-20 px-4 py-3 rounded-lg w-full md:w-[424px]"
              onClick={handleEdit}
            >
              수정하기
            </Button>
          </div>
        </div>
      </div>
    </FormProvider>
  );
}
