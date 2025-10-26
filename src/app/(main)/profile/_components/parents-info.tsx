import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import Camera from "@/assets/icons/camera";
import Arrow from "@/assets/icons/arrow";
import Male from "@/assets/icons/male";
import Female from "@/assets/icons/female";

export default function ParentsInfo() {
  return (
    <div className="flex flex-col gap-8 items-center w-full">
      <div className="flex flex-col gap-3 items-start w-full">
        <div className="flex flex-col font-semibold justify-center min-w-full relative shrink-0 text-grayscale-gray6 text-body-xs w-min">
          <p className="leading-body-xs">엄마 · 아빠</p>
        </div>

        {/* 부모 이미지 */}
        <div className="bg-white flex flex-col gap-0.5 items-center justify-center rounded-lg size-20">
          <Camera className="size-7" />
        </div>

        {/* 이름과 성별 */}
        <div className="flex gap-3 items-start relative shrink-0 w-full">
          <div className="flex flex-col gap-2.5 grow items-start min-h-px min-w-px relative shrink-0">
            <div className="bg-white flex h-12 items-center overflow-hidden px-4 py-3 rounded-lg w-full">
              <div className="flex flex-col font-medium grow justify-center min-h-px min-w-px relative shrink-0 text-grayscale-gray5 text-body-s">
                <p className="leading-body-s">이름</p>
              </div>
            </div>
          </div>
          <Button className="bg-white flex items-center justify-center px-4 py-3 relative rounded-lg shrink-0 size-12">
            <Male className="size-7" />
          </Button>
          <Button className="bg-white flex items-center justify-center px-4 py-3 relative rounded-lg shrink-0 size-12">
            <Female className="size-7" />
          </Button>
        </div>

        {/* 생년월일 */}
        <div className="flex flex-col gap-2.5 items-start w-full">
          <div className="bg-white flex h-12 items-center overflow-hidden px-4 py-3 rounded-lg w-full">
            <div className="flex flex-col font-medium grow justify-center min-h-px min-w-px relative shrink-0 text-grayscale-gray5 text-body-s">
              <p className="leading-body-s">생년월일 (YYYYMMDD)</p>
            </div>
          </div>
        </div>

        {/* 품종 선택 */}
        <div className="flex flex-col gap-2.5 items-start w-full">
          <div className="bg-white flex h-12 items-center overflow-hidden rounded-lg w-full">
            <div className="flex gap-2.5 grow items-center justify-center min-h-px min-w-px pl-4 pr-2 py-3 relative shrink-0">
              <div className="flex flex-col font-medium grow justify-center min-h-px min-w-px overflow-ellipsis overflow-hidden relative shrink-0 text-grayscale-gray5 text-body-s text-nowrap">
                <p className="leading-body-s overflow-ellipsis overflow-hidden">
                  품종
                </p>
              </div>
            </div>
            <div className="bg-white flex gap-2.5 h-12 items-center pl-1 pr-3.5 py-0 relative rounded-br-lg rounded-tr-lg shrink-0">
              <div className="relative shrink-0 size-5">
                <Arrow className="size-5 rotate-90" />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* 추가하기 버튼 */}
      <Button className="bg-tertiary-700 flex gap-1 items-center overflow-hidden pl-3 pr-5 py-2.5 relative rounded-full shrink-0">
        <div className="overflow-hidden relative shrink-0 size-7">
          <div className="absolute contents left-1.5 top-1.5">
            <div className="absolute bg-grayscale-gray6 h-0.5 left-1.5 top-3 w-3" />
            <div className="absolute bg-grayscale-gray6 h-3 left-3 top-1.5 w-0.5" />
          </div>
        </div>
        <p className="font-medium leading-body-s relative shrink-0 text-grayscale-gray6 text-body-s text-center text-nowrap">
          추가하기
        </p>
      </Button>
    </div>
  );
}
