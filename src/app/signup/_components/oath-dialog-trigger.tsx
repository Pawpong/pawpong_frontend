import Close from '@/assets/icons/close';
import { Button } from '@/components/ui/button';
import {
  LargeDialog,
  LargeDialogClose,
  LargeDialogContent,
  LargeDialogFooter,
  LargeDialogHeader,
  LargeDialogTitle,
  LargeDialogTrigger,
} from '@/components/ui/large-dialog';
import * as DialogPrimitive from '@radix-ui/react-dialog';
import React from 'react';

const oathInfo: Record<'elite' | 'new', React.ReactNode> = {
  elite: (
    <div className="flex flex-col gap-2">
      <p>
        본인은 포퐁 플랫폼 브리더 회원으로 입점함에 있어, 아래의 기준을 충실히 준수할 것을 서약합니다. 만약 이를
        위반하거나 허위 사실이 적발될 경우, 플랫폼에서 즉시 퇴출될 수 있음을 이해하며 이에 동의합니다.
      </p>
      {[
        <p key={0}>
          본인은 <span className="text-primary-600">관할 지자체에 동물생산업 등록</span>을 완료하였으며, 관련 법규를
          성실히 준수합니다.
        </p>,
        <p key={1}>
          모든 분양 과정에서 <span className="text-primary-600">표준 입양계약서</span>를 작성합니다.
        </p>,
        <p key={2}>
          <span className="text-primary-600">2종 이하 브리딩 원칙</span>을 지키며, 다품종 브리딩을 하지 않습니다.
        </p>,
        <p key={4}>
          모든 아이들은 반드시 <span className="text-primary-600">생후 2개월(8주) 이후</span>에만 분양합니다.
        </p>,
        <p key={5}>
          국내에서 진행되는 모든 분양은 반드시 <span className="text-primary-600">대면 분양</span>으로 진행하며,
          비대면·택배 분양은 절대 하지 않습니다.
        </p>,
        <p key={6}>분양 개체의 사회화, 건강, 복지를 최우선으로 하며, 무분별한 번식을 하지 않습니다.</p>,
        <p key={7}>분양 과정에서 반려동물의 건강과 복지를 우선시하며, 불필요하거나 무분별한 번식을 하지 않습니다.</p>,
        <p key={8}>
          포퐁 플랫폼과 입양자에게 <span className="text-primary-600">허위 사실 없이 투명하게 정보를 제공</span>
          합니다.
        </p>,
      ].map((item) => (
        <div className="flex gap-2 items-center" key={item.key}>
          <div className="size-[3px] bg-grayscale-gray5 rounded-full shrink-0" />
          {item}
        </div>
      ))}
    </div>
  ),
  new: (
    <div className="flex flex-col gap-2">
      <p>
        본인은 포퐁 플랫폼 브리더 회원으로 입점함에 있어, 아래의 최소 기준을 성실히 준수할 것을 서약합니다. 만약 이를
        위반하거나 허위 사실이 적발될 경우, 플랫폼에서 즉시 퇴출될 수 있음을 이해하며 이에 동의합니다.
      </p>
      {[
        <p key={0}>
          본인은 <span className="text-primary-600">관할 지자체에 동물생산업 등록</span>을 완료하였으며, 법적으로
          판매업이 아님을 확인합니다.
        </p>,
        <p key={1}>
          모든 분양 개체는 반드시 <span className="text-primary-600">생후 2개월(8주) 이후</span>에만 분양합니다.
        </p>,
        <p key={2}>
          국내에서 진행되는 모든 분양은 반드시 <span className="text-primary-600">대면 분양</span>으로 진행하며,
          비대면·택배 분양은 절대 하지 않습니다.
        </p>,
        <p key={3}>분양 과정에서 반려동물의 건강과 복지를 우선시하며, 불필요하거나 무분별한 번식을 하지 않습니다.</p>,
        <p key={4}>
          포퐁 플랫폼과 입양자에게 <span className="text-primary-600">허위 사실 없이 투명하게 정보를 제공</span>
          합니다.
        </p>,
      ].map((item) => (
        <div className="flex gap-2 items-center" key={item.key}>
          <div className="size-[3px] bg-grayscale-gray5 rounded-full shrink-0 " />
          {item}
        </div>
      ))}
    </div>
  ),
};

export default function OathDialogTrigger({
  onAgree,
  level,
  isReadOnly = false,
  ...props
}: {
  onAgree: () => void;
  level: 'elite' | 'new';
  isReadOnly?: boolean;
} & React.ComponentProps<typeof DialogPrimitive.Trigger>) {
  return (
    <LargeDialog>
      <LargeDialogTrigger {...props} />
      <LargeDialogContent className="flex flex-col">
        <LargeDialogHeader>
          <LargeDialogTitle>
            <div className="flex justify-between items-center">
              {level === 'elite' ? '엘리트 레벨 브리더 입점 서약서' : '뉴 레벨 브리더 입점 서약서'}
              <LargeDialogClose asChild>
                <Button variant="secondary" className="size-9">
                  <Close className="size-5 text-grayscale-gray7" />
                </Button>
              </LargeDialogClose>
            </div>
          </LargeDialogTitle>
        </LargeDialogHeader>

        <div className="md:py-5 md:px-6 text-body-xs text-grayscale-gray5 overflow-auto px-padding py-4 flex-1">
          {oathInfo[level]}
        </div>

        <LargeDialogFooter className="justify-end">
          <LargeDialogClose asChild>
            <Button
              variant="tertiary"
              className="py-2 px-4 text-sm leading-[140%] text-primary-500 tracking-[-2%] w-18  rounded-[--spacing(1)]"
              onClick={() => {
                if (!isReadOnly) {
                  onAgree();
                }
              }}
              disabled={isReadOnly}
            >
              동의
            </Button>
          </LargeDialogClose>
        </LargeDialogFooter>
      </LargeDialogContent>
    </LargeDialog>
  );
}
