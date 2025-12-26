'use client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { PriceInput } from '@/components/ui/price-input';
import { Textarea } from '@/components/ui/textarea';
// import Camera from "@/assets/icons/camera";
import Camera from '@/assets/icons/camera.svg';
import Arrow from '@/assets/icons/arrow';
import BreedsSelectDialogTrigger from '@/app/signup/_components/breeds-select-dialog-trigger';
import { useState, useRef } from 'react';
import LocationSelectDialogTrigger from '@/app/signup/_components/location-select-dialog-trigger';
import ImageEdit from '@/components/image-edit';
import MinusIcon from '@/assets/icons/minus.svg';
import PictureRemove from '@/assets/icons/picture-delete.svg';
import { useFormContext, Controller } from 'react-hook-form';
import type { ProfileFormData } from '@/stores/profile-store';
import ErrorMessage from '@/components/error-message';
import Image from 'next/image';

interface ProfileBasicInfoProps {
  form: ReturnType<typeof useFormContext<ProfileFormData>>;
  profileImagePreview?: string;
  onProfileImageChange?: (file: File, preview: string) => void;
  onProfileImageRemove?: () => void;
  animal?: 'dog' | 'cat';
}

export default function ProfileBasicInfo({
  form,
  profileImagePreview,
  onProfileImageChange,
  onProfileImageRemove,
  animal = 'dog',
}: ProfileBasicInfoProps) {
  const [isDescriptionFocused, setIsDescriptionFocused] = useState(false);
  const { control, watch, setValue, clearErrors, formState, trigger } = form;
  const { errors } = formState;
  const fileInputRef = useRef<HTMLInputElement>(null);

  const isCounselMode = watch('isCounselMode');
  const descriptionValue = watch('description');
  const normalizeNumber = (value: string) => value.replace(/\D/g, '');
  const formatPrice = (value: string) => {
    const digits = value.replace(/\D/g, '');
    return digits.replace(/\B(?=(\d{3})+(?!\d))/g, ',');
  };

  const handleProfileImageClick = () => {
    fileInputRef.current?.click();
  };

  const handleProfileImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        if (event.target?.result) {
          onProfileImageChange?.(file, event.target.result as string);
        }
      };
      reader.readAsDataURL(file);
    }
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };
  return (
    <div className="flex flex-col gap-8 items-start w-full">
      <div className="flex flex-col gap-3 items-center w-full">
        {/* 프로필 이미지 */}
        <input ref={fileInputRef} type="file" accept="image/*" className="hidden" onChange={handleProfileImageChange} />
        <div className="relative">
          <div
            onClick={handleProfileImageClick}
            className="bg-white flex flex-col gap-0.5 items-center justify-center rounded-lg size-20 cursor-pointer transition-colors group overflow-hidden"
          >
            {profileImagePreview ? (
              <Image
                src={profileImagePreview}
                alt="프로필 이미지"
                width={80}
                height={80}
                className="object-cover w-full h-full rounded-lg"
                unoptimized
              />
            ) : (
              <Camera className="size-7 group-hover:[&_path]:fill-[#4F3B2E]" />
            )}
          </div>
          {profileImagePreview && (
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                onProfileImageRemove?.();
              }}
              className="absolute top-1 right-1 bg-[var(--primary-500-basic,#4f3b2e)] rounded-full size-6 flex items-center justify-center hover:opacity-80 transition-opacity"
            >
              <PictureRemove />
            </button>
          )}
        </div>
        <div className="flex flex-col gap-[10px] w-full">
          <Controller
            name="breederName"
            control={control}
            render={({ field }) => (
              <Input
                placeholder="브리더명(상호명)"
                {...field}
                disabled
                className="bg-grayscale-gray1 text-grayscale-gray5 cursor-not-allowed"
              />
            )}
          />
          {errors.breederName && <ErrorMessage message={errors.breederName.message as string} />}
        </div>
        <Controller
          name="description"
          control={control}
          render={({ field }) => (
            <Textarea
              placeholder="소개"
              maxLength={1500}
              showLength={isDescriptionFocused || (descriptionValue || '').length > 0}
              currentLength={String(descriptionValue || '').length}
              {...field}
              onFocus={() => {
                setIsDescriptionFocused(true);
              }}
              onBlur={() => {
                setIsDescriptionFocused(false);
                field.onBlur();
              }}
            />
          )}
        />
        {/* 위치 선택 */}
        <div className="flex flex-col gap-2.5 w-full">
          <Controller
            name="location"
            control={control}
            render={({ field }) => (
              <LocationSelectDialogTrigger
                onSubmitLocation={(value: string | null) => {
                  field.onChange(value ?? '');
                  trigger('location');
                }}
                initialValue={field.value}
                asChild
              >
                <Button variant="input" size={undefined} className="!px-[var(--space-16)] !py-[var(--space-12)] group">
                  {field.value ? <span className="text-[#4F3B2E]">{field.value}</span> : <span>지역</span>}
                  <Arrow className="size-5 group-hover:[&_path]:fill-[#4F3B2E]" />
                </Button>
              </LocationSelectDialogTrigger>
            )}
          />
          {errors.location && <ErrorMessage message={errors.location.message as string} />}
        </div>

        {/* 품종 선택 */}
        <div className="space-y-2.5 w-full">
          <Controller
            name="breeds"
            control={control}
            render={({ field }) => (
              <BreedsSelectDialogTrigger
                animal={animal!}
                onSubmitBreeds={(newBreeds) => {
                  field.onChange(newBreeds);
                  trigger('breeds');
                }}
                initialValue={field.value || []}
                asChild
              >
                <Button variant="input" size={undefined} className="!px-[var(--space-16)] !py-[var(--space-12)] group">
                  <div className="flex-1 text-left overflow-hidden text-ellipsis whitespace-nowrap">
                    {field.value && field.value.length > 0 ? (
                      <span className="text-[#4F3B2E]">{field.value.join('/')}</span>
                    ) : (
                      <span>품종</span>
                    )}
                  </div>
                  <Arrow className="size-5 group-hover:[&_path]:fill-[#4F3B2E]" />
                </Button>
              </BreedsSelectDialogTrigger>
            )}
          />
          {errors.breeds && <ErrorMessage message={errors.breeds.message as string} />}
          <div className="text-caption-s text-grayscale-gray5 font-medium">최대 다섯 가지 선택할 수 있어요</div>
        </div>
      </div>
      {/* 대표 사진 */}
      <div className="flex flex-col gap-3 items-start w-full">
        <div className="flex flex-col font-semibold justify-center min-w-full relative shrink-0 text-grayscale-gray6 text-body-xs w-min">
          <p className="leading-body-xs">대표 사진</p>
        </div>
        <Controller
          name="representativePhotos"
          control={control}
          render={({ field }) => (
            <ImageEdit
              maxCount={3}
              status={errors.representativePhotos ? 'Error' : 'Default'}
              initialImages={
                Array.isArray(field.value) ? field.value.filter((v): v is string => typeof v === 'string') : []
              }
              onFileChange={(files) => {
                field.onChange(files);
                trigger('representativePhotos');
              }}
            />
          )}
        />
      </div>
      {/* 입양 비용 범위 */}
      <div className="flex flex-col gap-3 items-start w-full">
        <div className="flex flex-col font-semibold justify-center min-w-full relative shrink-0 text-grayscale-gray6 text-body-xs w-min">
          <p className="leading-body-xs">입양 비용 범위</p>
        </div>
        <div className="flex flex-col gap-[10px] w-full">
          <div className="flex gap-3 items-center relative w-full flex-nowrap">
            <Controller
              name="minPrice"
              control={control}
              render={({ field }) => {
                const maxPriceValue = watch('maxPrice') || '';
                return (
                  <PriceInput
                    placeholder={isCounselMode ? '상담 후 공개' : '0'}
                    className="grow"
                    inputMode="numeric"
                    disabled={isCounselMode}
                    value={isCounselMode ? '' : formatPrice(field.value || '')}
                    onChange={(e) => {
                      const digits = normalizeNumber(e.target.value);
                      const minNum = digits ? Number(digits) : 0;
                      const maxNum = maxPriceValue ? Number(maxPriceValue) : 0;

                      // 최소 금액이 최대 금액보다 크면 자동 swap
                      if (digits && maxPriceValue && minNum > maxNum) {
                        setValue('minPrice', maxPriceValue, { shouldDirty: true, shouldValidate: false });
                        setValue('maxPrice', digits, { shouldDirty: true, shouldValidate: false });
                        clearErrors(['minPrice', 'maxPrice']);
                      } else {
                        field.onChange(digits);
                      }
                    }}
                    onBlur={field.onBlur}
                  />
                );
              }}
            />
            <div className="overflow-hidden relative shrink-0 size-4">
              <MinusIcon className="size-4" />
            </div>
            <Controller
              name="maxPrice"
              control={control}
              render={({ field }) => {
                const minPriceValue = watch('minPrice') || '';
                return (
                  <PriceInput
                    placeholder={isCounselMode ? '상담 후 공개' : '0'}
                    className="grow"
                    inputMode="numeric"
                    disabled={isCounselMode}
                    value={isCounselMode ? '' : formatPrice(field.value || '')}
                    onChange={(e) => {
                      const digits = normalizeNumber(e.target.value);
                      const minNum = minPriceValue ? Number(minPriceValue) : 0;
                      const maxNum = digits ? Number(digits) : 0;

                      // 최대 금액이 최소 금액보다 작으면 자동 swap
                      if (digits && minPriceValue && maxNum < minNum) {
                        setValue('minPrice', digits, { shouldDirty: true, shouldValidate: false });
                        setValue('maxPrice', minPriceValue, { shouldDirty: true, shouldValidate: false });
                        clearErrors(['minPrice', 'maxPrice']);
                      } else {
                        field.onChange(digits);
                      }
                    }}
                    onBlur={field.onBlur}
                  />
                );
              }}
            />
            <button
              type="button"
              onClick={() => {
                const nextIsCounselMode = !isCounselMode;

                // 분양중인 아이들 섹션과 동일하게:
                // - 토글만으로도 "수정하기" 버튼이 활성화되도록 shouldDirty
                // - 토글 순간 즉시 에러가 뜨지 않도록 shouldValidate는 끔
                setValue('isCounselMode', nextIsCounselMode, { shouldDirty: true, shouldValidate: false });

                if (nextIsCounselMode) {
                  // 상담 후 공개 모드로 전환 시 값 초기화 + 기존 에러 제거
                  setValue('minPrice', '', { shouldDirty: true, shouldValidate: false });
                  setValue('maxPrice', '', { shouldDirty: true, shouldValidate: false });
                  clearErrors(['minPrice', 'maxPrice']);
                } else {
                  // 상담 후 공개 해제 시에도 에러 제거 (사용자가 가격을 입력할 때까지 기다림)
                  clearErrors(['minPrice', 'maxPrice']);
                }
              }}
              className="button-after-counsel shrink-0 whitespace-nowrap"
            >
              상담 후 공개하기
            </button>
          </div>
          {(errors.minPrice || errors.maxPrice) && <ErrorMessage message="입양 비용 범위를 입력해 주세요" />}
        </div>
      </div>

      {/* <div className="flex flex-col gap-3 items-start w-full">
        <div className="flex flex-col font-semibold justify-center relative shrink-0 text-grayscale-gray6 text-body-xs w-full">
          <p className="leading-body-xs">입양 비용 범위</p>
        </div>
        <div className="flex gap-3 items-center justify-center relative shrink-0 w-full">
          <div className="flex flex-col gap-2.5 grow items-start min-h-px min-w-px relative shrink-0">
            <div className="bg-white flex h-12 items-center overflow-hidden rounded-lg w-full">
              <div className="flex gap-2.5 grow items-center justify-center min-h-px min-w-px pl-4 pr-3 py-3 relative shrink-0">
                <div className="flex flex-col font-medium grow justify-center min-h-px min-w-px relative shrink-0 text-grayscale-gray5 text-body-s">
                  <p className="leading-body-s">0</p>
                </div>
              </div>
              <div className="bg-white flex gap-2.5 h-12 items-center pl-1 pr-3.5 py-0 relative rounded-br-lg rounded-tr-lg shrink-0">
                <div className="flex flex-col font-medium justify-center relative shrink-0 text-grayscale-black text-body-s text-nowrap">
                  <p className="leading-body-s whitespace-pre">원</p>
                </div>
              </div>
            </div>
          </div>
          <div className="overflow-hidden relative shrink-0 size-4">
            <div className="absolute bg-grayscale-gray6 h-0.5 left-0.75 top-1.5 w-2.5" />
          </div>
          <div className="bg-white flex grow h-12 items-center min-h-px min-w-px overflow-hidden relative rounded-lg shrink-0">
            <div className="flex gap-2.5 grow items-center justify-center min-h-px min-w-px pl-4 pr-3 py-3 relative shrink-0">
              <div className="flex flex-col font-medium grow justify-center min-h-px min-w-px relative shrink-0 text-grayscale-gray5 text-body-s">
                <p className="leading-body-s">0</p>
              </div>
            </div>
            <div className="bg-white flex gap-2.5 h-12 items-center pl-1 pr-3.5 py-0 relative rounded-br-lg rounded-tr-lg shrink-0">
              <div className="flex flex-col font-medium justify-center relative shrink-0 text-grayscale-black text-body-s text-nowrap">
                <p className="leading-body-s whitespace-pre">원</p>
              </div>
            </div>
          </div>
          <Button className="bg-tertiary-700 flex h-12 items-center justify-center min-w-20 px-4 py-3 relative rounded-lg shrink-0">
            <p className="font-semibold grow leading-body-s min-h-px min-w-px relative shrink-0 text-grayscale-gray6 text-body-s text-center">
              상담 후 공개하기
            </p>
          </Button>
        </div>
      </div>
    </div> */}
    </div>
  );
}
