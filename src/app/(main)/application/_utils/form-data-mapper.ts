import type { CounselFormData } from '@/app/(main)/counselform/_types/counsel';
import type { ApplicationDetailDto } from '@/api/application';
import type { ReceivedApplicationItemDto } from '@/api/breeder';

interface AdopterProfile {
  nickname?: string;
  phoneNumber?: string;
  emailAddress?: string;
}

/**
 * 신청 상세 데이터를 CounselFormData로 변환하는 공통 유틸 함수
 * 브리더용과 입양자용 모두에서 사용
 */
export function mapToCounselFormData(
  applicationData: ReceivedApplicationItemDto | ApplicationDetailDto,
  adopterProfile?: AdopterProfile,
): CounselFormData {
  // 브리더용: applicationData에서 직접 가져옴
  // 입양자용: adopterProfile에서 가져옴 (없으면 빈 문자열)
  const name = 'adopterName' in applicationData ? applicationData.adopterName : adopterProfile?.nickname || '';
  const phone =
    'adopterPhone' in applicationData ? applicationData.adopterPhone || '' : adopterProfile?.phoneNumber || '';
  const email = 'adopterEmail' in applicationData ? applicationData.adopterEmail : adopterProfile?.emailAddress || '';

  return {
    privacyAgreement: applicationData.standardResponses?.privacyConsent ?? false,
    name,
    phone,
    email,
    introduction: applicationData.standardResponses?.selfIntroduction || '',
    familyMembers: applicationData.standardResponses?.familyMembers || '',
    familyAgreement: applicationData.standardResponses?.allFamilyConsent ?? false,
    allergyCheck: applicationData.standardResponses?.allergyTestInfo || '',
    awayTime: applicationData.standardResponses?.timeAwayFromHome || '',
    livingSpace: applicationData.standardResponses?.livingSpaceDescription || '',
    previousPets: applicationData.standardResponses?.previousPetExperience || '',
    basicCare: applicationData.standardResponses?.canProvideBasicCare ?? false,
    medicalExpense: applicationData.standardResponses?.canAffordMedicalExpenses ?? false,
    interestedAnimal: applicationData.standardResponses?.preferredPetDescription
      ? applicationData.standardResponses.preferredPetDescription.split('/')
      : [],
    interestedAnimalDetails: '',
    adoptionTiming: applicationData.standardResponses?.desiredAdoptionTiming || '',
  };
}
