import { z } from 'zod';

export const breederInfoSchema = z.object({
  breederName: z
    .string()
    .min(1, '브리더명을 입력해 주세요')
    .regex(/^[가-힣ㄱ-ㅎㅏ-ㅣa-zA-Z0-9]+$/, '한글, 영문, 숫자만 이용해 브리더명을 설정해 주세요'),
  breederLocation: z.union([z.string().min(1, '지역을 선택해 주세요'), z.null()]).refine((val) => val !== null, {
    message: '지역을 선택해 주세요',
  }),
  breeds: z.array(z.string()).min(1, '품종을 선택해 주세요').max(5, '최대 다섯 가지 선택할 수 있어요'),
});

export type BreederInfoFormData = z.infer<typeof breederInfoSchema>;
