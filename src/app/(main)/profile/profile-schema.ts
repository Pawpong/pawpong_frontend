import { z } from 'zod';
import { BREEDER_PROFILE_ERROR } from '@/constants/errors/breeder-profile-error';

/**
 * 생년월일 형식 검증 (YYYYMMDD)
 */
const birthDateSchema = z
  .string()
  .min(1, BREEDER_PROFILE_ERROR.BIRTH_DATE_REQUIRED)
  .regex(/^\d{8}$/, BREEDER_PROFILE_ERROR.BIRTH_DATE_INVALID)
  .refine(
    (val) => {
      const year = parseInt(val.substring(0, 4), 10);
      const month = parseInt(val.substring(4, 6), 10);
      const day = parseInt(val.substring(6, 8), 10);

      if (month < 1 || month > 12) return false;
      if (day < 1 || day > 31) return false;

      const date = new Date(year, month - 1, day);
      return date.getFullYear() === year && date.getMonth() === month - 1 && date.getDate() === day;
    },
    {
      message: BREEDER_PROFILE_ERROR.BIRTH_DATE_INVALID,
    },
  );

const locationSchema = z
  .string({ required_error: BREEDER_PROFILE_ERROR.LOCATION_REQUIRED })
  .min(1, BREEDER_PROFILE_ERROR.LOCATION_REQUIRED)
  .refine((val) => val.trim() !== '', {
    message: BREEDER_PROFILE_ERROR.LOCATION_REQUIRED,
  });

const breedsSchema = z
  .array(z.string())
  .min(1, BREEDER_PROFILE_ERROR.BREEDS_REQUIRED)
  .max(5, BREEDER_PROFILE_ERROR.BREEDS_MAX);

const priceSchema = z.string().regex(/^\d*$/, '숫자만 입력해 주세요.');

const parentItemSchema = z.object({
  id: z.string(),
  name: z.string().min(1, BREEDER_PROFILE_ERROR.NAME_REQUIRED),
  birthDate: birthDateSchema,
  breed: breedsSchema,
  gender: z
    .enum(['male', 'female'])
    .nullable()
    .refine((val) => val !== null, {
      message: BREEDER_PROFILE_ERROR.GENDER_REQUIRED,
    }),
  imagePreview: z.string().optional(),
  imageFile: z.union([z.instanceof(File), z.undefined()]).optional(),
  description: z.string().optional(),
});

const breedingAnimalItemSchema = z
  .object({
    id: z.string(),
    name: z.string().min(1, BREEDER_PROFILE_ERROR.NAME_REQUIRED),
    birthDate: birthDateSchema,
    breed: breedsSchema,
    gender: z
      .enum(['male', 'female'])
      .nullable()
      .refine((val) => val !== null, {
        message: BREEDER_PROFILE_ERROR.GENDER_REQUIRED,
      }),
    imagePreview: z.string().optional(),
    imageFile: z.union([z.instanceof(File), z.undefined()]).optional(),
    description: z.string(),
    adoptionStatus: z.string().min(1, BREEDER_PROFILE_ERROR.STATUS_REQUIRED),
    motherId: z.string().optional(),
    fatherId: z.string().optional(),
    price: z.string(),
    isCounselMode: z.boolean(),
  })
  .refine(
    (data) => {
      // isCounselMode가 false일 때만 price 필수
      if (!data.isCounselMode && (!data.price || data.price.trim() === '')) {
        return false;
      }
      return true;
    },
    {
      message: BREEDER_PROFILE_ERROR.PRICE_REQUIRED,
      path: ['price'],
    },
  );

export const profileFormSchema = z
  .object({
    // 프로필 기본 정보
    breederName: z
      .string()
      .min(1, BREEDER_PROFILE_ERROR.NAME_REQUIRED)
      .regex(/^[가-힣ㄱ-ㅎㅏ-ㅣa-zA-Z0-9\s]+$/, '한글, 영문, 숫자만 이용해 브리더명을 설정해 주세요'),
    description: z.string(),
    location: locationSchema,
    breeds: breedsSchema,
    representativePhotos: z.array(z.union([z.instanceof(File), z.string()])).min(1, ''),
    minPrice: priceSchema,
    maxPrice: priceSchema,
    isCounselMode: z.boolean(),

    // 부모 정보
    parents: z.array(parentItemSchema),

    // 분양 중인 아이
    animals: z.array(breedingAnimalItemSchema),
  })
  .superRefine((data, ctx) => {
    if (!data.isCounselMode) {
      if (!data.minPrice || data.minPrice.trim() === '') {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: BREEDER_PROFILE_ERROR.PRICE_REQUIRED,
          path: ['minPrice'],
        });
      }
      if (!data.maxPrice || data.maxPrice.trim() === '') {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: BREEDER_PROFILE_ERROR.PRICE_REQUIRED,
          path: ['maxPrice'],
        });
      }

      if (data.minPrice && data.maxPrice && data.minPrice.trim() !== '' && data.maxPrice.trim() !== '') {
        const min = Number(data.minPrice);
        const max = Number(data.maxPrice);

        if (!Number.isNaN(min) && !Number.isNaN(max) && min > max) {
          ctx.addIssue({
            code: z.ZodIssueCode.custom,
            message: '최대 금액은 최소 금액보다 크거나 같아야 해요',
            path: ['maxPrice'],
          });
        }
      }
    }
  });

export type ProfileFormSchemaType = z.infer<typeof profileFormSchema>;
