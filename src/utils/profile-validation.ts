import type { ProfileFormData } from "@/stores/profile-store";
import { BREEDER_PROFILE_ERROR } from "@/constants/errors/breeder-profile-error";
import type { UseFormReturn, FieldValues } from "react-hook-form";

export interface ValidationErrors {
  [key: string]: string | undefined;
}

export interface ParentValidationErrors {
  name?: string;
  breed?: string;
}

export interface AnimalValidationErrors {
  name?: string;
  breed?: string;
  adoptionStatus?: string;
  price?: string;
}

/**
 * 값이 비어있지 않은지 체크하는 헬퍼 함수
 */
function hasValue(value: unknown): boolean {
  if (value === null || value === undefined) return false;
  if (typeof value === "string") return value.trim() !== "";
  if (typeof value === "boolean") return value === true;
  if (Array.isArray(value)) return value.length > 0;
  if (typeof value === "object") {
    // 이미지 파일이나 프리뷰 체크
    if (value instanceof File) return true;
    // 객체의 값들 중 하나라도 있으면 true
    return Object.values(value).some(hasValue);
  }
  return Boolean(value);
}

/**
 * 폼이 완전히 비어있는지 확인
 */
export function isFormEmpty(data: ProfileFormData): boolean {
  // 기본 정보 체크 - 하나라도 값이 있으면 false 반환
  const basicFields: unknown[] = [
    data.breederName,
    data.description,
    data.location,
    data.breeds,
    data.representativePhotos,
    data.minPrice,
    data.maxPrice,
    data.isCounselMode,
  ];
  if (basicFields.some(hasValue)) return false;

  // 부모/동물 정보 체크
  const checkArrayItems = (items: unknown[]) =>
    items.some((item) =>
      typeof item === "object" && item !== null
        ? Object.values(item).some(hasValue)
        : false
    );

  if (data.parents?.length && checkArrayItems(data.parents as unknown[]))
    return false;
  if (data.animals?.length && checkArrayItems(data.animals as unknown[]))
    return false;

  return true;
}

/**
 * 부모 정보 검증
 */
export function validateParents(
  parents: ProfileFormData["parents"]
): Array<ParentValidationErrors | undefined> {
  return parents.map((parent) => {
    const errors: ParentValidationErrors = {};

    if (!parent.name || parent.name.trim() === "") {
      errors.name = BREEDER_PROFILE_ERROR.NAME_REQUIRED;
    }
    if (!parent.breed || parent.breed.length === 0) {
      errors.breed = BREEDER_PROFILE_ERROR.BREEDS_REQUIRED;
    }

    return Object.keys(errors).length > 0 ? errors : undefined;
  });
}

/**
 * 분양 중인 아이 정보 검증
 */
export function validateAnimals(
  animals: ProfileFormData["animals"]
): Array<AnimalValidationErrors | undefined> {
  return animals.map((animal) => {
    const errors: AnimalValidationErrors = {};

    if (!animal.name || animal.name.trim() === "") {
      errors.name = BREEDER_PROFILE_ERROR.NAME_REQUIRED;
    }
    if (!animal.breed || animal.breed.length === 0) {
      errors.breed = BREEDER_PROFILE_ERROR.BREEDS_REQUIRED;
    }
    if (!animal.adoptionStatus || animal.adoptionStatus.trim() === "") {
      errors.adoptionStatus = BREEDER_PROFILE_ERROR.STATUS_REQUIRED;
    }
    if (
      !animal.isCounselMode &&
      (!animal.price || animal.price.trim() === "")
    ) {
      errors.price = BREEDER_PROFILE_ERROR.PRICE_REQUIRED;
    }

    return Object.keys(errors).length > 0 ? errors : undefined;
  });
}

/**
 * 폼 에러 설정
 */
export function setFormErrors<T extends FieldValues = FieldValues>(
  form: UseFormReturn<T>,
  errors: Array<Record<string, string | undefined> | undefined>,
  fieldPrefix: string
) {
  const hasErrors = errors.some((err) => err !== undefined);
  if (!hasErrors) return false;

  errors.forEach((errorObj, index) => {
    if (errorObj) {
      Object.entries(errorObj).forEach(([field, message]) => {
        if (message) {
          form.setError(
            `${fieldPrefix}.${index}.${field}` as Parameters<
              typeof form.setError
            >[0],
            {
              type: "manual",
              message: message,
            },
            { shouldFocus: false }
          );
        }
      });
    }
  });

  return true;
}

/**
 * 첫 번째 에러 항목으로 스크롤
 */
export function scrollToFirstError(
  parentErrors: Array<ParentValidationErrors | undefined>,
  animalErrors: Array<AnimalValidationErrors | undefined>
) {
  let firstErrorIndex: number | null = null;
  let dataAttribute = "";

  // 부모 에러가 먼저 있으면 부모로 스크롤
  if (parentErrors.some((err) => err !== undefined)) {
    firstErrorIndex = parentErrors.findIndex(
      (err) => err !== undefined && Object.keys(err).length > 0
    );
    dataAttribute = `data-parent-index="${firstErrorIndex}"`;
  }
  // 부모 에러가 없으면 동물 에러로 스크롤
  else if (animalErrors.some((err) => err !== undefined)) {
    firstErrorIndex = animalErrors.findIndex(
      (err) => err !== undefined && Object.keys(err).length > 0
    );
    dataAttribute = `data-animal-index="${firstErrorIndex}"`;
  }

  if (firstErrorIndex !== null && firstErrorIndex !== -1) {
    setTimeout(() => {
      const element = document.querySelector(`[${dataAttribute}]`);
      if (element) {
        element.scrollIntoView({ behavior: "smooth", block: "center" });
      }
    }, 100);
  }
}
