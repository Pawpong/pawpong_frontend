import type { CounselFormData } from "@/stores/counsel-form-store";

/**
 * 값이 비어있지 않은지 체크하는 헬퍼 함수
 */
function hasValue(value: unknown): boolean {
  if (value === null || value === undefined) return false;
  if (typeof value === "string") return value.trim() !== "";
  if (typeof value === "boolean") return value === true;
  if (Array.isArray(value)) return value.length > 0;
  return Boolean(value);
}

/**
 * 폼이 완전히 비어있는지 확인
 */
export function isFormEmpty(data: CounselFormData): boolean {
  const fields: unknown[] = [
    data.privacyAgreement,
    data.name,
    data.phone,
    data.email,
    data.introduction,
    data.familyMembers,
    data.familyAgreement,
    data.allergyCheck,
    data.awayTime,
    data.livingSpace,
    data.previousPets,
    data.basicCare,
    data.medicalExpense,
    data.interestedAnimal,
    data.interestedAnimalDetails,
    data.adoptionTiming,
    data.additionalMessage,
  ];

  return !fields.some(hasValue);
}

/**
 * 모든 필수 항목이 입력되었는지 확인
 */
export function isFormComplete(data: CounselFormData): boolean {
  const requiredFields: (keyof CounselFormData)[] = [
    "privacyAgreement",
    "familyAgreement",
    "basicCare",
    "medicalExpense",
    "name",
    "phone",
    "email",
    "introduction",
    "familyMembers",
    "allergyCheck",
    "awayTime",
    "livingSpace",
    "previousPets",
    "interestedAnimal",
    "adoptionTiming",
    "additionalMessage",
  ];

  return (
    requiredFields.every((key) => hasValue(data[key])) &&
    (data.interestedAnimal !== "특징 직접 입력" ||
      hasValue(data.interestedAnimalDetails))
  );
}
