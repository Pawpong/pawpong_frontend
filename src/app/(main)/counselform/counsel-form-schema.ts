import { z } from "zod";

export const counselFormSchema = z
  .object({
    // 개인정보 동의
    privacyAgreement: z.boolean().refine((val) => val === true, {
      message: "개인정보 수집 및 이용에 동의해 주세요.",
    }),

    // 기본 정보
    name: z.string().min(1, "이름을 입력해 주세요."),
    phone: z
      .string()
      .min(1, "전화번호를 입력해 주세요.")
      .regex(/^\d{3}-\d{4}-\d{4}$/, "010-1234-5678 형식으로 입력해 주세요."),
    email: z
      .string()
      .email("올바른 이메일 형식을 입력해 주세요.")
      .min(1, "이메일을 입력해 주세요."),

    // 자기소개
    introduction: z.string().min(1, "자기소개를 입력해 주세요."),

    // 가족 구성원
    familyMembers: z.string().min(1, "가족 구성원을 입력해 주세요."),
    familyAgreement: z.boolean().refine((val) => val === true, {
      message: "가족 구성원의 입양 동의에 체크해 주세요.",
    }),

    // 알러지 검사
    allergyCheck: z.string().min(1, "알러지 검사 결과를 입력해 주세요."),

    // 생활 패턴
    awayTime: z.string().min(1, "하루 중 집에 없는 시간을 입력해 주세요."),
    livingSpace: z.string().min(1, "거주 공간을 입력해 주세요."),
    previousPets: z.string().min(1, "반려동물 경험을 입력해 주세요."),

    // 케어 관련
    basicCare: z.boolean().refine((val) => val === true, {
      message: "기본 케어에 체크해 주세요.",
    }),
    medicalExpense: z.boolean().refine((val) => val === true, {
      message: "의료비 부담에 체크해 주세요.",
    }),
    neuteringAgreement: z.boolean().refine((val) => val === true, {
      message: "중성화 동의에 체크해 주세요.",
    }),

    // 선택 사항
    interestedAnimal: z.string().min(1, "관심 있는 동물을 선택해 주세요."),
    interestedAnimalDetails: z.string(), // 빈 문자열 허용, refine에서 조건부 검증
    adoptionTiming: z.string().min(1, "입양 시기를 선택해 주세요."),
    additionalMessage: z.string().min(1, "추가 메시지를 입력해 주세요."),
  })
  .refine(
    (data) => {
      // interestedAnimal이 "특징 직접 입력"일 때만 interestedAnimalDetails 필수
      if (data.interestedAnimal === "특징 직접 입력") {
        return data.interestedAnimalDetails.trim() !== "";
      }
      return true;
    },
    {
      message: "특징을 직접 입력해 주세요.",
      path: ["interestedAnimalDetails"],
    }
  );

export type CounselFormSchemaType = z.infer<typeof counselFormSchema>;
