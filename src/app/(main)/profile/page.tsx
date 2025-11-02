"use client";
import { Button } from "@/components/ui/button";
import { useBreakpoint } from "@/hooks/use-breakpoint";
import { useMemo } from "react";
import ProfileBasicInfo from "./_components/profile-basic-info";
import ParentsInfo from "./_components/parents-info";
import BreedingAnimals from "./_components/breeding-animals";
import { useToast } from "@/hooks/use-toast";
import { useForm, FormProvider } from "react-hook-form";
import { useProfileStore, type ProfileFormData } from "@/stores/profile-store";
import { useWatch } from "react-hook-form";
import {
  isFormEmpty,
  validateParents,
  validateAnimals,
  setFormErrors,
  scrollToFirstError,
} from "@/utils/profile-validation";

export default function ProfilePage() {
  const isMdUp = useBreakpoint("md");
  const { toast } = useToast();
  const { setProfileData, profileData } = useProfileStore();

  const defaultParentId = useMemo(() => `parent-default-${Date.now()}`, []);
  const defaultAnimalId = useMemo(() => `animal-default-${Date.now()}`, []);

  const form = useForm<ProfileFormData>({
    defaultValues: profileData || {
      breederName: "",
      description: "",
      location: null,
      breeds: [],
      representativePhotos: [],
      minPrice: "",
      maxPrice: "",
      isCounselMode: false,
      parents: [
        {
          id: defaultParentId,
          name: "",
          birthDate: "",
          breed: [],
          gender: null,
        },
      ],
      animals: [
        {
          id: defaultAnimalId,
          name: "",
          birthDate: "",
          breed: [],
          gender: null,
          description: "",
          adoptionStatus: "",
          parent: "",
          price: "",
          isCounselMode: false,
        },
      ],
    },
    mode: "onBlur",
  });

  // 폼 값들을 watch하여 실시간으로 disabled 상태 체크
  const formValues = useWatch({ control: form.control });
  const data = formValues || form.getValues();
  const isDisabled = isFormEmpty(data as ProfileFormData);

  const handleEdit = async () => {
    const isValid = await form.trigger();
    const formData = form.getValues();

    // 검증 수행
    const parentErrors = validateParents(formData.parents);
    const animalErrors = validateAnimals(formData.animals);

    // 기존 에러 클리어
    form.clearErrors("parents");
    form.clearErrors("animals");

    // 에러 설정
    const hasParentErrors = setFormErrors(
      form,
      parentErrors as Array<Record<string, string | undefined> | undefined>,
      "parents"
    );
    const hasAnimalErrors = setFormErrors(
      form,
      animalErrors as Array<Record<string, string | undefined> | undefined>,
      "animals"
    );

    // 에러가 있으면 스크롤하고 리턴
    if (hasParentErrors || hasAnimalErrors) {
      scrollToFirstError(parentErrors, animalErrors);
      return;
    }

    // 모든 validation 통과 시 저장
    if (isValid) {
      setProfileData(formData);
      toast({
        title: "프로필이 수정되었습니다.",
      });
    }
  };

  return (
    <FormProvider {...form}>
      <div className="min-h-screen flex w-full flex-col md:flex-row">
        {/* 왼쪽 영역: md 이상에서만 표시 (배경 여백) */}
        {isMdUp && <div className="md:w-1/2" />}

        <div className="w-full md:w-1/2 flex flex-col">
          <div className="flex flex-col gap-8 md:gap-20 items-center pb-20 py-14 md:px-4 px-5 lg:px-0.5 ">
            {/* 프로필 기본 정보 */}
            <ProfileBasicInfo form={form} />
            {/* 엄마 아빠 정보 */}
            <ParentsInfo form={form} />
            {/* 분양 중인 아이 */}
            <BreedingAnimals form={form} />
            {/* 탈퇴하기 링크 */}
            <div className="flex gap-0.5 items-center relative shrink-0">
              <p className="font-normal leading-[1.4] relative shrink-0 text-14 text-grayscale-gray5 text-nowrap tracking-[-0.28px] underline">
                탈퇴하기
              </p>
            </div>
          </div>

          {/* 수정하기 버튼 */}
          <div className="fixed bottom-6 left-1/2 -translate-x-1/2 px-8 w-full max-w-[424px] md:bottom-10 md:left-[calc(50%+20%)] md:-translate-x-1/2 md:w-[424px] md:px-0">
            <Button
              variant={undefined}
              disabled={isDisabled}
              className="button-edit-default hover:bg-secondary-600 flex h-12 items-center justify-center min-w-20 px-4 py-3 rounded-lg w-full md:w-[424px]"
              onClick={handleEdit}
            >
              수정하기
            </Button>
          </div>
        </div>
      </div>
    </FormProvider>
  );
}
