import type { ProfileFormData } from '@/stores/profile-store';
import {
  addParentPet,
  updateParentPet,
  deleteParentPet,
  addAvailablePet,
  updateAvailablePet,
  deleteAvailablePet,
  updatePetStatus,
  type ParentPetAddRequest,
  type AvailablePetAddRequest,
} from '@/api/breeder-management';
import { uploadParentPetPhoto, uploadAvailablePetPhoto } from '@/api/upload';

type PetStatus = 'available' | 'reserved' | 'adopted';

function toPetStatus(adoptionStatus: string | undefined): PetStatus | undefined {
  if (!adoptionStatus) return undefined;
  switch (adoptionStatus.trim()) {
    case '입양 가능':
      return 'available';
    case '입양 예정':
      return 'reserved';
    case '입양 완료':
      return 'adopted';
    default:
      return undefined;
  }
}

type MongoIdLike = string | { toString(): string };

type ParentPetOriginal = {
  petId?: string;
  _id?: MongoIdLike;
  name?: string;
  breed?: string;
  gender?: 'male' | 'female' | string;
  birthDate?: string | Date;
  photoFileName?: string;
  description?: string;
  photos?: string[];
};

type AvailablePetOriginal = {
  petId?: string;
  _id?: MongoIdLike;
  name?: string;
  breed?: string;
  gender?: 'male' | 'female' | string;
  birthDate?: string | Date;
  photos?: string[];
  price?: number;
  status?: string;
  description?: string;
  parentInfo?: {
    mother?: string;
    father?: string;
  };
};

/**
 * 날짜 형식 변환: YYYYMMDD → YYYY-MM-DD
 */
function formatBirthDate(birthDate: string): string {
  if (!birthDate) return '';
  // 이미 YYYY-MM-DD 형식인 경우
  if (birthDate.includes('-')) return birthDate;
  // YYYYMMDD 형식인 경우
  if (birthDate.length === 8) {
    return `${birthDate.slice(0, 4)}-${birthDate.slice(4, 6)}-${birthDate.slice(6, 8)}`;
  }
  return birthDate;
}

/**
 * 임시 ID인지 확인 (클라이언트에서 생성한 ID)
 */
function isTempId(id: string): boolean {
  return (
    id.startsWith('parent-') ||
    id.startsWith('animal-') ||
    id.startsWith('parents-') ||
    id.startsWith('animals-')
  );
}

function normalizePhotoPath(value: string | undefined): string {
  if (!value) return '';
  try {
    const url = new URL(value);
    return url.pathname.replace(/^\/+/, '');
  } catch {
    return value.replace(/^\/+/, '');
  }
}

function photoBasename(value: string | undefined): string {
  const normalized = normalizePhotoPath(value);
  if (!normalized) return '';
  const parts = normalized.split('/');
  return parts[parts.length - 1] || '';
}

function isSamePhoto(a: string | undefined, b: string | undefined): boolean {
  if (!a || !b) return false;
  if (a === b) return true;
  const aPath = normalizePhotoPath(a);
  const bPath = normalizePhotoPath(b);
  if (aPath && bPath && aPath === bPath) return true;
  const aBase = photoBasename(a);
  const bBase = photoBasename(b);
  return !!aBase && !!bBase && aBase === bBase;
}

/**
 * 부모견 변경사항 동기화
 * @returns 임시 ID → 실제 petId 매핑
 */
export async function syncParentPets(
  originalParents: ParentPetOriginal[] = [],
  currentParents: ProfileFormData['parents'],
): Promise<Map<string, string>> {
  const idMapping = new Map<string, string>(); // 임시 ID → 실제 petId 매핑
  // petId 또는 _id 사용 (백엔드 응답 형식에 따라 다를 수 있음)
  const getParentId = (p: ParentPetOriginal) => p.petId || p._id?.toString();
  const originalIds = new Set(originalParents.map(getParentId).filter(Boolean));
  const currentIds = new Set(currentParents.filter((p) => !isTempId(p.id)).map((p) => p.id));

  // 1. 삭제된 부모견 처리
  const deletedIds = [...originalIds].filter((id) => id && !currentIds.has(id));
  for (const petId of deletedIds) {
    if (petId) {
      await deleteParentPet(petId);
    }
  }

  // 2. 새로 추가되거나 수정된 부모견 처리
  for (const parent of currentParents) {
    // 빈 항목은 스킵
    if (!parent.name || !parent.birthDate || parent.breed.length === 0 || !parent.gender) {
      continue;
    }

    const petData: ParentPetAddRequest = {
      name: parent.name,
      breed: parent.breed[0], // 배열의 첫 번째 값
      gender: parent.gender as 'male' | 'female',
      birthDate: formatBirthDate(parent.birthDate),
      photoFileName: '', // 기본값, 이미지 업로드 후 업데이트됨
      description: parent.description || '',
    };

    if (isTempId(parent.id)) {
      // 새로 추가된 부모견
      const result = await addParentPet(petData);
      const newPetId = result.petId;

      // 임시 ID → 실제 petId 매핑 저장
      idMapping.set(parent.id, newPetId);

      // 업로드된 추가 사진 URL 추적 (대표사진 제외)
      const uploadedPhotos: string[] = [];

      // 1. 대표 사진 업로드 (빈 배열 전달하여 photos 배열에 포함되지 않도록 함)
      let representativePhotoFileName: string | undefined;
      if (parent.imageFile) {
        const uploadResult = await uploadParentPetPhoto(newPetId, parent.imageFile, []);
        representativePhotoFileName = uploadResult.fileName;
        // 대표 사진을 photoFileName으로 업데이트 (photos 배열에는 추가하지 않음)
        await updateParentPet(newPetId, {
          photoFileName: representativePhotoFileName,
        });
      }

      // 2. 추가 사진·영상 업로드 (기존 추가사진들만 전달)
      // 대표사진이 업로드된 경우, 추가사진 업로드 후에도 photoFileName이 유지되도록 다시 업데이트
      if (parent.photos && parent.photos.length > 0) {
        for (const item of parent.photos) {
          if (item instanceof File) {
            const uploadResult = await uploadParentPetPhoto(newPetId, item, uploadedPhotos);
            uploadedPhotos.push(uploadResult.fileName);
          }
        }
        // 추가사진 업로드 후 대표사진이 덮어씌워지지 않도록 다시 업데이트
        if (representativePhotoFileName) {
          await updateParentPet(newPetId, {
            photoFileName: representativePhotoFileName,
          });
        }
      }
    } else {
      // 기존 부모견은 ID 그대로 유지
      idMapping.set(parent.id, parent.id);

      // 기존 부모견 수정
      const original = originalParents.find((p) => getParentId(p) === parent.id);

      // 변경사항이 있는 경우만 업데이트
      if (
        original &&
        (original.name !== parent.name ||
          original.breed !== parent.breed[0] ||
          original.gender !== parent.gender ||
          original.birthDate !== formatBirthDate(parent.birthDate) ||
          original.description !== (parent.description || ''))
      ) {
        await updateParentPet(parent.id, {
          name: parent.name,
          breed: parent.breed[0],
          gender: parent.gender as 'male' | 'female',
          birthDate: formatBirthDate(parent.birthDate),
          photoFileName: original.photoFileName || '',
          description: parent.description || '',
        });
      }

      // 현재 대표사진 URL (imagePreview)
      const representativeSource = parent.imagePreview;

      // 기존 추가사진: string URL만, 대표사진 제외
      const existingAdditionalPhotos: string[] = (parent.photos || [])
        .filter((item): item is string => typeof item === 'string')
        .filter((photo) => !!photo && !isSamePhoto(photo, representativeSource));

      // 새로 추가된 File들만 추출
      const newPhotoFiles: File[] = (parent.photos || []).filter(
        (item): item is File => item instanceof File,
      );

      // 업로드된 추가 사진 URL 추적
      // 백엔드가 photos[0]을 항상 photoFileName으로 저장하므로,
      // 대표사진을 맨 앞에 포함시켜야 photoFileName이 유지됨
      const uploadedPhotos: string[] = [
        ...(representativeSource ? [representativeSource] : []),
        ...existingAdditionalPhotos,
      ];

      // 1. 대표 사진 업로드
      let representativePhotoFileName: string | undefined;
      if (parent.imageFile) {
        const mainPhotoResult = await uploadParentPetPhoto(parent.id, parent.imageFile, []);
        representativePhotoFileName = mainPhotoResult.fileName;
        await updateParentPet(parent.id, {
          photoFileName: representativePhotoFileName,
        });
      }

      // 2. 추가 사진·영상 업로드 (기존 추가사진 + 신규 File)
      for (const file of newPhotoFiles) {
        const uploadResult = await uploadParentPetPhoto(parent.id, file, uploadedPhotos);
        uploadedPhotos.push(uploadResult.cdnUrl);
      }

      // 추가사진 업로드 후 대표사진이 덮어씌워지지 않도록 다시 업데이트
      if (representativePhotoFileName) {
        await updateParentPet(parent.id, {
          photoFileName: representativePhotoFileName,
        });
      }
    }
  }

  return idMapping;
}

/**
 * 분양 개체 변경사항 동기화
 * @param parentIdMapping 부모 임시 ID → 실제 petId 매핑
 */
export async function syncAvailablePets(
  originalAnimals: AvailablePetOriginal[] = [],
  currentAnimals: ProfileFormData['animals'],
  parentIdMapping: Map<string, string> = new Map(),
) {
  // petId 또는 _id 사용 (백엔드 응답 형식에 따라 다를 수 있음)
  const getAnimalId = (a: AvailablePetOriginal) => a.petId || a._id?.toString();
  const originalIds = new Set(originalAnimals.map(getAnimalId).filter(Boolean));
  const currentIds = new Set(currentAnimals.filter((a) => !isTempId(a.id)).map((a) => a.id));

  // 1. 삭제된 분양 개체 처리
  const deletedIds = [...originalIds].filter((id) => id && !currentIds.has(id));
  for (const petId of deletedIds) {
    if (petId) {
      await deleteAvailablePet(petId);
    }
  }

  // 2. 새로 추가되거나 수정된 분양 개체 처리
  for (const animal of currentAnimals) {
    // 빈 항목은 스킵
    if (
      !animal.name ||
      !animal.birthDate ||
      animal.breed.length === 0 ||
      !animal.gender ||
      (!animal.isCounselMode && !animal.price) ||
      !animal.adoptionStatus
    ) {
      continue;
    }

    // 부모 ID를 실제 petId로 변환 (임시 ID인 경우 매핑에서 조회)
    const resolvedMotherId = animal.motherId ? parentIdMapping.get(animal.motherId) || animal.motherId : undefined;
    const resolvedFatherId = animal.fatherId ? parentIdMapping.get(animal.fatherId) || animal.fatherId : undefined;

    // 임시 ID가 해결되지 않은 경우 parentInfo 제외
    const hasValidMother = resolvedMotherId && !isTempId(resolvedMotherId);
    const hasValidFather = resolvedFatherId && !isTempId(resolvedFatherId);

    const computedPrice = animal.isCounselMode ? 0 : parseInt(animal.price || '0');

    const petData: AvailablePetAddRequest = {
      name: animal.name,
      breed: animal.breed[0],
      gender: animal.gender as 'male' | 'female',
      birthDate: formatBirthDate(animal.birthDate),
      price: computedPrice,
      description: animal.description || '',
      parentInfo:
        hasValidMother || hasValidFather
          ? {
              mother: hasValidMother ? resolvedMotherId : undefined,
              father: hasValidFather ? resolvedFatherId : undefined,
            }
          : undefined,
    };

    if (isTempId(animal.id)) {
      // 새로 추가된 분양 개체
      const result = await addAvailablePet(petData);
      const newPetId = result.petId;

      // 상태는 별도 API로 반영
      const desiredStatus = toPetStatus(animal.adoptionStatus);
      if (desiredStatus) {
        await updatePetStatus(newPetId, desiredStatus);
      }

      // 업로드된 추가 사진 URL 추적 (대표사진 제외)
      const uploadedPhotos: string[] = [];

      // 1. 대표 사진 업로드 (빈 배열 전달하여 photos 배열에 포함되지 않도록 함)
      if (animal.imageFile) {
        await uploadAvailablePetPhoto(newPetId, animal.imageFile, []);
        // 대표사진은 photos 배열에 추가하지 않음
      }

      // 2. 추가 사진·영상 업로드 (기존 추가사진들만 전달)
      if (animal.photos && animal.photos.length > 0) {
        for (const item of animal.photos) {
          if (item instanceof File) {
            const uploadResult = await uploadAvailablePetPhoto(newPetId, item, uploadedPhotos);
            uploadedPhotos.push(uploadResult.fileName);
          }
        }
      }
    } else {
      // 기존 분양 개체 수정
      const original = originalAnimals.find((a) => getAnimalId(a) === animal.id);

      // 상태 변경은 별도 API로 반영
      const desiredStatus = toPetStatus(animal.adoptionStatus);
      if (original && desiredStatus && original.status !== desiredStatus) {
        await updatePetStatus(animal.id, desiredStatus);
      }

      // 변경사항이 있는 경우만 업데이트
      if (
        original &&
        (original.name !== animal.name ||
          original.breed !== animal.breed[0] ||
          original.gender !== animal.gender ||
          original.birthDate !== formatBirthDate(animal.birthDate) ||
          (original.price ?? 0) !== computedPrice ||
          original.description !== animal.description ||
          original.parentInfo?.mother !== resolvedMotherId ||
          original.parentInfo?.father !== resolvedFatherId)
      ) {
        await updateAvailablePet(animal.id, {
          name: animal.name,
          breed: animal.breed[0],
          gender: animal.gender as 'male' | 'female',
          birthDate: formatBirthDate(animal.birthDate),
          price: computedPrice,
          description: animal.description,
          parentInfo:
            hasValidMother || hasValidFather
              ? {
                  mother: hasValidMother ? resolvedMotherId : undefined,
                  father: hasValidFather ? resolvedFatherId : undefined,
                }
              : undefined,
        });
      }

      // 현재 대표사진 URL (imagePreview)
      const representativeSource = animal.imagePreview;

      // 기존 추가사진: 원본 CDN URL 그대로 유지 (normalizePhotoPath 제거), 대표사진 제외
      const existingAdditionalPhotos: string[] = (animal.photos || [])
        .filter((item): item is string => typeof item === 'string')
        .filter((photo) => !!photo && !isSamePhoto(photo, representativeSource));

      // 새로 추가된 File들만 추출
      const newPhotoFiles: File[] = (animal.photos || []).filter(
        (item): item is File => item instanceof File,
      );

      if (animal.imageFile) {
        // 대표사진 변경: 새 대표사진을 photos[0]으로 만들기 위해 먼저 업로드
        const mainPhotoResult = await uploadAvailablePetPhoto(animal.id, animal.imageFile, []);
        // 추가사진 업로드: 새 대표사진(cdnUrl)을 앞에 두고 기존+신규 추가사진 이어붙이기
        const uploadedPhotoNames: string[] = [mainPhotoResult.cdnUrl, ...existingAdditionalPhotos];
        for (const file of newPhotoFiles) {
          const uploadResult = await uploadAvailablePetPhoto(animal.id, file, uploadedPhotoNames);
          uploadedPhotoNames.push(uploadResult.cdnUrl);
        }
      } else {
        // 대표사진 변경 없음: 기존 대표사진을 photos[0]으로 유지
        const uploadedPhotoNames: string[] = [
          ...(representativeSource ? [representativeSource] : []),
          ...existingAdditionalPhotos,
        ];
        for (const file of newPhotoFiles) {
          const uploadResult = await uploadAvailablePetPhoto(animal.id, file, uploadedPhotoNames);
          uploadedPhotoNames.push(uploadResult.cdnUrl);
        }
      }
    }
  }
}
