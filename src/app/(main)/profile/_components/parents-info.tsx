import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
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
import BreedsSelectDialogTrigger from "@/app/signup/_components/breeds-select-dialog-trigger";

interface ParentItem {
  id: string;
  name: string;
  birthDate: string;
  breed: string[];
  gender: "male" | "female" | null;
  imagePreview?: string;
  imageFile?: File;
}

export default function ParentsInfo() {
  const defaultParentId = useMemo(() => `parent-default-${Date.now()}`, []);
  const [parents, setParents] = useState<ParentItem[]>([
    {
      id: defaultParentId,
      name: "",
      birthDate: "",
      breed: [],
      gender: null,
    },
  ]);
  const [animal] = useState<"dog" | "cat">("dog");

  const addParent = () => {
    const newParent: ParentItem = {
      id: `parent-${Date.now()}-${Math.random()}`,
      name: "",
      birthDate: "",
      breed: [],
      gender: null,
    };
    setParents([...parents, newParent]);
  };

  const removeParent = (id: string) => {
    setParents(parents.filter((parent) => parent.id !== id));
  };

  const updateParent = (id: string, updates: Partial<ParentItem>) => {
    setParents(
      parents.map((parent) =>
        parent.id === id ? { ...parent, ...updates } : parent
      )
    );
  };

  return (
    <div className="flex flex-col gap-8 items-center w-full">
      {/* 부모 항목들 */}
      <div className="flex flex-col gap-3 items-start w-full">
        {parents.map((parent, index) => (
          <div
            key={parent.id}
            className="flex flex-col gap-3 items-start w-full"
          >
            <div className="flex items-center justify-between w-full">
              <div className="flex flex-col font-semibold justify-center relative shrink-0 text-grayscale-gray6 text-body-xs">
                <p className="leading-body-xs">
                  {parents.length === 1
                    ? "엄마 · 아빠"
                    : `엄마 · 아빠 ${index + 1}`}
                </p>
              </div>
              {parent.id !== defaultParentId && (
                <button
                  onClick={() => removeParent(parent.id)}
                  className="flex gap-1 items-center relative shrink-0 cursor-pointer hover:opacity-80 transition-opacity"
                >
                  <Trash />
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
                          updateParent(parent.id, {
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
                {parent.imagePreview ? (
                  <Image
                    src={parent.imagePreview}
                    alt="Parent"
                    fill
                    className="object-contain rounded-lg"
                    unoptimized
                  />
                ) : (
                  <Camera className="size-7 group-hover:[&_path]:fill-[#4F3B2E]" />
                )}
              </button>
              {parent.imagePreview && (
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    updateParent(parent.id, {
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
                value={parent.name}
                onChange={(e) =>
                  updateParent(parent.id, { name: e.target.value })
                }
              />
              <Button
                variant="maleGender"
                className={cn(
                  "bg-white hover:bg-white flex items-center justify-center px-4 py-3 relative rounded-lg shrink-0 size-12 group",
                  parent.gender === "male" &&
                    "bg-[var(--color-gender-male-100)] hover:bg-[var(--color-gender-male-100)]"
                )}
                onClick={() =>
                  updateParent(parent.id, {
                    gender: parent.gender === "male" ? null : "male",
                  })
                }
              >
                <Male
                  className={cn(
                    "size-7 group-hover:[&_path]:fill-gender-male-500",
                    parent.gender === "male" && "[&_path]:fill-gender-male-500"
                  )}
                />
              </Button>
              <Button
                variant="femaleGender"
                className={cn(
                  "bg-white hover:bg-white flex items-center justify-center px-4 py-3 relative rounded-lg shrink-0 size-12 group",
                  parent.gender === "female" &&
                    "bg-[var(--color-gender-female-100)] hover:bg-[var(--color-gender-female-100)]"
                )}
                onClick={() =>
                  updateParent(parent.id, {
                    gender: parent.gender === "female" ? null : "female",
                  })
                }
              >
                <Female
                  className={cn(
                    "size-7 group-hover:[&_path]:fill-gender-female-500",
                    parent.gender === "female" &&
                      "[&_path]:fill-gender-female-500"
                  )}
                />
              </Button>
            </div>
            <Input
              placeholder="생년월일 (YYYYMMDD)"
              value={parent.birthDate}
              onChange={(e) =>
                updateParent(parent.id, { birthDate: e.target.value })
              }
            />
            <BreedsSelectDialogTrigger
              animal={animal!}
              onSubmitBreeds={(breeds) =>
                updateParent(parent.id, { breed: breeds })
              }
              asChild
            >
              <Button variant="input" className="py-3 px-4 pr-3.5 ">
                <div className="flex-1 text-left overflow-hidden text-ellipsis whitespace-nowrap">
                  {parent.breed.length > 0 ? (
                    <span className="text-[#4F3B2E]">
                      {parent.breed.join("/")}
                    </span>
                  ) : (
                    <span>품종</span>
                  )}
                </div>
                <Arrow className="size-5 text-[#4F3B2E]" />
              </Button>
            </BreedsSelectDialogTrigger>

            {/* 구분선 (마지막 항목이 아닐 때만) */}
            {index < parents.length - 1 && (
              <div className="pt-8 pb-8 w-full -mt-3">
                <div className="h-px bg-grayscale-gray2 w-full" />
              </div>
            )}
          </div>
        ))}
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
