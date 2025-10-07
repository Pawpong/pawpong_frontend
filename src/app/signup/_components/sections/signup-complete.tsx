import SignupFormItems from "@/components/signup-form-section/signup-form-items";
import SignupFormSection from "@/components/signup-form-section/signup-form-section";
import { Button } from "@/components/ui/button";

export default function SignupComplete() {
  return (
    <SignupFormSection className="gap-8 md:gap-8 lg:gap-8">
      <div className="w-full max-w-100 aspect-[4/3] bg-accent" />
      <div className="space-y-3 text-center">
        <div className="text-balance text-body-m text-primary/80 font-medium">
          포퐁에 오신 걸 환영해요!
          <br /> 브리더 심사는{" "}
          <span className="text-secondary-700">최대 3영업일</span> 정도 소요될
          수 있어요.
          <br />
          제출한 서류를 변경하고 싶거나, <br />
          궁금한 점이 있으면 고객센터로 문의해 주세요.
        </div>
        <div className="flex gap-2 text-sm leading-[140%] tracking-[-2%] justify-center">
          <div>이메일 문의</div>
          <a
            className="text-secondary-700 underline"
            href="mailto:pawriendsofficial@gmail.com"
            target="_blank"
            rel="noreferrer"
          >
            pawriendsofficial@gmail.com
          </a>
        </div>
      </div>
      <SignupFormItems className="flex flex-col gap-3">
        <Button variant={"tertiary"} className="py-3 px-4 w-full">
          홈으로
        </Button>
        <Button className="bg-grayscale-gray2 !text-primary py-3 px-4 w-full hover:bg-grayscale-gray3 hover:!text-primary">
          문의하기
        </Button>
      </SignupFormItems>
    </SignupFormSection>
  );
}
