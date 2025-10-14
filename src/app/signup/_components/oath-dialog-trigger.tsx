import Close from "@/assets/icons/close";
import { Button } from "@/components/ui/button";
import {
  LargeDialog,
  LargeDialogClose,
  LargeDialogContent,
  LargeDialogFooter,
  LargeDialogHeader,
  LargeDialogTitle,
  LargeDialogTrigger,
} from "@/components/ui/large-dialog";
import * as DialogPrimitive from "@radix-ui/react-dialog";
import React from "react";

const oathInfo: Record<"elite" | "new", React.ReactNode> = {
  elite: (
    <>
      <p>
        본인은 <span className="text-primary">포퐁 플랫폼 브리더 회원</span>으로
        입점함에 있어, 아래의 기준을 충실히 준수할 것을 서약합니다. 만약 이를
        위반하거나 허위 사실이 적발될 경우, 플랫폼에서 즉시 퇴출될 수 있음을
        이해하며 이에 동의합니다.
      </p>
      {[
        <p key={0}>
          본인은{" "}
          <span className="text-primary">관할 지자체에 동물생산업 등록</span>을
          완료하였으며, 관련 법규를 성실히 준수합니다.
        </p>,
        <p key={1}>
          모든 분양 과정에서{" "}
          <span className="text-primary">표준 입양계약서</span>를 작성합니다.
        </p>,
        <p key={2}>
          <span className="text-primary">2종 이하 브리딩 원칙</span>을 지키며,
          다품종 브리딩을 하지 않습니다.
        </p>,
        <p key={3}>
          모든 아이들은{" "}
          <span className="text-primary">중성화 완료 후 분양</span>하거나, 입양
          계약서에 반드시 중성화 조항을 명시합니다.
        </p>,
        <p key={4}>
          모든 아이들은{" "}
          <span className="text-primary">3차 종합백신 완료 후</span> 분양합니다.
        </p>,
        <p key={5}>
          <span className="text-primary">혈통서 발급</span>을 의무화하며, 공식
          협회 발급 혈통서만 제공합니다.
        </p>,
        <p key={6}>
          모든 아이들은 반드시{" "}
          <span className="text-primary">생후 3개월 이후</span>에만 분양합니다.
        </p>,
        <p key={7}>
          국내에서 진행되는 모든 분양은 반드시{" "}
          <span className="text-primary">대면 분양</span>으로 진행하며,
          비대면·택배 분양은 절대 하지 않습니다.
        </p>,
        <p key={8}>
          분양 개체의 사회화, 건강, 복지를 최우선으로 하며, 무분별한 번식을 하지
          않습니다.
        </p>,
        <p key={9}>
          포퐁 플랫폼과 입양자에게{" "}
          <span className="text-primary">
            허위 사실 없이 투명하게 정보를 제공
          </span>
          합니다.
        </p>,
      ].map((e) => (
        <div className="flex gap-2 items-start" key={e.key}>
          <div className="h-5 flex items-center">
            <div className="size-[3px] bg-grayscale-gray5 rounded-full " />
          </div>
          {e}
        </div>
      ))}
    </>
  ),
  new: (
    <>
      <p>
        본인은 <span className="text-primary">포퐁 플랫폼 브리더 회원</span>으로
        입점함에 있어, 아래의 기준을 충실히 준수할 것을 서약합니다. 만약 이를
        위반하거나 허위 사실이 적발될 경우, 플랫폼에서 즉시 퇴출될 수 있음을
        이해하며 이에 동의합니다.
      </p>
      {[
        <p key={0}>
          본인은{" "}
          <span className="text-primary">관할 지자체에 동물생산업 등록</span>을
          아님을 확인합니다.
        </p>,
        <p key={1}>
          모든 아이들은 반드시{" "}
          <span className="text-primary">생후 3개월 이후</span>에만 분양합니다.
        </p>,
        <p key={2}>
          국내에서 진행되는 모든 분양은 반드시{" "}
          <span className="text-primary">대면 분양</span>으로 진행하며,
          비대면·택배 분양은 절대 하지 않습니다.
        </p>,
        <p key={3}>
          분양 개체의 사회화, 건강, 복지를 최우선으로 하며, 무분별한 번식을 하지
          않습니다.
        </p>,
        <p key={4}>
          포퐁 플랫폼과 입양자에게{" "}
          <span className="text-primary">
            허위 사실 없이 투명하게 정보를 제공
          </span>
          합니다.
        </p>,
      ].map((e) => (
        <div className="flex gap-2 items-start" key={e.key}>
          <div className="h-5 flex items-center">
            <div className="size-[3px] bg-grayscale-gray5 rounded-full " />
          </div>
          {e}
        </div>
      ))}
    </>
  ),
};

export default function OathDialogTrigger({
  onAgree,
  level,
  ...props
}: { onAgree: () => void; level: "elite" | "new" } & React.ComponentProps<
  typeof DialogPrimitive.Trigger
>) {
  return (
    <LargeDialog>
      <LargeDialogTrigger {...props} />
      <LargeDialogContent className="flex flex-col">
        <LargeDialogHeader>
          <LargeDialogTitle>
            <div className="flex justify-between items-center">
              {level === "elite" ? "엘리트" : "뉴"} 레벨 브리더 입점 서약서
              <LargeDialogClose asChild>
                <Button variant="secondary" className="size-9">
                  <Close className="size-5 text-grayscale-gray7" />
                </Button>
              </LargeDialogClose>
            </div>
          </LargeDialogTitle>
        </LargeDialogHeader>

        <div className="sm:py-5 sm:px-6 space-y-2 text-body-xs text-grayscale-gray5 overflow-auto px-padding py-4 flex-1">
          <p>
            본인은 포퐁 플랫폼 브리더 회원으로 입점함에 있어, 아래의 기준을
            충실히 준수할 것을 서약합니다. 만약 이를 위반하거나 허위 사실이
            적발될 경우, 플랫폼에서 즉시 퇴출될 수 있음을 이해하며 이에
            동의합니다.
          </p>
          {oathInfo[level]}
        </div>

        <LargeDialogFooter>
          <LargeDialogClose asChild>
            <Button
              className="py-2 px-4 text-sm leading-[140%] tracking-[-2%] w-18 text-white! rounded-[--spacing(1)]"
              onClick={() => {
                onAgree();
              }}
            >
              동의
            </Button>
          </LargeDialogClose>
        </LargeDialogFooter>
      </LargeDialogContent>
    </LargeDialog>
  );
}
