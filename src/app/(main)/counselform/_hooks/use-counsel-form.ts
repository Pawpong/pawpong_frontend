'use client';

import { useForm, useWatch, type Resolver } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';

import { useRouter } from 'next/navigation';

import { useAnalytics } from '@/hooks/use-analytics';
import { useToast } from '@/hooks/use-toast';
import { useCounselFormStore } from '@/stores/counsel-form-store';
import { formatPhoneNumber } from '@/utils/phone';
import { isFormComplete, isFormEmpty } from '@/utils/counsel-form-validation';
import { useCreateApplication } from '../_hooks/use-application';
import type { ApplicationCreateRequest } from '@/api/application';
import { mapToApplicationRequest } from '../_utils/form-mapper';
import { usePetOptions } from './use-pet-options';
import { counselSchema } from '../_utils/validators';
import type { CounselFormData } from '../_types/counsel';

type UseCounselFormParams = {
  breederId: string;
  petId?: string;
};

export function useCounselForm({ breederId, petId }: UseCounselFormParams) {
  const router = useRouter();
  const { toast } = useToast();
  const { trackAdoptionApplication, trackAdoptionApplicationComplete } = useAnalytics();

  const { counselFormData, clearCounselFormData } = useCounselFormStore();
  const createApplicationMutation = useCreateApplication();

  const defaultValues: CounselFormData =
    counselFormData && Object.keys(counselFormData).length > 0
      ? { ...counselFormData, phone: formatPhoneNumber(counselFormData.phone) }
      : {
          privacyAgreement: false,
          name: '',
          phone: '',
          email: '',
          introduction: '',
          familyMembers: '',
          familyAgreement: false,
          allergyCheck: '',
          awayTime: '',
          livingSpace: '',
          previousPets: '',
          basicCare: false,
          medicalExpense: false,
          interestedAnimal: [],
          interestedAnimalDetails: '',
          adoptionTiming: '',
          additionalMessage: '',
          customQuestionResponses: {},
        };

  const form = useForm<CounselFormData>({
    defaultValues,
    mode: 'onBlur',
    resolver: zodResolver(counselSchema) as Resolver<CounselFormData>,
  });

  const { availablePets } = usePetOptions({ breederId, petId, form });

  const formValues = useWatch({ control: form.control });
  const data = formValues || form.getValues();

  const isFormValid = isFormComplete(data as CounselFormData);
  const hasFormData = !isFormEmpty(data as CounselFormData);
  const isDisabled = !isFormValid || createApplicationMutation.isPending;

  const handleSubmit = async () => {
    const isValid = await form.trigger();
    const formData = form.getValues();

    if (!isValid) {
      toast({
        description: '입력 정보를 확인해주세요.',
        position: 'split',
      });
      return;
    }

    if (!breederId) {
      toast({
        description: '브리더 페이지에서 다시 시도해주세요.',
        position: 'split',
      });
      return;
    }

    const applicationData: ApplicationCreateRequest = mapToApplicationRequest(formData, breederId, petId);

    try {
      trackAdoptionApplication(breederId, petId || '');

      const result = await createApplicationMutation.mutateAsync(applicationData);

      const applicationId = result?.applicationId || 'unknown';
      trackAdoptionApplicationComplete(applicationId);

      clearCounselFormData();

      toast({
        description: result.message,
        position: 'split',
      });

      router.push('/myapplication');
    } catch (error) {
      console.error('Application submission error:', error);
      toast({
        description: error instanceof Error ? error.message : '다시 시도해주세요.',
        position: 'split',
      });
    }
  };

  return {
    form,
    isSubmitting: createApplicationMutation.isPending,
    isDisabled,
    hasFormData,
    availablePets,
    handleSubmit,
    breederId,
  };
}
