'use client';

import SignupFormItems from '@/components/signup-form-section/signup-form-items';
import SignupFormSection from '@/components/signup-form-section/signup-form-section';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import useSignupFormStore from '@/stores/signup-form-store';

export default function SignupComplete() {
  const documentsSkipped = useSignupFormStore((e) => e.documentsSkipped);
  const userType = useSignupFormStore((e) => e.userType);

  // 브리더이고 서류를 건너뛴 경우
  const isBreederSkipped = userType === 'breeder' && documentsSkipped;

  return (
    <SignupFormSection className="gap-8 md:gap-8 lg:gap-8">
      <div className="w-full max-w-100 aspect-[4/3] bg-accent" />
      <div className="space-y-3 text-center">
        {isBreederSkipped ? (
          <>
            <div className="text-balance text-body-m text-primary/80 font-medium">
              포퐁에 오신 걸 환영해요!
              <br />
              미제출 서류는 <span className="text-secondary-700">&apos;마이&apos;</span>에서 추가로 제출하실 수 있어요.
              <br />
              심사는 서류 제출 완료 이후 최대 3영업일 정도 소요됩니다.
              <br />
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
          </>
        ) : (
          <>
            <div className="text-balance text-body-m text-primary/80 font-medium">
              포퐁에 오신 걸 환영해요!
              <br /> 브리더 심사는 <span className="text-secondary-700">최대 3영업일</span> 정도 소요될 수 있어요.
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
          </>
        )}
      </div>
      <SignupFormItems className="flex flex-col gap-3">
        <Link href="/">
          <Button variant={'tertiary'} className="py-3 px-4 w-full">
            홈으로
          </Button>
        </Link>
        <Link href="https://pf.kakao.com/_Wqxekn" target="_blank" rel="noopener noreferrer">
          <Button className="bg-tertiary-700 !text-grayscale-gray6 py-3 px-4 w-full hover:bg-tertiary-800 hover:!text-grayscale-gray6">
            문의하기
          </Button>
        </Link>
      </SignupFormItems>
    </SignupFormSection>
  );
}
