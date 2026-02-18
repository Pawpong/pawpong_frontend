'use client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import Camera from '@/assets/icons/camera.svg';
import Arrow from '@/assets/icons/arrow';
import Trash from '@/assets/icons/trash.svg';
import Male from '@/assets/icons/male.svg';
import Plus from '@/assets/icons/plus.svg';
import Female from '@/assets/icons/female.svg';
import PictureRemove from '@/assets/icons/picture-delete.svg';
import PlayIcon from '@/assets/icons/play.svg';
import Image from 'next/image';
import { useEffect } from 'react';
import { cn } from '@/api/utils';
import { isVideoFile, extractVideoThumbnail } from '@/utils/video-thumbnail';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { useFieldArray, useFormContext, Controller } from 'react-hook-form';
import type { ProfileFormData } from '@/stores/profile-store';
import ErrorMessage from '@/components/error-message';
import { BREEDER_PROFILE_ERROR } from '@/constants/errors/breeder-profile-error';
import ImageEdit from '@/components/image-edit';

export default function ParentsInfo({ form }: { form: ReturnType<typeof useFormContext<ProfileFormData>> }) {
  const { control, watch, formState, getValues, setValue } = form;
  const { errors } = formState;
  const selectedBreeds = watch('breeds');
  // 실시간 parents 값 watch (fields는 stale할 수 있음)
  const watchedParents = watch('parents');
  const { fields, append, remove } = useFieldArray({
    control,
    name: 'parents',
  });

  useEffect(() => {
    if (fields.length === 0) {
      append({
        id: `parent-${Date.now()}-${Math.random()}`,
        name: '',
        birthDate: '',
        breed: [],
        gender: null,
        description: '',
        photos: [],
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const addParent = () => {
    append({
      id: `parent-${Date.now()}-${Math.random()}`,
      name: '',
      birthDate: '',
      breed: [],
      gender: null,
      description: '',
      photos: [],
    });
  };

  const removeParent = (index: number) => {
    remove(index);
  };

  const updateParent = (index: number, updates: Partial<ProfileFormData['parents'][0]>) => {
    // getValues로 현재 폼 값을 가져와서 업데이트 (stale 데이터 방지)
    const currentParents = getValues('parents');
    const current = currentParents[index];
    const updatedParents = [...currentParents];
    updatedParents[index] = { ...current, ...updates };
    setValue('parents', updatedParents, { shouldDirty: true });
  };

  return (
    <div className="flex flex-col gap-8 items-center w-full">
      {/* 부모 항목들 */}
      <div className="flex flex-col gap-3 items-start w-full">
        {fields.map((field, index) => {
          // watchedParents에서 실시간 값 사용
          const parent = watchedParents?.[index] || field;
          return (
            <div key={field.id} data-parent-index={index} className="flex flex-col gap-3 items-start w-full">
              <div className="flex items-center justify-between w-full">
                <div className="flex flex-col font-semibold justify-center relative shrink-0 text-grayscale-gray6 text-body-xs">
                  <p className="leading-body-xs">{fields.length === 1 ? '엄마 · 아빠' : `엄마 · 아빠 ${index + 1}`}</p>
                </div>
                {fields.length > 1 && (
                  <button
                    onClick={() => removeParent(index)}
                    className="flex gap-1 items-center relative shrink-0 cursor-pointer hover:opacity-80 transition-opacity"
                    aria-label={`${parent.name || '부모'} ${index + 1} 삭제`}
                  >
                    <Trash aria-hidden="true" />
                    <p className="font-medium leading-body-xs relative shrink-0 text-grayscale-gray5 text-body-xs text-nowrap">
                      삭제하기
                    </p>
                  </button>
                )}
              </div>

              {/* 부모 이미지 */}
              <div className="relative">
                <button
                  type="button"
                  onClick={() => {
                    const input = document.createElement('input');
                    input.type = 'file';
                    input.accept = '.jpg,.jpeg,.png,.gif,.webp,.heif,.heic';
                    input.onchange = async (e: Event) => {
                      const target = e.target as HTMLInputElement;
                      const file = target.files?.[0];
                      if (file) {
                        const isVideo = isVideoFile(file);

                        // 동영상 파일 차단
                        if (isVideo) {
                          alert('대표 사진은 이미지만 업로드 가능합니다. 동영상은 추가 사진에서 업로드해주세요.');
                          return;
                        }

                        const preview = await new Promise<string>((resolve) => {
                          const reader = new FileReader();
                          reader.onload = (event) => {
                            resolve(event.target?.result as string);
                          };
                          reader.readAsDataURL(file);
                        });

                        updateParent(index, {
                          imagePreview: preview,
                          imageFile: file,
                          isVideo: false,
                        });
                      }
                    };
                    input.click();
                  }}
                  className="bg-white flex flex-col gap-1.5 items-center justify-center rounded-lg size-20 cursor-pointer transition-colors group overflow-hidden relative"
                  aria-label={parent.imagePreview ? '부모 사진 변경' : '부모 사진 업로드'}
                >
                  {parent.imagePreview ? (
                    <>
                      <Image
                        src={parent.imagePreview}
                        alt={parent.name ? `${parent.name} 사진` : '부모 동물 사진'}
                        fill
                        className="object-contain rounded-lg"
                        unoptimized
                      />
                      {parent.isVideo && (
                        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                          <div className="bg-black/50 rounded-full p-1.5">
                            <PlayIcon className="w-4 h-4 [&_path]:fill-white" aria-hidden="true" />
                          </div>
                        </div>
                      )}
                    </>
                  ) : (
                    <>
                      <Camera
                        className={cn(
                          'size-7 group-hover:[&_path]:fill-[#4F3B2E]',
                          errors.parents?.[index] && '[&_path]:fill-[#FF453A]',
                        )}
                        aria-hidden="true"
                      />
                      <p
                        className={cn(
                          'text-caption-s font-medium text-grayscale-gray5',
                          errors.parents?.[index] && 'text-[#FF453A]',
                        )}
                      >
                        대표 사진
                      </p>
                    </>
                  )}
                </button>
                {parent.imagePreview && (
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      updateParent(index, {
                        imagePreview: undefined,
                        imageFile: undefined,
                        isVideo: undefined,
                      });
                    }}
                    className="absolute top-1 right-1 bg-[var(--primary-500-basic,#4f3b2e)] rounded-full size-6 flex items-center justify-center hover:opacity-80 transition-opacity"
                    aria-label="사진 삭제"
                  >
                    <PictureRemove aria-hidden="true" />
                  </button>
                )}
              </div>

              {/* 이름과 성별 */}
              <div className="flex flex-col gap-[10px] w-full">
                <div className="flex gap-3 items-start relative shrink-0 w-full">
                  <Controller
                    name={`parents.${index}.name`}
                    control={control}
                    render={({ field }) => <Input {...field} placeholder="이름" />}
                  />
                  <Button
                    variant="maleGender"
                    className={cn(
                      'bg-white hover:bg-white flex items-center justify-center px-4 py-3 relative rounded-lg shrink-0 size-12 group',
                      parent.gender === 'male' &&
                        'bg-[var(--color-gender-male-100)] hover:bg-[var(--color-gender-male-100)]',
                    )}
                    onClick={() =>
                      updateParent(index, {
                        gender: parent.gender === 'male' ? null : 'male',
                      })
                    }
                  >
                    <Male
                      className={cn(
                        'size-7',
                        !parent.gender && errors.parents?.[index]?.gender
                          ? '[&_path]:!fill-red-500'
                          : parent.gender === 'male'
                            ? '[&_path]:fill-gender-male-500 group-hover:[&_path]:fill-gender-male-500'
                            : 'group-hover:[&_path]:fill-gender-male-500',
                      )}
                    />
                  </Button>
                  <Button
                    variant="femaleGender"
                    className={cn(
                      'bg-white hover:bg-white flex items-center justify-center px-4 py-3 relative rounded-lg shrink-0 size-12 group',
                      parent.gender === 'female' &&
                        'bg-[var(--color-gender-female-100)] hover:bg-[var(--color-gender-female-100)]',
                    )}
                    onClick={() =>
                      updateParent(index, {
                        gender: parent.gender === 'female' ? null : 'female',
                      })
                    }
                  >
                    <Female
                      className={cn(
                        'size-7',
                        !parent.gender && errors.parents?.[index]?.gender
                          ? '[&_path]:!fill-red-500'
                          : parent.gender === 'female'
                            ? '[&_path]:fill-gender-female-500 group-hover:[&_path]:fill-gender-female-500'
                            : 'group-hover:[&_path]:fill-gender-female-500',
                      )}
                    />
                  </Button>
                </div>
                {errors.parents?.[index]?.name && (
                  <ErrorMessage
                    message={(errors.parents[index]?.name?.message as string) || BREEDER_PROFILE_ERROR.NAME_REQUIRED}
                  />
                )}
              </div>
              <div className="flex flex-col gap-[10px] w-full">
                <Controller
                  name={`parents.${index}.birthDate`}
                  control={control}
                  render={({ field }) => (
                    <Input
                      {...field}
                      placeholder="생년월일 (YYYYMMDD)"
                      className="px-[var(--space-16)] py-[var(--space-12)]"
                      inputMode="numeric"
                      maxLength={8}
                      onChange={(e) => {
                        // 숫자만 허용 (zod 검증과 일치)
                        const value = e.target.value.replace(/\D/g, '');
                        field.onChange(value);
                      }}
                    />
                  )}
                />
                {errors.parents?.[index]?.birthDate && (
                  <ErrorMessage
                    message={
                      (errors.parents[index]?.birthDate?.message as string) || BREEDER_PROFILE_ERROR.BIRTH_DATE_REQUIRED
                    }
                  />
                )}
              </div>
              <div className="flex flex-col gap-[10px] w-full">
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button
                      variant="input"
                      size={undefined}
                      className="!px-[var(--space-16)] !py-[var(--space-12)] w-full group"
                      disabled={selectedBreeds.length === 0}
                      onClick={(e) => {
                        if (selectedBreeds.length === 0) {
                          e.preventDefault();
                          e.stopPropagation();
                        }
                      }}
                    >
                      <div className="flex-1 text-left overflow-hidden text-ellipsis whitespace-nowrap">
                        {parent.breed && parent.breed.length > 0 ? (
                          <span className="text-[#4F3B2E]">{parent.breed.join('/')}</span>
                        ) : (
                          <span className="text-grayscale-gray5">품종</span>
                        )}
                      </div>
                      <Arrow className="size-5 group-hover:[&_path]:fill-[#4F3B2E]" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent
                    className="w-[var(--radix-dropdown-menu-trigger-width)] bg-white p-1 rounded-lg min-w-[353px]"
                    align="start"
                    side="bottom"
                    sideOffset={4}
                    avoidCollisions={false}
                  >
                    {selectedBreeds.length > 0 ? (
                      selectedBreeds.map((breed) => (
                        <DropdownMenuItem
                          key={breed}
                          className={cn(
                            'px-4 py-2 text-body-s font-medium cursor-pointer rounded text-grayscale-gray6 focus:bg-transparent focus:text-grayscale-gray6',
                          )}
                          onClick={() => {
                            updateParent(index, {
                              breed: parent.breed?.includes(breed) ? [] : [breed],
                            });
                            form.trigger(`parents.${index}.breed`);
                          }}
                        >
                          {breed}
                        </DropdownMenuItem>
                      ))
                    ) : (
                      <div className="px-4 py-2 text-body-s text-grayscale-gray5">선택된 품종이 없습니다</div>
                    )}
                  </DropdownMenuContent>
                </DropdownMenu>
                {errors.parents?.[index]?.breed && (
                  <ErrorMessage
                    message={(errors.parents[index]?.breed?.message as string) || BREEDER_PROFILE_ERROR.BREEDS_REQUIRED}
                  />
                )}
              </div>

              {/* 소개 */}
              <div className="flex flex-col gap-[10px] w-full">
                <Controller
                  name={`parents.${index}.description`}
                  control={control}
                  render={({ field }) => (
                    <Textarea
                      {...field}
                      placeholder="아이에 성격과 특징에 대해 자유롭게 소개해주세요!"
                      maxLength={1500}
                      showLength={(field.value?.length ?? 0) > 0}
                      currentLength={field.value?.length || 0}
                    />
                  )}
                />
              </div>

              {/* 사진·영상 */}
              <div className="flex flex-col gap-3 items-start w-full">
                <Controller
                  name={`parents.${index}.photos`}
                  control={control}
                  render={({ field }) => (
                    <ImageEdit
                      maxCount={4}
                      status="Default"
                      labelText="사진·영상"
                      initialImages={
                        Array.isArray(field.value) ? field.value.filter((v): v is string => typeof v === 'string') : []
                      }
                      onFileChange={(files) => {
                        field.onChange(files);
                      }}
                    />
                  )}
                />
                <p className="text-caption-s text-grayscale-gray5 font-medium">
                  아이를 잘 보여줄 수 있는 사진·영상은 최대 4개까지 등록할 수 있어요
                </p>
              </div>

              {/* 구분선 (마지막 항목이 아닐 때만) */}
              {index < fields.length - 1 && (
                <div className="pt-8 pb-8 w-full -mt-3">
                  <div className="h-px bg-grayscale-gray2 w-full" />
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* 추가하기 버튼 */}
      <Button
        onClick={addParent}
        variant="addParent"
        className="bg-tertiary-700 flex gap-1 items-center overflow-hidden pl-3 pr-5 py-2.5 relative rounded-full shrink-0"
      >
        <div className="overflow-hidden relative shrink-0 size-7 flex items-center justify-center">
          <Plus />
        </div>
        <p className="font-medium leading-body-s relative shrink-0 text-grayscale-gray6 text-body-s text-center text-nowrap">
          추가하기
        </p>
      </Button>
    </div>
  );
}
