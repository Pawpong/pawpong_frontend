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
  .string()
  .min(1, BREEDER_PROFILE_ERROR.LOCATION_REQUIRED)
  .refine((val) => val.trim() !== '', {
    message: BREEDER_PROFILE_ERROR.LOCATION_REQUIRED,
  });

const breedsSchema = z
  .array(z.string())
  .min(1, BREEDER_PROFILE_ERROR.BREEDS_REQUIRED)
  .max(5, BREEDER_PROFILE_ERROR.BREEDS_MAX);

const priceSchema = z.string().regex(/^\d*$/, '숫자만 입력해 주세요.');

const stringWithEmptyDefault = () => z.string().default('');

const arrayWithEmptyDefault = () => z.array(z.string()).default([]);

const genderWithNullDefault = () => z.enum(['male', 'female']).nullable().default(null);

const booleanWithFalseDefault = () => z.boolean().default(false);

const isParentItemEmpty = (parent: {
  name?: string;
  birthDate?: string;
  breed?: string[];
  gender?: 'male' | 'female' | null | undefined;
  imageFile?: File;
  imagePreview?: string;
}) =>
  (!parent.name || parent.name.trim() === '') &&
  (!parent.breed || parent.breed.length === 0) &&
  (!parent.birthDate || parent.birthDate.trim() === '') &&
  !parent.gender &&
  !parent.imageFile &&
  !parent.imagePreview;

const parentItemSchema = z.object({
  id: z.string(),
  name: stringWithEmptyDefault(),
  birthDate: stringWithEmptyDefault(),
  breed: arrayWithEmptyDefault(),
  gender: genderWithNullDefault(),
  imagePreview: z.string().optional(),
  imageFile: z.union([z.instanceof(File), z.undefined()]).optional(),
  description: stringWithEmptyDefault(),
  // photos: z.array(z.union([z.instanceof(File), z.string()])).default([]),
});

const isAnimalItemEmpty = (animal: {
  name?: string;
  birthDate?: string;
  breed?: string[];
  gender?: 'male' | 'female' | null | undefined;
  adoptionStatus?: string;
  price?: string;
  imageFile?: File;
  imagePreview?: string;
}) =>
  (!animal.name || animal.name.trim() === '') &&
  (!animal.breed || animal.breed.length === 0) &&
  (!animal.birthDate || animal.birthDate.trim() === '') &&
  !animal.gender &&
  (!animal.adoptionStatus || animal.adoptionStatus.trim() === '') &&
  (!animal.price || animal.price.trim() === '') &&
  !animal.imageFile &&
  !animal.imagePreview;

const breedingAnimalItemSchema = z.object({
  id: z.string(),
  name: stringWithEmptyDefault(),
  birthDate: stringWithEmptyDefault(),
  breed: arrayWithEmptyDefault(),
  gender: genderWithNullDefault(),
  imagePreview: z.string().optional(),
  imageFile: z.union([z.instanceof(File), z.undefined()]).optional(),
  description: stringWithEmptyDefault(),
  adoptionStatus: stringWithEmptyDefault(),
  motherId: stringWithEmptyDefault(),
  fatherId: stringWithEmptyDefault(),
  price: stringWithEmptyDefault(),
  isCounselMode: booleanWithFalseDefault(),
  // photos: z.array(z.union([z.instanceof(File), z.string()])).default([]),
});

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
    parents: z.array(parentItemSchema).superRefine((parents, ctx) => {
      parents.forEach((parent, index) => {
        if (isParentItemEmpty(parent)) return; // 비어있으면 스킵

        if (!parent.name || parent.name.trim() === '') {
          ctx.addIssue({
            code: z.ZodIssueCode.custom,
            message: BREEDER_PROFILE_ERROR.NAME_REQUIRED,
            path: [index, 'name'],
          });
        }
        if (!parent.breed || parent.breed.length === 0) {
          ctx.addIssue({
            code: z.ZodIssueCode.custom,
            message: BREEDER_PROFILE_ERROR.BREEDS_REQUIRED,
            path: [index, 'breed'],
          });
        }
        if (!parent.birthDate || parent.birthDate.trim() === '') {
          ctx.addIssue({
            code: z.ZodIssueCode.custom,
            message: BREEDER_PROFILE_ERROR.BIRTH_DATE_REQUIRED,
            path: [index, 'birthDate'],
          });
        } else if (!birthDateSchema.safeParse(parent.birthDate).success) {
          ctx.addIssue({
            code: z.ZodIssueCode.custom,
            message: BREEDER_PROFILE_ERROR.BIRTH_DATE_INVALID,
            path: [index, 'birthDate'],
          });
        }
        if (!parent.gender) {
          ctx.addIssue({
            code: z.ZodIssueCode.custom,
            message: BREEDER_PROFILE_ERROR.GENDER_REQUIRED,
            path: [index, 'gender'],
          });
        }
        if (!parent.imageFile && !parent.imagePreview) {
          ctx.addIssue({
            code: z.ZodIssueCode.custom,
            message: '사진을 등록해 주세요',
            path: [index, 'image'],
          });
        }
      });
    }),

    // 분양 중인 아이
    animals: z.array(breedingAnimalItemSchema).superRefine((animals, ctx) => {
      animals.forEach((animal, index) => {
        if (isAnimalItemEmpty(animal)) return; // 비어있으면 스킵

        if (!animal.name || animal.name.trim() === '') {
          ctx.addIssue({
            code: z.ZodIssueCode.custom,
            message: BREEDER_PROFILE_ERROR.NAME_REQUIRED,
            path: [index, 'name'],
          });
        }
        if (!animal.breed || animal.breed.length === 0) {
          ctx.addIssue({
            code: z.ZodIssueCode.custom,
            message: BREEDER_PROFILE_ERROR.BREEDS_REQUIRED,
            path: [index, 'breed'],
          });
        }
        if (!animal.adoptionStatus || animal.adoptionStatus.trim() === '') {
          ctx.addIssue({
            code: z.ZodIssueCode.custom,
            message: BREEDER_PROFILE_ERROR.STATUS_REQUIRED,
            path: [index, 'adoptionStatus'],
          });
        }
        if (!animal.birthDate || animal.birthDate.trim() === '') {
          ctx.addIssue({
            code: z.ZodIssueCode.custom,
            message: BREEDER_PROFILE_ERROR.BIRTH_DATE_REQUIRED,
            path: [index, 'birthDate'],
          });
        } else if (!birthDateSchema.safeParse(animal.birthDate).success) {
          ctx.addIssue({
            code: z.ZodIssueCode.custom,
            message: BREEDER_PROFILE_ERROR.BIRTH_DATE_INVALID,
            path: [index, 'birthDate'],
          });
        }
        if (!animal.gender) {
          ctx.addIssue({
            code: z.ZodIssueCode.custom,
            message: BREEDER_PROFILE_ERROR.GENDER_REQUIRED,
            path: [index, 'gender'],
          });
        }
        if (!animal.isCounselMode && (!animal.price || animal.price.trim() === '')) {
          ctx.addIssue({
            code: z.ZodIssueCode.custom,
            message: BREEDER_PROFILE_ERROR.PRICE_REQUIRED,
            path: [index, 'price'],
          });
        }
        if (!animal.imageFile && !animal.imagePreview) {
          ctx.addIssue({
            code: z.ZodIssueCode.custom,
            message: '사진을 등록해 주세요',
            path: [index, 'image'],
          });
        }
      });
    }),
  })
  .superRefine((data, ctx) => {
    if (!data.isCounselMode) {
      const minPriceEmpty = !data.minPrice || data.minPrice.trim() === '';
      const maxPriceEmpty = !data.maxPrice || data.maxPrice.trim() === '';

      // 두 입력이 모두 비어있으면 상담 후 공개 모드로 처리 (에러 없음)
      if (minPriceEmpty && maxPriceEmpty) {
        return; // 에러 없이 통과 (컴포넌트에서 자동으로 isCounselMode로 전환됨)
      }

      if (minPriceEmpty) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: BREEDER_PROFILE_ERROR.PRICE_REQUIRED,
          path: ['minPrice'],
        });
      }
      if (maxPriceEmpty) {
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
          // 자동 swap은 컴포넌트에서 처리되므로 여기서는 에러 발생하지 않음
          // (컴포넌트에서 이미 swap 처리됨)
        }
      }
    }
  });

export type ProfileFormSchemaType = z.infer<typeof profileFormSchema>;
