'use client';

import Arrow from '@/assets/icons/arrow';
import Camera from '@/assets/icons/camera';
import ErrorIcon from '@/assets/icons/error';
import Check from '@/assets/icons/check-blue.svg';
import NextButton from '@/components/signup-form-section/next-button';
import SignupFormHeader from '@/components/signup-form-section/signup-form-header';
import SignupFormItems from '@/components/signup-form-section/signup-form-items';
import SignupFormSection from '@/components/signup-form-section/signup-form-section';
import SignupFormTitle from '@/components/signup-form-section/signup-form-title';
import UndoButton from '@/components/signup-form-section/undo-button';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import useSignupFormStore from '@/stores/signup-form-store';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useState } from 'react';
import BreedsSelectDialogTrigger from '../breeds-select-dialog-trigger';
import LocationSelectDialogTrigger from '../location-select-dialog-trigger';
import { breederInfoSchema, type BreederInfoFormData } from './breeder-info-schema';
import { checkBreederNameDuplicate } from '@/lib/auth';

export default function BreederInfoSection() {
  const setPhoto = useSignupFormStore((state) => state.setPhoto);
  const photoPreview = useSignupFormStore((state) => state.photoPreview);
  const setPhotoPreview = useSignupFormStore((state) => state.setPhotoPreview);
  const breederName = useSignupFormStore((state) => state.breederName);
  const setBreederName = useSignupFormStore((state) => state.setBreederName);

  const breederLocation = useSignupFormStore((state) => state.breederLocation);
  const setBreederLocation = useSignupFormStore((state) => state.setBreederLocation);
  const breeds = useSignupFormStore((state) => state.breeds);
  const setBreeds = useSignupFormStore((state) => state.setBreeds);
  const nextFlowIndex = useSignupFormStore((state) => state.nextFlowIndex);
  const animal = useSignupFormStore((state) => state.animal);

  // 상호명 중복 검증 상태
  const [isCheckingName, setIsCheckingName] = useState(false);
  const [nameChecked, setNameChecked] = useState(false);
  const [nameAvailable, setNameAvailable] = useState(false);

  // react-hook-form 설정
  const {
    control,
    handleSubmit,
    formState: { errors },
    watch,
  } = useForm<BreederInfoFormData>({
    resolver: zodResolver(breederInfoSchema),
    defaultValues: {
      breederName: breederName || '',
      breederLocation: breederLocation || null,
      breeds: breeds || [],
    },
    mode: 'onBlur',
  });

  const currentBreederName = watch('breederName');

  // 상호명 중복 검사 버튼 클릭 핸들러
  const handleCheckBreederName = async () => {
    if (!currentBreederName || currentBreederName.trim().length === 0) {
      alert('상호명을 입력해주세요.');
      return;
    }

    setIsCheckingName(true);
    try {
      const isDuplicate = await checkBreederNameDuplicate(currentBreederName.trim());
      setNameChecked(true);
      setNameAvailable(!isDuplicate);
    } catch (error) {
      alert('상호명 중복 확인에 실패했습니다.');
      setNameChecked(false);
      setNameAvailable(false);
    } finally {
      setIsCheckingName(false);
    }
  };

  // 상호명 변경 시 검증 상태 초기화
  const handleBreederNameChange = (onChange: (value: string) => void) => (e: React.ChangeEvent<HTMLInputElement>) => {
    onChange(e.target.value);
    setNameChecked(false);
    setNameAvailable(false);
    setSubmitAttempted(false);
  };

  // 제출 시도 상태 (중복검사 미완료 메시지 표시용)
  const [submitAttempted, setSubmitAttempted] = useState(false);

  const onSubmit = (data: BreederInfoFormData) => {
    // 상호명 중복 검사를 완료하지 않았으면 제출 차단
    if (!nameChecked || !nameAvailable) {
      setSubmitAttempted(true);
      return;
    }
    // 제출 시에만 Zustand store에 저장
    setBreederName(data.breederName);
    setBreederLocation(data.breederLocation);
    setBreeds(data.breeds);
    // 다음 단계로 이동
    nextFlowIndex();
  };
  return (
    <SignupFormSection className="gap-15 md:gap-20 lg:gap-20">
      <SignupFormHeader>
        <SignupFormTitle>브리더 정보를 입력해 주세요</SignupFormTitle>
      </SignupFormHeader>
      <SignupFormItems className="gap-8">
        <div className="flex flex-col gap-3 items-center">
          <Button
            size="icon"
            variant="input"
            className="size-20 justify-center"
            onClick={() => {
              const input = document.createElement('input');
              input.type = 'file';
              input.accept = 'image/*';
              input.onchange = (e: Event) => {
                const target = e.target as HTMLInputElement;
                const file = target.files?.[0];
                if (file) {
                  setPhoto(file);
                  const reader = new FileReader();
                  reader.onload = (event: ProgressEvent<FileReader>) => {
                    if (event.target?.result) {
                      setPhotoPreview(event.target.result as string);
                    }
                  };
                  reader.readAsDataURL(file);
                }
              };
              input.click();
            }}
          >
            {photoPreview ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={photoPreview} alt="Uploaded" className="object-cover w-full h-full" />
            ) : (
              <Camera className="text-grayscale-gray6 size-7" />
            )}
          </Button>
          <div className="flex flex-col gap-2.5 w-full">
            <div className="flex gap-3">
              <Controller
                name="breederName"
                control={control}
                render={({ field }) => (
                  <Input
                    placeholder="브리더명(상호명)"
                    {...field}
                    onChange={handleBreederNameChange(field.onChange)}
                    className={nameAvailable ? 'border-green-500 focus:border-green-500' : ''}
                  />
                )}
              />
              <Button
                variant="tertiary"
                disabled={isCheckingName || !currentBreederName || nameAvailable}
                onClick={handleCheckBreederName}
              >
                {isCheckingName ? '확인 중...' : '중복검사'}
              </Button>
            </div>
            {nameAvailable && (
              <div className="flex items-center gap-0.5">
                <Check className="size-3 shrink-0" />
                <p className="text-caption font-medium text-status-success-500">사용할 수 있는 브리더명이에요</p>
              </div>
            )}
            {nameChecked && !nameAvailable && (
              <div className="flex items-center gap-0.5">
                <ErrorIcon className="size-3 shrink-0" />
                <p className="text-caption font-medium text-status-error-500">이미 등록된 브리더명이에요</p>
              </div>
            )}
            {submitAttempted && !nameChecked && (
              <div className="flex items-center gap-0.5">
                <ErrorIcon className="size-3 shrink-0" />
                <p className="text-caption font-medium text-status-error-500">브리더명 중복 검사를 진행해 주세요</p>
              </div>
            )}
            {errors.breederName && (
              <div className="flex items-center gap-0.5">
                <ErrorIcon className="size-3 shrink-0" />
                <p className="text-caption font-medium text-status-error-500">{errors.breederName.message}</p>
              </div>
            )}
          </div>
          {/* <InputGroup>
            <InputGroupTextarea
              maxLength={1500}
              placeholder="소개"
              value={breederDescription}
              onChange={(e) => setBreederDescription(e.target.value)}
              id="breeder-description"
            />
            <InputGroupAddon
              align="block-end"
              className="justify-end pt-4 pb-3 px-4"
              onClick={() => {
                const textarea = document.getElementById("breeder-description");
                textarea?.focus();
              }}
            >
              <InputGroupText>
                <div className="font-medium">
                  <span className="text-secondary-700">
                    {breederDescription.length}
                  </span>
                  <span className="text-grayscale-gray5">/1500</span>
                </div>
              </InputGroupText>
            </InputGroupAddon>
          </InputGroup> */}
          <div className="flex flex-col gap-2.5 w-full">
            <Controller
              name="breederLocation"
              control={control}
              render={({ field }) => (
                <LocationSelectDialogTrigger
                  onSubmitLocation={(value: string | null) => {
                    field.onChange(value);
                  }}
                  initialValue={field.value}
                  asChild
                >
                  <Button variant="input" className="py-3 px-4 pr-3.5 group">
                    {field.value ? (
                      <span className="text-primary-500">{field.value}</span>
                    ) : (
                      <span className="group-hover:text-primary-500">지역</span>
                    )}
                    <Arrow
                      className={`size-5 [&_path]:fill-current ${
                        field.value ? 'text-primary-500' : 'group-hover:text-primary-500'
                      }`}
                    />
                  </Button>
                </LocationSelectDialogTrigger>
              )}
            />
            {errors.breederLocation && (
              <div className="flex items-center gap-0.5">
                <ErrorIcon className="size-3 shrink-0" />
                <p className="text-caption font-medium text-status-error-500">{errors.breederLocation.message}</p>
              </div>
            )}
          </div>
          <div className="space-y-2.5 w-full">
            <Controller
              name="breeds"
              control={control}
              render={({ field }) => (
                <BreedsSelectDialogTrigger
                  animal={animal!}
                  onSubmitBreeds={(value) => {
                    field.onChange(value);
                  }}
                  initialValue={field.value || []}
                  asChild
                >
                  <Button variant="input" className="py-3 px-4 pr-3.5 group">
                    <div className="flex-1 text-left overflow-hidden text-ellipsis whitespace-nowrap">
                      {field.value && field.value.length > 0 ? (
                        <span className="text-primary-500">{field.value.join('/')}</span>
                      ) : (
                        <span className="group-hover:text-primary-500">품종</span>
                      )}
                    </div>
                    <Arrow
                      className={`size-5 [&_path]:fill-current ${
                        field.value && field.value.length > 0 ? 'text-primary-500' : 'group-hover:text-primary-500'
                      }`}
                    />
                  </Button>
                </BreedsSelectDialogTrigger>
              )}
            />
            {errors.breeds ? (
              <div className="flex items-center gap-0.5">
                <ErrorIcon className="size-3 shrink-0" />
                <p className="text-caption font-medium text-status-error-500">{errors.breeds.message}</p>
              </div>
            ) : (
              <div className="text-caption-s text-grayscale-gray5 font-medium">최대 다섯 가지 선택할 수 있어요</div>
            )}
          </div>
        </div>

        <div className="flex flex-col gap-4">
          <NextButton onClick={handleSubmit(onSubmit)} />
          <UndoButton />
        </div>
      </SignupFormItems>
    </SignupFormSection>
  );
}
