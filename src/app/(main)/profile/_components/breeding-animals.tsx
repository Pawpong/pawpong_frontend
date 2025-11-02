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
import { useState, useMemo } from "react";
import { cn } from "@/lib/utils";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

interface BreedingAnimalItem {
  id: string;
  name: string;
  birthDate: string;
  breed: string[];
  gender: "male" | "female" | null;
  imagePreview?: string;
  imageFile?: File;
  description: string;
  adoptionStatus: string;
  parent: string;
  price: string;
  isCounselMode: boolean;
}

interface ParentItem {
  id: string;
  name: string;
  birthDate: string;
  breed: string[];
  gender: "male" | "female" | null;
  imagePreview?: string;
  imageFile?: File;
}

export default function BreedingAnimals({
  selectedBreeds,
  parents,
}: {
  selectedBreeds: string[];
  parents: ParentItem[];
}) {
  const defaultAnimalId = useMemo(() => `animal-default-${Date.now()}`, []);
  const [animals, setAnimals] = useState<BreedingAnimalItem[]>([
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
  ]);

  const addAnimal = () => {
    const newAnimal: BreedingAnimalItem = {
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
    };
    setAnimals([...animals, newAnimal]);
  };

  const removeAnimal = (id: string) => {
    setAnimals(animals.filter((animal) => animal.id !== id));
  };

  const updateAnimal = (id: string, updates: Partial<BreedingAnimalItem>) => {
    setAnimals(
      animals.map((animal) =>
        animal.id === id ? { ...animal, ...updates } : animal
      )
    );
  };

  // 이름이 입력된 부모들만 필터링
  const availableParents = parents.filter(
    (parent) => parent.name.trim() !== ""
  );

  return (
    <div className="flex flex-col gap-8 items-center w-full">
      {/* 분양 중인 아이 항목들 */}
      <div className="flex flex-col gap-3 items-start w-full">
        {animals.map((animal, index) => (
          <div
            key={animal.id}
            className="flex flex-col gap-3 items-start w-full"
          >
            <div className="flex items-center justify-between w-full">
              <div className="flex flex-col font-semibold justify-center relative shrink-0 text-grayscale-gray6 text-body-xs">
                <p className="leading-body-xs">
                  {animals.length === 1
                    ? "분양 중인 아이"
                    : `분양 중인 아이 ${index + 1}`}
                </p>
              </div>
              {animals.length > 1 && (
                <button
                  onClick={() => removeAnimal(animal.id)}
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
                          updateAnimal(animal.id, {
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
                    updateAnimal(animal.id, {
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
            <div className="flex gap-3 items-start relative shrink-0 w-full">
              <Input
                placeholder="이름"
                value={animal.name}
                onChange={(e) =>
                  updateAnimal(animal.id, { name: e.target.value })
                }
              />
              <Button
                variant="maleGender"
                className={cn(
                  "bg-white hover:bg-white flex items-center justify-center px-4 py-3 relative rounded-lg shrink-0 size-12 group",
                  animal.gender === "male" &&
                    "bg-[var(--color-gender-male-100)] hover:bg-[var(--color-gender-male-100)]"
                )}
                onClick={() =>
                  updateAnimal(animal.id, {
                    gender: animal.gender === "male" ? null : "male",
                  })
                }
              >
                <Male
                  className={cn(
                    "size-7 group-hover:[&_path]:fill-gender-male-500",
                    animal.gender === "male" && "[&_path]:fill-gender-male-500"
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
                  updateAnimal(animal.id, {
                    gender: animal.gender === "female" ? null : "female",
                  })
                }
              >
                <Female
                  className={cn(
                    "size-7 group-hover:[&_path]:fill-gender-female-500",
                    animal.gender === "female" &&
                      "[&_path]:fill-gender-female-500"
                  )}
                />
              </Button>
            </div>

            {/* 생년월일 */}
            <Input
              placeholder="생년월일 (YYYYMMDD)"
              value={animal.birthDate}
              onChange={(e) =>
                updateAnimal(animal.id, { birthDate: e.target.value })
              }
              className="px-[var(--space-16)] py-[var(--space-12)]"
            />

            {/* 아이 소개 */}
            <Textarea
              placeholder="아이의 성격과 특징에 대해 자유롭게 소개해주세요!"
              value={animal.description}
              onChange={(e) =>
                updateAnimal(animal.id, { description: e.target.value })
              }
              maxLength={800}
              showLength={true}
            />

            {/* 품종 선택 */}
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
                        updateAnimal(animal.id, {
                          breed: animal.breed.includes(breed) ? [] : [breed],
                        });
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

            {/* 입양 상태 */}
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
                      <span className="text-grayscale-gray5">입양 상태</span>
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
                      updateAnimal(animal.id, {
                        adoptionStatus:
                          animal.adoptionStatus === status ? "" : status,
                      });
                    }}
                  >
                    {status}
                  </DropdownMenuItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>

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
                      <span className="text-grayscale-gray5">엄마 · 아빠</span>
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
                        updateAnimal(animal.id, {
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
            <div className="flex gap-3 items-center relative w-full flex-nowrap">
              <PriceInput
                placeholder={animal.isCounselMode ? "상담 후 공개" : "0"}
                className="grow"
                disabled={animal.isCounselMode}
                value={animal.isCounselMode ? "" : animal.price}
                onChange={(e) =>
                  updateAnimal(animal.id, { price: e.target.value })
                }
              />
              <button
                onClick={() => {
                  if (!animal.isCounselMode) {
                    // 상담 후 공개 모드로 전환 시 값 초기화
                    updateAnimal(animal.id, {
                      price: "",
                      isCounselMode: !animal.isCounselMode,
                    });
                  } else {
                    updateAnimal(animal.id, {
                      isCounselMode: !animal.isCounselMode,
                    });
                  }
                }}
                className="button-after-counsel shrink-0 whitespace-nowrap"
              >
                상담 후 공개하기
              </button>
            </div>

            {/* 구분선 (마지막 항목이 아닐 때만) */}
            {index < animals.length - 1 && (
              <div className="pt-8 pb-8 w-full -mt-3">
                <div className="h-px bg-grayscale-gray2 w-full" />
              </div>
            )}
          </div>
        ))}
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
