"use client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { PriceInput } from "@/components/ui/price-input";
import Camera from "@/assets/icons/camera.svg";
import Arrow from "@/assets/icons/arrow";
import Trash from "@/assets/icons/trash.svg";
import Male from "@/assets/icons/male.svg";
import Plus from "@/assets/icons/plus.svg";
import Female from "@/assets/icons/female.svg";
import PictureRemove from "@/assets/icons/picture-delete.svg";
import Image from "next/image";
import { useEffect } from "react";
import { cn } from "@/lib/utils";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useFieldArray, useFormContext, Controller } from "react-hook-form";
import type { ProfileFormData } from "@/stores/profile-store";
import ErrorMessage from "@/components/error-message";
import { BREEDER_PROFILE_ERROR } from "@/constants/errors/breeder-profile-error";

export default function BreedingAnimals({
  form,
}: {
  form: ReturnType<typeof useFormContext<ProfileFormData>>;
}) {
  const { control, watch, formState } = form;
  const { errors } = formState;
  const selectedBreeds = watch("breeds");
  const parents = watch("parents");
  const { fields, append, remove, update } = useFieldArray({
    control,
    name: "animals",
  });

  useEffect(() => {
    if (fields.length === 0) {
      append({
        id: `animal-${Date.now()}-${Math.random()}`,
        name: "",
        birthDate: "",
        breed: [],
        gender: null,
        description: "",
        adoptionStatus: "",
        parent: "",
        price: "",
        isCounselMode: false,
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const addAnimal = () => {
    append({
      id: `animal-${Date.now()}-${Math.random()}`,
      name: "",
      birthDate: "",
      breed: [],
      gender: null,
      description: "",
      adoptionStatus: "",
      parent: "",
      price: "",
      isCounselMode: false,
    });
  };

  const removeAnimal = (index: number) => {
    remove(index);
  };

  const updateAnimal = (
    index: number,
    updates: Partial<ProfileFormData["animals"][0]>
  ) => {
    const current = fields[index];
    update(index, { ...current, ...updates });
  };

  // 이름이 입력된 부모들만 필터링
  const availableParents = parents.filter(
    (parent) => parent.name.trim() !== ""
  );

  return (
    <div className="flex flex-col gap-8 items-center w-full">
      {/* 분양 중인 아이 항목들 */}
      <div className="flex flex-col gap-3 items-start w-full">
        {fields.map((animal, index) => {
          // React Hook Form의 watch로 해당 인덱스의 description 값 실시간 감시
          const descriptionValue = watch(`animals.${index}.description`) || "";
          return (
            <div
              key={animal.id}
              data-animal-index={index}
              className="flex flex-col gap-3 items-start w-full"
            >
              <div className="flex items-center justify-between w-full">
                <div className="flex flex-col font-semibold justify-center relative shrink-0 text-grayscale-gray6 text-body-xs">
                  <p className="leading-body-xs">
                    {fields.length === 1
                      ? "분양 중인 아이"
                      : `분양 중인 아이 ${index + 1}`}
                  </p>
                </div>
                {fields.length > 1 && (
                  <button
                    onClick={() => removeAnimal(index)}
                    className="flex gap-1 items-center relative shrink-0 cursor-pointer hover:opacity-80 transition-opacity"
                  >
                    <Trash />
                    <p className="font-medium leading-body-xs relative shrink-0 text-grayscale-gray5 text-body-xs text-nowrap">
                      삭제하기
                    </p>
                  </button>
                )}
              </div>

              {/* 아이 이미지 */}
              <div className="relative">
                <button
                  type="button"
                  onClick={() => {
                    const input = document.createElement("input");
                    input.type = "file";
                    input.accept = "image/*";
                    input.onchange = (e: Event) => {
                      const target = e.target as HTMLInputElement;
                      const file = target.files?.[0];
                      if (file) {
                        const reader = new FileReader();
                        reader.onload = (event: ProgressEvent<FileReader>) => {
                          if (event.target?.result) {
                            updateAnimal(index, {
                              imagePreview: event.target.result as string,
                              imageFile: file,
                            });
                          }
                        };
                        reader.readAsDataURL(file);
                      }
                    };
                    input.click();
                  }}
                  className="bg-white flex flex-col gap-0.5 items-center justify-center rounded-lg size-20 cursor-pointer transition-colors group overflow-hidden relative"
                >
                  {animal.imagePreview ? (
                    <Image
                      src={animal.imagePreview}
                      alt="Animal"
                      fill
                      className="object-contain rounded-lg"
                      unoptimized
                    />
                  ) : (
                    <Camera className="size-7 group-hover:[&_path]:fill-[#4F3B2E]" />
                  )}
                </button>
                {animal.imagePreview && (
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      updateAnimal(index, {
                        imagePreview: undefined,
                        imageFile: undefined,
                      });
                    }}
                    className="absolute top-1 right-1 bg-[var(--primary-500-basic,#4f3b2e)] rounded-full size-6 flex items-center justify-center hover:opacity-80 transition-opacity"
                  >
                    <PictureRemove />
                  </button>
                )}
              </div>

              {/* 이름과 성별 */}
              <div className="flex flex-col gap-[10px] w-full">
                <div className="flex gap-3 items-start relative shrink-0 w-full">
                  <Controller
                    name={`animals.${index}.name`}
                    control={control}
                    render={({ field }) => (
                      <Input {...field} placeholder="이름" />
                    )}
                  />
                  <Button
                    variant="maleGender"
                    className={cn(
                      "bg-white hover:bg-white flex items-center justify-center px-4 py-3 relative rounded-lg shrink-0 size-12 group",
                      animal.gender === "male" &&
                        "bg-[var(--color-gender-male-100)] hover:bg-[var(--color-gender-male-100)]"
                    )}
                    onClick={() =>
                      updateAnimal(index, {
                        gender: animal.gender === "male" ? null : "male",
                      })
                    }
                  >
                    <Male
                      className={cn(
                        "size-7 group-hover:[&_path]:fill-gender-male-500",
                        animal.gender === "male" &&
                          "[&_path]:fill-gender-male-500",
                        !animal.gender &&
                          errors.animals?.[index]?.gender &&
                          "[&_path]:fill-red-500"
                      )}
                    />
                  </Button>
                  <Button
                    variant="femaleGender"
                    className={cn(
                      "bg-white hover:bg-white flex items-center justify-center px-4 py-3 relative rounded-lg shrink-0 size-12 group",
                      animal.gender === "female" &&
                        "bg-[var(--color-gender-female-100)] hover:bg-[var(--color-gender-female-100)]"
                    )}
                    onClick={() =>
                      updateAnimal(index, {
                        gender: animal.gender === "female" ? null : "female",
                      })
                    }
                  >
                    <Female
                      className={cn(
                        "size-7 group-hover:[&_path]:fill-gender-female-500",
                        animal.gender === "female" &&
                          "[&_path]:fill-gender-female-500",
                        !animal.gender &&
                          errors.animals?.[index]?.gender &&
                          "[&_path]:fill-red-500"
                      )}
                    />
                  </Button>
                </div>
                {errors.animals?.[index]?.name && (
                  <ErrorMessage
                    message={
                      (errors.animals[index]?.name?.message as string) ||
                      BREEDER_PROFILE_ERROR.NAME_REQUIRED
                    }
                  />
                )}
              </div>

              {/* 생년월일 */}
              <div className="flex flex-col gap-[10px] w-full">
                <Controller
                  name={`animals.${index}.birthDate`}
                  control={control}
                  render={({ field }) => (
                    <Input
                      {...field}
                      placeholder="생년월일 (YYYYMMDD)"
                      className="px-[var(--space-16)] py-[var(--space-12)]"
                    />
                  )}
                />
                {errors.animals?.[index]?.birthDate && (
                  <ErrorMessage
                    message={
                      (errors.animals[index]?.birthDate?.message as string) ||
                      BREEDER_PROFILE_ERROR.BIRTH_DATE_REQUIRED
                    }
                  />
                )}
              </div>

              {/* 아이 소개 */}
              <Controller
                name={`animals.${index}.description`}
                control={control}
                render={({ field }) => (
                  <Textarea
                    {...field}
                    placeholder="아이의 성격과 특징에 대해 자유롭게 소개해주세요!"
                    maxLength={800}
                    showLength={true}
                    currentLength={String(descriptionValue).length}
                  />
                )}
              />

              {/* 품종 선택 */}
              <div className="space-y-2.5 w-full">
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button
                      variant="input"
                      size={undefined}
                      className="!px-[var(--space-16)] !py-[var(--space-12)] w-full"
                      disabled={selectedBreeds.length === 0}
                      onClick={(e) => {
                        if (selectedBreeds.length === 0) {
                          e.preventDefault();
                          e.stopPropagation();
                        }
                      }}
                    >
                      <div className="flex-1 text-left overflow-hidden text-ellipsis whitespace-nowrap">
                        {animal.breed.length > 0 ? (
                          <span className="text-[#4F3B2E]">
                            {animal.breed.join("/")}
                          </span>
                        ) : (
                          <span className="text-grayscale-gray5">품종</span>
                        )}
                      </div>
                      <Arrow className="size-5 text-[#4F3B2E]" />
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
                            "px-4 py-2 text-body-s font-medium cursor-pointer rounded text-grayscale-gray6 focus:bg-transparent focus:text-grayscale-gray6"
                          )}
                          onClick={() => {
                            updateAnimal(index, {
                              breed: animal.breed.includes(breed)
                                ? []
                                : [breed],
                            });
                            form.trigger(`animals.${index}.breed`);
                          }}
                        >
                          {breed}
                        </DropdownMenuItem>
                      ))
                    ) : (
                      <div className="px-4 py-2 text-body-s text-grayscale-gray5">
                        선택된 품종이 없습니다
                      </div>
                    )}
                  </DropdownMenuContent>
                </DropdownMenu>
                {errors.animals?.[index]?.breed && (
                  <ErrorMessage
                    message={
                      (errors.animals[index]?.breed?.message as string) ||
                      BREEDER_PROFILE_ERROR.BREEDS_REQUIRED
                    }
                  />
                )}
              </div>

              {/* 입양 상태 */}
              <div className="space-y-2.5 w-full">
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button
                      variant="input"
                      size={undefined}
                      className="!px-[var(--space-16)] !py-[var(--space-12)] w-full"
                    >
                      <div className="flex-1 text-left overflow-hidden text-ellipsis whitespace-nowrap">
                        {animal.adoptionStatus ? (
                          <span className="text-[#4F3B2E]">
                            {animal.adoptionStatus}
                          </span>
                        ) : (
                          <span className="text-grayscale-gray5">
                            입양 상태
                          </span>
                        )}
                      </div>
                      <Arrow className="size-5 text-[#4F3B2E]" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent
                    className="w-[var(--radix-dropdown-menu-trigger-width)] bg-white p-1 rounded-lg min-w-[353px]"
                    align="start"
                    side="bottom"
                    sideOffset={4}
                    avoidCollisions={false}
                  >
                    {["입양 가능", "입양 예정", "입양 완료"].map((status) => (
                      <DropdownMenuItem
                        key={status}
                        className={cn(
                          "px-4 py-2 text-body-s font-medium cursor-pointer rounded text-grayscale-gray6 focus:bg-transparent focus:text-grayscale-gray6"
                        )}
                        onClick={() => {
                          updateAnimal(index, {
                            adoptionStatus:
                              animal.adoptionStatus === status ? "" : status,
                          });
                          form.trigger(`animals.${index}.adoptionStatus`);
                        }}
                      >
                        {status}
                      </DropdownMenuItem>
                    ))}
                  </DropdownMenuContent>
                </DropdownMenu>
                {errors.animals?.[index]?.adoptionStatus && (
                  <ErrorMessage
                    message={
                      (errors.animals[index]?.adoptionStatus
                        ?.message as string) ||
                      BREEDER_PROFILE_ERROR.STATUS_REQUIRED
                    }
                  />
                )}
              </div>

              {/* 엄마 아빠 */}
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button
                    variant="input"
                    size={undefined}
                    className="!px-[var(--space-16)] !py-[var(--space-12)] w-full"
                    disabled={availableParents.length === 0}
                    onClick={(e) => {
                      if (availableParents.length === 0) {
                        e.preventDefault();
                        e.stopPropagation();
                      }
                    }}
                  >
                    <div className="flex-1 text-left overflow-hidden text-ellipsis whitespace-nowrap">
                      {animal.parent ? (
                        <span className="text-[#4F3B2E]">{animal.parent}</span>
                      ) : (
                        <span className="text-grayscale-gray5">
                          엄마 · 아빠
                        </span>
                      )}
                    </div>
                    <Arrow className="size-5 text-[#4F3B2E]" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent
                  className="w-[var(--radix-dropdown-menu-trigger-width)] bg-white p-1 rounded-lg min-w-[353px]"
                  align="start"
                  side="bottom"
                  sideOffset={4}
                  avoidCollisions={false}
                >
                  {availableParents.length > 0 ? (
                    availableParents.map((parent) => (
                      <DropdownMenuItem
                        key={parent.id}
                        className={cn(
                          "px-4 py-2 text-body-s font-medium cursor-pointer rounded text-grayscale-gray6 focus:bg-transparent focus:text-grayscale-gray6"
                        )}
                        onClick={() => {
                          updateAnimal(index, {
                            parent:
                              animal.parent === parent.name ? "" : parent.name,
                          });
                        }}
                      >
                        {parent.name}
                      </DropdownMenuItem>
                    ))
                  ) : (
                    <div className="px-4 py-2 text-body-s text-grayscale-gray5">
                      등록된 부모가 없습니다
                    </div>
                  )}
                </DropdownMenuContent>
              </DropdownMenu>

              {/* 입양 비용 */}
              <div className="flex flex-col gap-[10px] w-full">
                <div className="flex gap-3 items-center relative w-full flex-nowrap">
                  <PriceInput
                    placeholder={animal.isCounselMode ? "상담 후 공개" : "0"}
                    className="grow"
                    disabled={animal.isCounselMode}
                    value={animal.isCounselMode ? "" : animal.price}
                    onChange={(e) => {
                      updateAnimal(index, { price: e.target.value });
                      form.trigger(`animals.${index}.price`);
                    }}
                  />
                  <button
                    onClick={() => {
                      if (!animal.isCounselMode) {
                        // 상담 후 공개 모드로 전환 시 값 초기화
                        updateAnimal(index, {
                          price: "",
                          isCounselMode: !animal.isCounselMode,
                        });
                      } else {
                        updateAnimal(index, {
                          isCounselMode: !animal.isCounselMode,
                        });
                      }
                      form.trigger(`animals.${index}.price`);
                    }}
                    className="button-after-counsel shrink-0 whitespace-nowrap"
                  >
                    상담 후 공개하기
                  </button>
                </div>
                {errors.animals?.[index]?.price && (
                  <ErrorMessage
                    message={
                      (errors.animals[index]?.price?.message as string) ||
                      BREEDER_PROFILE_ERROR.PRICE_REQUIRED
                    }
                  />
                )}
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
        onClick={addAnimal}
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
