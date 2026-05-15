import { z } from 'zod';
import { isCompletePhoneNumber } from '@/utils/phone';

export const counselSchema = z.object({
  privacyAgreement: z.boolean().refine((val) => val === true, { message: '개인정보 수집 및 이용에 동의해 주세요.' }),

  name: z.string().optional().default(''),
  phone: z.string().optional().default(''),
  email: z.string().optional().default(''),

  introduction: z.string().optional().default(''),
  familyMembers: z.string().min(1, '가족 구성원을 입력해 주세요.'),
  familyAgreement: z.boolean().refine((val) => val === true, { message: '가족 구성원의 입양 동의에 체크해 주세요.' }),
  allergyCheck: z.string().optional().default(''),
  awayTime: z.string().optional().default(''),
  livingSpace: z.string().optional().default(''),
  previousPets: z.string().optional().default(''),

  basicCare: z.boolean().refine((val) => val === true, { message: '기본 케어에 체크해 주세요.' }),
  medicalExpense: z.boolean().refine((val) => val === true, { message: '의료비 부담에 체크해 주세요.' }),

  interestedAnimal: z.array(z.string()).default([]),
  interestedAnimalDetails: z.string().optional().default(''),
  adoptionTiming: z.string().optional().default(''),
});

export type CounselFormSchema = z.infer<typeof counselSchema>;
