import type { ApplicationCreateRequest } from '@/api/application';
import type { CounselFormData } from '../_types/counsel';

export function mapToApplicationRequest(
  formData: CounselFormData,
  breederId: string,
  petId?: string,
): ApplicationCreateRequest {
  const selectedPets = formData.interestedAnimal.filter((pet) => pet !== '특징 직접 입력');
  const preferredPetDescription = formData.interestedAnimal.includes('특징 직접 입력')
    ? formData.interestedAnimalDetails || undefined
    : selectedPets.length > 0
      ? selectedPets.join('/')
      : undefined;

  return {
    name: formData.name,
    phone: formData.phone,
    email: formData.email,
    breederId,
    petId,
    privacyConsent: formData.privacyAgreement,
    selfIntroduction: formData.introduction,
    familyMembers: formData.familyMembers,
    allFamilyConsent: formData.familyAgreement,
    allergyTestInfo: formData.allergyCheck,
    timeAwayFromHome: formData.awayTime,
    livingSpaceDescription: formData.livingSpace,
    previousPetExperience: formData.previousPets,
    canProvideBasicCare: formData.basicCare,
    canAffordMedicalExpenses: formData.medicalExpense,
    preferredPetDescription,
    desiredAdoptionTiming: formData.adoptionTiming || undefined,
    additionalNotes: formData.additionalMessage || undefined,
  };
}
