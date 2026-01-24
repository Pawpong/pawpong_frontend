'use client';

import useSignupFormStore from '@/stores/signup-form-store';

interface ProgressStep {
  number: number;
  label: string;
  flowIndex: number;
}

const breederSteps: ProgressStep[] = [
  { number: 1, label: '브리딩 동물 선택', flowIndex: 1 },
  { number: 2, label: '계정 정보 입력', flowIndex: 2 },
  { number: 3, label: '브리더 정보 입력', flowIndex: 3 },
  { number: 4, label: '입점 서류 등록', flowIndex: 4 },
];

export default function SignupProgressOverlay() {
  const userType = useSignupFormStore((e) => e.userType);
  const flowIndex = useSignupFormStore((e) => e.flowIndex);

  // 브리더가 아니면 오버레이 표시 안 함
  if (userType !== 'breeder') {
    return null;
  }

  const steps = breederSteps;

  return (
    <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none z-20 px-8">
      {/* 반투명 어두운 배경 */}
      <div className="absolute inset-0 bg-black opacity-30" />

      {/* 컨텐츠 */}
      <div className="relative text-center space-y-8 max-w-md w-full h-full flex flex-col justify-center py-8">
        {/* 타이틀 */}
        <div className="space-y-4 mb-[4.13rem]">
          <h1 className="text-center text-tertiary-500 font-['NanumSquareOTF'] text-[1.75rem] font-extrabold leading-[140%]">
            믿을 수 있는 브리더분들을
            <br />
            기다리고 있어요.
          </h1>
          <p className="text-center text-[var(--tertiary-500-basic,#F6F6EA)]  text-body-m font-medium">
            당신의 브리딩 스토리를 세상에 알려주세요.
          </p>
        </div>

        {/* 진행 단계 카드들 */}
        <div className="space-y-2.5  flex flex-col items-center ">
          {steps.map((step) => {
            // flowIndex 0일 때는 첫 번째 단계를 활성으로 표시
            const currentStepIndex = flowIndex === 0 ? 1 : flowIndex;
            const isActive = currentStepIndex === step.flowIndex;

            return (
              <div
                key={step.number}
                className={`
                  flex items-center h-[3.4675rem] px-[1.18044rem] gap-[0.81156rem] w-[20rem]
                  rounded-lg transition-all duration-300  
                  ${isActive ? 'bg-secondary-500 shadow-xl' : 'bg-tertiary-500 shadow-md'}
                `}
              >
                <div
                  className={`
                  flex items-center justify-center w-5 h-5 rounded-full shrink-0 bg-primary-500
                  font-['Pretendard'] text-[11.8px] font-bold leading-[160%] tracking-[-0.5%] align-middle
                  ${isActive ? 'text-secondary-500' : 'text-white'}
                `}
                >
                  {step.number}
                </div>
                <span className={`text-[14px] font-bold text-primary-500 leading-[160%]`}>{step.label}</span>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
