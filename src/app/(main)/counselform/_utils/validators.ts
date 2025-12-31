import { z } from 'zod';

export const counselSchema = z.object({
  privacyAgreement: z.boolean().refine((val) => val === true, { message: '개인정보 수집 및 이용에 동의해 주세요.' }),

  name: z.string().min(1, '이름을 입력해 주세요.'),
  phone: z
    .string()
    .min(1, '전화번호를 입력해 주세요.')
    .regex(/^\d{2,3}-\d{3,4}-\d{4}$/, '010-1234-5678 형식으로 입력해 주세요.'),
  email: z.string().email('올바른 이메일 형식으로 입력해 주세요.').min(1, '이메일을 입력해 주세요.'),

  introduction: z.string().min(1, '자기소개를 입력해 주세요.'),
  familyMembers: z.string().min(1, '가족 구성원을 입력해 주세요.'),
  familyAgreement: z.boolean().refine((val) => val === true, { message: '가족 구성원의 입양 동의에 체크해 주세요.' }),
  allergyCheck: z.string().min(1, '알러지 검사 여부를 입력해 주세요.'),
  awayTime: z.string().min(1, '집을 비우는 시간을 입력해 주세요.'),
  livingSpace: z.string().min(1, '생활 공간을 입력해 주세요.'),
  previousPets: z.string().min(1, '반려동물 경험을 입력해 주세요.'),

  basicCare: z.boolean().refine((val) => val === true, { message: '기본 케어에 체크해 주세요.' }),
  medicalExpense: z.boolean().refine((val) => val === true, { message: '의료비 부담에 체크해 주세요.' }),

  interestedAnimal: z.array(z.string()).default([]),
  interestedAnimalDetails: z.string(),
  adoptionTiming: z.string(),
  additionalMessage: z.string(),
});

export type CounselFormSchema = z.infer<typeof counselSchema>;

