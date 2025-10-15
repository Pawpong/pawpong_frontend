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

const contents = [
  <p key={0}>
    본 약관은 포퐁(이하 “회사”)이 제공하는 온라인 반려동물 입양·분양 연결 플랫폼
    서비스(이하 “서비스”)의 이용조건 및 절차, 회사와 회원 간의 권리·의무 및
    책임사항, 기타 필요한 사항을 규정합니다.
  </p>,
  <p key={1}>
    제1조 (목적)
    <br /> 본 약관은 회사가 제공하는 서비스의 이용과 관련하여 회사와 회원 간의
    권리·의무 및 책임사항을 정하는 것을 목적으로 합니다.
  </p>,
  <p key={2}>
    제2조 (정의)
    <br /> 서비스: 반려동물 브리더와 입양 희망자를 연결하기 위해 회사가 운영하는
    온라인 플랫폼을 의미합니다. 회원: 본 약관에 따라 회사와 이용계약을 체결하고
    서비스를 이용하는 자를 말하며, 다음과 같이 구분됩니다. 브리더 회원: 반려동물
    번식 및 분양을 목적으로 서비스를 이용하는 회원 일반 회원: 반려동물 분양·입양
    정보를 열람하거나 상담·신청 등을 위해 서비스를 이용하는 회원 계정: 회원이
    서비스 이용을 위하여 설정한 로그인 아이디와 비밀번호 등 식별정보를
    의미합니다. 게시물: 회원이 서비스 이용 과정에서 작성·등록하는 글, 이미지,
    후기, 댓글, 신고 등을 의미합니다.
  </p>,
  <p key={3}>
    제3조 (약관의 효력 및 변경)
    <br /> 본 약관은 서비스를 이용하고자 하는 모든 회원에게 적용됩니다. 회사는
    관련 법령을 위배하지 않는 범위에서 본 약관을 변경할 수 있습니다. 약관 변경
    시 회사는 적용일자 및 개정 사유를 명시하여 시행일 7일 전부터 서비스 내
    공지합니다.
  </p>,
  <p key={4}>
    제4조 (이용계약 체결)
    <br /> 서비스 회원가입은 별도의 연령 제한을 두지 않으며, 만 14세 미만 아동의
    경우 법정대리인의 동의가 필요할 수 있습니다. 회원가입은 회사가 정한
    절차(이메일·소셜 로그인 등)에 따라 신청하고, 회사가 이를 승인함으로써
    성립됩니다. 회사는 다음 각 호에 해당하는 신청에 대해서는 승낙하지 않거나
    사후에 계약을 해지할 수 있습니다. 허위 정보를 기재하거나 타인의 명의를
    도용한 경우 법령 위반 또는 사회질서 저해 목적이 명백한 경우
  </p>,
  <p key={5}>
    제5조 (회원의 의무)
    <br /> 1. 공통 의무 회원은 서비스 이용 시 관련 법령, 본 약관, 회사의
    운영정책을 준수해야 합니다. 회원은 타인의 권리를 침해하거나, 허위·불법
    정보를 게시해서는 안 됩니다. 회원은 회사의 사전 동의 없이 서비스를 상업적
    광고, 홍보, 재판매 등의 목적으로 이용할 수 없습니다. 2. 브리더 회원의 의무
    및 책임 브리더 회원은 분양하는 모든 반려동물에 대해 계약서 작성을 원칙으로
    하며, 법령 및 동물보호 관련 규정을 준수해야 합니다. 브리더 회원은 허위
    사실(품종, 건강 상태, 혈통, 예방접종 여부 등)을 기재해서는 안 되며, 위반 시
    계정 정지 또는 퇴출될 수 있습니다. 브리더 회원은 합법적인 등록·운영
    상태에서만 서비스를 이용할 수 있으며, 무등록 브리딩 또는 불법 판매행위는
    금지됩니다. 브리더 회원은 반려동물의 복지와 건강을 최우선으로 고려해야 하며,
    부적절한 사육환경을 제공하거나 과도한 번식을 해서는 안 됩니다. 브리더 회원은
    상담·신청을 받은 일반 회원에 대해 성실하게 응답할 책임이 있습니다. 3. 일반
    회원의 의무 및 책임 일반 회원은 브리더 회원과 상담·신청을 진행할 때 허위
    정보를 기재해서는 안 됩니다. 일반 회원은 분양받은 반려동물의 복지를 보장할
    책임이 있으며, 유기·학대 행위 등은 법적 처벌을 받을 수 있습니다. 일반 회원은
    상담 또는 후기 작성 과정에서 욕설·비방·허위 사실 유포 등 타인의 권리를
    침해하는 행위를 해서는 안 됩니다. 일반 회원은 계약 및 분양 조건을 충분히
    숙지한 뒤 신청해야 하며, 일방적 파기 등으로 피해를 발생시켜서는 안 됩니다.
  </p>,
  <p key={6}>
    제6조 (서비스의 제공 및 변경)
    <br /> 회사는 회원에게 검색, 프로필 열람, 상담신청, 후기 작성, 신고 등
    서비스를 제공합니다. 회사는 서비스의 일부 또는 전부를 변경·중단할 수 있으며,
    중요한 변경 시 사전 공지합니다.
  </p>,
  <p key={7}>
    제7조 (계약의 해지 및 탈퇴) <br />
    회원은 언제든지 서비스 내 절차를 통해 탈퇴할 수 있습니다. 회사는 회원이 다음
    각 호에 해당하는 경우 사전 통보 후 이용계약을 해지할 수 있습니다. 반복적인
    허위 정보 제공 불법 브리딩, 불법 거래, 동물 학대 등 법령 위반 서비스 운영을
    방해하는 행위
  </p>,
  <p key={8}>
    제8조 (면책)
    <br /> 회사는 회원 간의 상담, 계약, 분양 과정에 직접 개입하지 않으며,
    발생하는 분쟁의 책임은 해당 회원에게 있습니다. 회사는 회원 간 분쟁에 대한
    중재나 조정을 제공할 수 있으나 법적 책임을 부담하지 않습니다.
  </p>,
  <p key={9}>
    제9조 (기타)
    <br /> 본 약관에 명시되지 않은 사항은 관련 법령 및 일반 상관례에 따릅니다.
    본 약관은 2025년 12월 23일부터 적용됩니다.
  </p>,
];

export default function TermDialogTrigger({
  onAgree,

  ...props
}: { onAgree: () => void } & React.ComponentProps<
  typeof DialogPrimitive.Trigger
>) {
  return (
    <LargeDialog>
      <LargeDialogTrigger {...props} />
      <LargeDialogContent className="flex flex-col">
        <LargeDialogHeader>
          <LargeDialogTitle>
            <div className="flex justify-between items-center">
              서비스 이용약관
              <LargeDialogClose asChild>
                <Button variant="secondary" className="size-9">
                  <Close className="size-5 text-grayscale-gray7" />
                </Button>
              </LargeDialogClose>
            </div>
          </LargeDialogTitle>
        </LargeDialogHeader>

        <div className="sm:py-5 sm:px-6 space-y-5 text-body-xs text-grayscale-gray6 overflow-auto px-padding py-4 flex-1 ">
          {contents}
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
