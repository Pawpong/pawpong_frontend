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
} from '@/lib/breeder-management';
import { uploadParentPetPhoto, uploadAvailablePetPhoto } from '@/lib/upload';

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
};

type AvailablePetOriginal = {
  petId?: string;
  _id?: MongoIdLike;
  name?: string;
  breed?: string;
  gender?: 'male' | 'female' | string;
  birthDate?: string | Date;
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
  return id.startsWith('parent-') || id.startsWith('animal-');
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

      // 이미지가 있으면 업로드
      if (parent.imageFile) {
        await uploadParentPetPhoto(newPetId, parent.imageFile);
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

      // 이미지가 변경된 경우 업로드
      if (parent.imageFile) {
        await uploadParentPetPhoto(parent.id, parent.imageFile);
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

      // 이미지가 있으면 업로드
      if (animal.imageFile) {
        await uploadAvailablePetPhoto(newPetId, animal.imageFile);
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

      // 이미지가 변경된 경우 업로드
      if (animal.imageFile) {
        await uploadAvailablePetPhoto(animal.id, animal.imageFile);
      }
    }
  }
}
