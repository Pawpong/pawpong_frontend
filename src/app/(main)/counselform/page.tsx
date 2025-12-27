'use client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Checkbox } from '@/components/ui/checkbox';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import Arrow from '@/assets/icons/arrow';
import SmallDot from '@/assets/icons/small-dot.svg';
import { useForm, FormProvider, Controller, useWatch } from 'react-hook-form';
import { useBreakpoint } from '@/hooks/use-breakpoint';
import { useState, useEffect, useMemo, Suspense } from 'react';
import { cn } from '@/lib/utils';
import LeftArrow from '@/assets/icons/left-arrow.svg';
import useNavigationGuard from '@/hooks/use-navigation-guard';
import { useCounselFormStore, type CounselFormData } from '@/stores/counsel-form-store';
import { useToast } from '@/hooks/use-toast';
import { isFormComplete, isFormEmpty } from '@/utils/counsel-form-validation';
import ExitConfirmDialog from '@/components/exit-confirmation-dialog';
import { useNavigationGuardContext } from '@/contexts/navigation-guard-context';
import { useCreateApplication } from './_hooks/use-application';
import { useBreederPets } from './_hooks/use-breeder-pets';
import { useSearchParams, useRouter } from 'next/navigation';
import type { ApplicationCreateRequest } from '@/lib/application';
import { formatPhoneNumber } from '@/utils/phone';
import CounselBannerCarousel from '@/components/counsel-banner/counsel-banner-carousel';
import { useAnalytics } from '@/hooks/use-analytics';
import useBrowserNavigationGuard from '@/hooks/use-browser-navigation-guard';

/**
 * 상담 폼 페이지 내부 컴포넌트
 * useSearchParams를 사용하므로 Suspense 경계 내에 있어야 함
 */
function CounselFormContent() {
  const isMdUp = useBreakpoint('md');
  const { toast } = useToast();
  const router = useRouter();
  const searchParams = useSearchParams();
  const breederId = searchParams.get('breederId') || '';
  const petId = searchParams.get('petId') || undefined;
  const { trackAdoptionApplication, trackAdoptionApplicationComplete } = useAnalytics();

  const { counselFormData, clearCounselFormData } = useCounselFormStore();
  const createApplicationMutation = useCreateApplication();
  const { data: breederPetsData } = useBreederPets(breederId);
  const availablePets = useMemo(
    () => breederPetsData?.items?.filter((pet) => pet.status === 'available') || [],
    [breederPetsData?.items],
  );
  const [isIntroductionFocused, setIsIntroductionFocused] = useState(false);
  const [isLivingSpaceFocused, setIsLivingSpaceFocused] = useState(false);
  const [isPreviousPetsFocused, setIsPreviousPetsFocused] = useState(false);
  const [isAdditionalMessageFocused, setIsAdditionalMessageFocused] = useState(false);
  const [isInterestedAnimalDetailsFocused, setIsInterestedAnimalDetailsFocused] = useState(false);

  const defaultCounselValues: CounselFormData = counselFormData
    ? {
        ...counselFormData,
        phone: formatPhoneNumber(counselFormData.phone),
      }
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
        interestedAnimal: '',
        interestedAnimalDetails: '',
        adoptionTiming: '',
        additionalMessage: '',
      };

  const form = useForm<CounselFormData>({
    defaultValues: defaultCounselValues,
    mode: 'onBlur',
  });

  // petId가 있고 availablePets가 로드되면 해당 개체 선택
  useEffect(() => {
    if (petId && availablePets.length > 0 && !form.getValues('interestedAnimal')) {
      const selectedPet = availablePets.find((pet) => pet.petId === petId);
      if (selectedPet) {
        form.setValue('interestedAnimal', selectedPet.name);
      }
    }
  }, [petId, availablePets, form]);

  const formValues = useWatch({ control: form.control });
  const data = formValues || form.getValues();
  const isFormValid = isFormComplete(data as CounselFormData);
  const hasFormData = !isFormEmpty(data as CounselFormData);
  // 제출 중이거나 폼이 유효하지 않으면 버튼 비활성화
  const isDisabled = !isFormValid || createApplicationMutation.isPending;

  // 네비게이션 가드 훅 사용
  const {
    showDialog: showNavigationDialog,
    guardNavigation,
    confirmNavigation: handleNavigationConfirm,
    cancelNavigation: handleNavigationCancel,
  } = useNavigationGuard({
    hasData: hasFormData,
  });

  // 브라우저 이전/다음/새로고침 가드 훅
  const { showBrowserGuard, handleBrowserConfirm, handleBrowserCancel } = useBrowserNavigationGuard({
    hasChanges: hasFormData,
  });

  // Context에 guardNavigation 등록
  const { setGuardNavigation } = useNavigationGuardContext() || {};
  useEffect(() => {
    if (setGuardNavigation) {
      setGuardNavigation(guardNavigation);
    }
    return () => {
      if (setGuardNavigation) {
        setGuardNavigation(undefined);
      }
    };
  }, [guardNavigation, setGuardNavigation]);

  const handleSubmit = async () => {
    const isValid = await form.trigger();
    const formData = form.getValues();

    if (!isValid) {
      toast({
        title: '입력 정보를 확인해주세요.',
        position: 'split',
      });
      return;
    }

    if (!breederId) {
      toast({
        title: '브리더 정보가 없습니다.',
        description: '브리더 페이지에서 다시 시도해주세요.',
        position: 'split',
      });
      return;
    }

    // 프론트엔드 폼 데이터를 백엔드 API 요청 형식으로 변환
    const applicationData: ApplicationCreateRequest = {
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
      preferredPetDescription: formData.interestedAnimalDetails || undefined,
      desiredAdoptionTiming: formData.adoptionTiming || undefined,
      additionalNotes: formData.additionalMessage || undefined,
    };

    try {
      // GA4 입양 신청 시작 트래킹
      trackAdoptionApplication(breederId, petId || '');

      const result = await createApplicationMutation.mutateAsync(applicationData);

      // GA4 입양 신청 완료 트래킹
      const applicationId = result?.applicationId || 'unknown';
      trackAdoptionApplicationComplete(applicationId);

      // 성공 시 저장된 폼 데이터 삭제
      clearCounselFormData();

      toast({
        title: '상담 신청이 완료되었습니다.',
        description: result.message,
        position: 'split',
      });

      // 신청 목록 페이지로 이동
      router.push('/myapplication');
    } catch (error) {
      console.error('Application submission error:', error);
      toast({
        title: '상담 신청에 실패했습니다.',
        description: error instanceof Error ? error.message : '다시 시도해주세요.',
        position: 'split',
      });
    }
  };

  const introductionValue = form.watch('introduction');
  const livingSpaceValue = form.watch('livingSpace');
  const previousPetsValue = form.watch('previousPets');
  const additionalMessageValue = form.watch('additionalMessage');
  const interestedAnimal = form.watch('interestedAnimal');
  const interestedAnimalDetailsValue = form.watch('interestedAnimalDetails');

  return (
    <FormProvider {...form}>
      <div className="sticky top-0 z-10 w-full py-6 bg-tertiary-500-basic">
        <ExitConfirmDialog hasData={hasFormData}>
          <button className="bg-white size-9 flex gap-2.5 items-center justify-center rounded-lg hover:bg-tertiary-600">
            <LeftArrow />
          </button>
        </ExitConfirmDialog>
      </div>
      <div className="min-h-screen flex w-full flex-col md:flex-row">
        {/* 왼쪽 배너 영역: md 이상에서만 표시 */}
        {isMdUp && (
          <div className="md:w-[648px] md:pr-8 bg-tertiary-500">
            <div className="md:h-[744px]">
              <CounselBannerCarousel />
            </div>
          </div>
        )}

        <div className="w-full md:w-1/2 flex flex-col">
          <div className="flex w-full flex-col items-center pb-20 md:pb-24  md:px-4 lg:px-0.5">
            <div className="flex flex-col gap-12 md:gap-8 w-full">
              {/* 개인정보 동의 섹션 */}
              <div className="flex flex-col gap-3 items-start w-full">
                <h2 className="text-body-s font-semibold text-grayscale-gray6 w-full">
                  반려동물 입양 상담을 위한 개인정보 수집과 이용에 동의하시나요?
                </h2>
                <div className="flex flex-col gap-2.5 w-full">
                  <Controller
                    name="privacyAgreement"
                    control={form.control}
                    render={({ field }) => (
                      <label className="bg-white flex gap-2 h-12 items-center px-4 py-2 rounded-lg cursor-pointer">
                        <Checkbox checked={field.value} onCheckedChange={field.onChange} />
                        <span className="text-body-s font-medium text-grayscale-gray6">동의합니다</span>
                      </label>
                    )}
                  />
                  <div className="flex flex-col gap-2 pl-1.5">
                    <div className="flex gap-1 items-start">
                      <SmallDot />
                      <p className="text-caption font-medium text-grayscale-gray5">
                        수집하는 개인정보 항목: 이름, 연락처, 이메일주소 등
                      </p>
                    </div>
                    <div className="flex gap-1 items-start">
                      <SmallDot />
                      <p className="text-caption font-medium text-grayscale-gray5">
                        수집 및 이용 목적: 입양자 상담 및 검토
                      </p>
                    </div>
                    <div className="flex gap-1 items-start">
                      <SmallDot />
                      <p className="text-caption font-medium text-grayscale-gray5">
                        보유 및 이용기간: 상담 또는 입양 직후 폐기
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* 기본 정보 */}
              <div className="flex flex-col gap-3 items-start w-full">
                <Controller
                  name="name"
                  control={form.control}
                  render={({ field }) => (
                    <Input {...field} placeholder="이름" className="overflow-hidden text-ellipsis whitespace-nowrap" />
                  )}
                />
                <Controller
                  name="phone"
                  control={form.control}
                  render={({ field }) => (
                    <Input
                      {...field}
                      placeholder="휴대폰 번호"
                      inputMode="numeric"
                      maxLength={13}
                      className="overflow-hidden text-ellipsis whitespace-nowrap"
                      onChange={(e) => field.onChange(formatPhoneNumber(e.target.value))}
                    />
                  )}
                />
                <Controller
                  name="email"
                  control={form.control}
                  render={({ field }) => (
                    <Input
                      {...field}
                      placeholder="이메일 주소"
                      type="email"
                      className="overflow-hidden text-ellipsis whitespace-nowrap"
                    />
                  )}
                />
              </div>

              {/* 구분선 */}
              <div className="h-px bg-grayscale-gray2 w-full my-7" />

              {/* 자기소개 섹션 */}
              <div className="flex flex-col gap-3 items-start w-full">
                <h2 className="text-body-s font-semibold text-grayscale-gray6 w-full">간단하게 자기소개 부탁드려요.</h2>
                <Controller
                  name="introduction"
                  control={form.control}
                  render={({ field }) => (
                    <Textarea
                      {...field}
                      placeholder="성별, 연령대, 거주지, 결혼 계획, 생활 패턴 등"
                      maxLength={800}
                      showLength={isIntroductionFocused || (introductionValue || '').length > 0}
                      currentLength={String(introductionValue || '').length}
                      onFocus={() => {
                        setIsIntroductionFocused(true);
                      }}
                      onBlur={() => {
                        setIsIntroductionFocused(false);
                        field.onBlur();
                      }}
                    />
                  )}
                />
              </div>

              {/* 가족 구성원 섹션 */}
              <div className="flex flex-col gap-3 items-start w-full">
                <h2 className="text-body-s font-semibold text-grayscale-gray6 w-full">
                  함께 거주하는 가족 구성원을 알려주세요.
                </h2>
                <Controller
                  name="familyMembers"
                  control={form.control}
                  render={({ field }) => <Input {...field} placeholder="인원 수, 관계, 연령대 등" className="h-12" />}
                />
              </div>

              {/* 가족 동의 */}
              <div className="flex flex-col gap-3 items-start w-full">
                <h2 className="text-body-s font-semibold text-grayscale-gray6 w-full">
                  모든 가족 구성원들이 입양에 동의하셨나요?
                </h2>
                <Controller
                  name="familyAgreement"
                  control={form.control}
                  render={({ field }) => (
                    <label className="bg-white flex gap-2 h-12 w-full items-center px-4 py-2 rounded-lg cursor-pointer">
                      <Checkbox checked={field.value} onCheckedChange={field.onChange} />
                      <span className="text-body-s font-medium text-grayscale-gray6">네</span>
                    </label>
                  )}
                />
              </div>

              {/* 알러지 검사 */}
              <div className="flex flex-col gap-3 items-start w-full">
                <h2 className="text-body-s font-semibold text-grayscale-gray6 w-full">
                  본인을 포함한 모든 가족 구성원분들께서 알러지 검사를 마치셨나요?
                </h2>
                <Controller
                  name="allergyCheck"
                  control={form.control}
                  render={({ field }) => (
                    <Input {...field} placeholder="알러지 검사 여부와 결과(유무), 혹은 향후 계획" className="h-12" />
                  )}
                />
              </div>

              {/* 구분선 */}
              <div className="h-px bg-grayscale-gray2 w-full my-7" />

              {/* 생활 패턴 섹션 */}
              <div className="flex flex-col gap-3 items-start w-full">
                <h2 className="text-body-s font-semibold text-grayscale-gray6 w-full">
                  평균적으로 집을 비우는 시간은 얼마나 되나요?
                </h2>
                <Controller
                  name="awayTime"
                  control={form.control}
                  render={({ field }) => (
                    <Input
                      {...field}
                      placeholder="출퇴근·외출 시간을 포함해 하루 중 집을 비우는 시간"
                      className="h-12"
                    />
                  )}
                />
              </div>

              {/* 생활 공간 */}
              <div className="flex flex-col gap-2.5 items-start w-full">
                <h2 className="text-body-s font-semibold text-grayscale-gray6 w-full">
                  아이와 함께 지내게 될 공간을 소개해 주세요.
                </h2>
                <Controller
                  name="livingSpace"
                  control={form.control}
                  render={({ field }) => (
                    <div className="w-full">
                      <Textarea
                        {...field}
                        placeholder="반려동물이 주로 생활할 공간(예: 거실 등)과 환경(크기, 구조 등)"
                        maxLength={800}
                        showLength={isLivingSpaceFocused || (livingSpaceValue || '').length > 0}
                        currentLength={String(livingSpaceValue || '').length}
                        onFocus={() => {
                          setIsLivingSpaceFocused(true);
                        }}
                        onBlur={() => {
                          setIsLivingSpaceFocused(false);
                          field.onBlur();
                        }}
                      />
                      <p className="text-caption font-medium text-grayscale-gray5 mt-2.5">
                        아이들은 철장, 베란다, 야외 등 열악한 공간에서는 지낼 수 없어요
                      </p>
                    </div>
                  )}
                />
              </div>

              {/* 이전 반려동물 */}
              <div className="flex flex-col gap-3 items-start w-full">
                <h2 className="text-body-s font-semibold text-grayscale-gray6 w-full">
                  현재 함께하는, 또는 이전에 함께했던 반려동물에 대해 알려주세요.
                </h2>
                <Controller
                  name="previousPets"
                  control={form.control}
                  render={({ field }) => (
                    <Textarea
                      {...field}
                      placeholder="반려동물의 품종, 성격, 함께한 기간, 이별 사유 등"
                      maxLength={800}
                      showLength={isPreviousPetsFocused || (previousPetsValue || '').length > 0}
                      currentLength={String(previousPetsValue || '').length}
                      onFocus={() => {
                        setIsPreviousPetsFocused(true);
                      }}
                      onBlur={() => {
                        setIsPreviousPetsFocused(false);
                        field.onBlur();
                      }}
                    />
                  )}
                />
              </div>

              {/* 구분선 */}
              <div className="h-px bg-grayscale-gray2 w-full my-7" />

              {/* 케어 관련 섹션 */}
              <div className="flex flex-col gap-3 items-start w-full">
                <h2 className="text-body-s font-semibold text-grayscale-gray6 w-full">
                  정기 예방접종·건강검진·훈련 등 기본 케어를 책임지고 해주실 수 있나요?
                </h2>
                <Controller
                  name="basicCare"
                  control={form.control}
                  render={({ field }) => (
                    <label className="bg-white flex gap-2 h-12 w-full items-center px-4 py-2 rounded-lg cursor-pointer hover:opacity-80 transition-opacity">
                      <Checkbox checked={field.value} onCheckedChange={field.onChange} />
                      <span className="text-body-s font-medium text-grayscale-gray6">네</span>
                    </label>
                  )}
                />
              </div>

              <div className="flex flex-col gap-3 items-start w-full">
                <h2 className="text-body-s font-semibold text-grayscale-gray6 w-full">
                  예상치 못한 질병이나 사고 등으로 치료비가 발생할 경우 감당 가능하신가요?
                </h2>
                <Controller
                  name="medicalExpense"
                  control={form.control}
                  render={({ field }) => (
                    <label className="bg-white flex gap-2 h-12 w-full items-center px-4 py-2 rounded-lg cursor-pointer hover:opacity-80 transition-opacity">
                      <Checkbox checked={field.value} onCheckedChange={field.onChange} />
                      <span className="text-body-s font-medium text-grayscale-gray6">네</span>
                    </label>
                  )}
                />
              </div>

              {/* 구분선 */}
              <div className="h-px bg-grayscale-gray2 w-full my-7" />

              {/* 선택 사항 섹션 */}
              <div className="flex flex-col gap-3 items-start w-full">
                <h2 className="text-body-s font-semibold text-grayscale-gray6 w-full">
                  마음에 두신 아이가 있으신가요?
                </h2>
                <Controller
                  name="interestedAnimal"
                  control={form.control}
                  render={({ field }) => (
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button
                          variant="input"
                          size={undefined}
                          className="!px-[var(--space-16)] !py-[var(--space-12)] w-full group"
                          onClick={(e) => {
                            if (field.value === '') {
                              e.preventDefault();
                              e.stopPropagation();
                            }
                          }}
                        >
                          <span
                            className={cn(
                              'text-body-s font-medium',
                              field.value ? 'text-[#4F3B2E]' : 'text-grayscale-gray5',
                            )}
                          >
                            {field.value || '분양 중인 아이'}
                          </span>
                          <Arrow className="size-5 group-hover:[&_path]:fill-[#4F3B2E]" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent className="w-[var(--radix-dropdown-menu-trigger-width)] min-w-[353px] max-h-[300px] overflow-y-auto">
                        {availablePets.map((pet) => (
                          <DropdownMenuItem
                            key={pet.petId}
                            className="px-4 py-2 text-body-s font-medium cursor-pointer rounded text-grayscale-gray6 focus:bg-transparent focus:text-grayscale-gray6"
                            onSelect={() =>
                              field.onChange(`${pet.name} (${pet.breed}, ${pet.gender === 'male' ? '수컷' : '암컷'})`)
                            }
                          >
                            {pet.name} ({pet.breed}, {pet.gender === 'male' ? '수컷' : '암컷'})
                          </DropdownMenuItem>
                        ))}
                        <DropdownMenuItem
                          className="px-4 py-2 text-body-s font-medium cursor-pointer rounded text-grayscale-gray6 focus:bg-transparent focus:text-grayscale-gray6"
                          onSelect={() => field.onChange('특징 직접 입력')}
                        >
                          특징 직접 입력
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  )}
                />
                {interestedAnimal === '특징 직접 입력' && (
                  <Controller
                    name="interestedAnimalDetails"
                    control={form.control}
                    render={({ field }) => (
                      <Textarea
                        {...field}
                        placeholder="원하시는 아이의 특징을 자유롭게 입력해주세요"
                        maxLength={800}
                        showLength={isInterestedAnimalDetailsFocused || (interestedAnimalDetailsValue || '').length > 0}
                        currentLength={String(interestedAnimalDetailsValue || '').length}
                        className="text-color-primary-500-basic"
                        onFocus={() => {
                          setIsInterestedAnimalDetailsFocused(true);
                        }}
                        onBlur={() => {
                          setIsInterestedAnimalDetailsFocused(false);
                          field.onBlur();
                        }}
                      />
                    )}
                  />
                )}
              </div>

              <div className="flex flex-col gap-3 items-start w-full">
                <h2 className="text-body-s font-semibold text-grayscale-gray6 w-full">원하시는 입양 시기가 있나요?</h2>
                <Controller
                  name="adoptionTiming"
                  control={form.control}
                  render={({ field }) => <Input {...field} className="h-12" />}
                />
              </div>

              {/* 구분선 */}
              <div className="h-px bg-grayscale-gray2 w-full my-7" />

              {/* 마지막 메시지 */}
              <div className="flex flex-col gap-3 items-start w-full">
                <h2 className="text-body-s font-semibold text-grayscale-gray6 w-full">
                  마지막으로 궁금하신 점이나 남기시고 싶으신 말씀이 있나요?
                </h2>
                <Controller
                  name="additionalMessage"
                  control={form.control}
                  render={({ field }) => (
                    <Textarea
                      {...field}
                      maxLength={800}
                      showLength={isAdditionalMessageFocused || (additionalMessageValue || '').length > 0}
                      currentLength={String(additionalMessageValue || '').length}
                      onFocus={() => {
                        setIsAdditionalMessageFocused(true);
                      }}
                      onBlur={() => {
                        setIsAdditionalMessageFocused(false);
                        field.onBlur();
                      }}
                    />
                  )}
                />
              </div>
            </div>
          </div>

          {/* 제출 버튼 */}
          <div className="sticky bottom-6 flex w-full justify-center px-8 md:bottom-10 md:px-4 lg:px-0.5">
            <Button
              variant={undefined}
              disabled={isDisabled}
              className="button-edit-default text-primary-500 hover:bg-secondary-600 flex h-12 items-center justify-center min-w-20 px-4 py-3 rounded-lg w-full md:w-[424px] disabled:cursor-not-allowed disabled:text-grayscale-gray4"
              onClick={handleSubmit}
            >
              {createApplicationMutation.isPending ? '제출 중...' : '상담 신청하기'}
            </Button>
          </div>
        </div>
      </div>

      {/* GNB 네비게이션 이탈 모달 */}
      {showNavigationDialog && (
        <ExitConfirmDialog
          hasData={hasFormData}
          onConfirm={handleNavigationConfirm}
          onCancel={handleNavigationCancel}
          open={showNavigationDialog}
          onOpenChange={(open) => {
            if (!open) {
              handleNavigationCancel();
            }
          }}
        />
      )}

      {showBrowserGuard && (
        <ExitConfirmDialog
          hasData={hasFormData}
          onConfirm={handleBrowserConfirm}
          onCancel={handleBrowserCancel}
          open={showBrowserGuard}
          onOpenChange={(open) => {
            if (!open) {
              handleBrowserCancel();
            }
          }}
        />
      )}
    </FormProvider>
  );
}

/**
 * 상담 폼 페이지
 * useSearchParams 사용을 위해 Suspense 경계로 감쌈
 */
export default function CounselFormPage() {
  return (
    <Suspense fallback={<div className="min-h-screen flex items-center justify-center">로딩 중...</div>}>
      <CounselFormContent />
    </Suspense>
  );
}
