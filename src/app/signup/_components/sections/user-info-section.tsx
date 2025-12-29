'use client';

import Check from '@/assets/icons/check-blue.svg';
import ErrorIcon from '@/assets/icons/error';
import CheckboxForm from '@/components/signup-form-section/checkbox-form';
import CheckboxFormLabel from '@/components/signup-form-section/checkbox-form-label';
import CheckboxFormList from '@/components/signup-form-section/checkbox-form-list';
import NextButton from '@/components/signup-form-section/next-button';
import SignupFormDescription from '@/components/signup-form-section/signup-form-description';
import SignupFormHeader from '@/components/signup-form-section/signup-form-header';
import SignupFormItems from '@/components/signup-form-section/signup-form-items';
import SignupFormSection from '@/components/signup-form-section/signup-form-section';
import SignupFormTitle from '@/components/signup-form-section/signup-form-title';
import UndoButton from '@/components/signup-form-section/undo-button';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Input } from '@/components/ui/input';
import { InputGroup, InputGroupAddon, InputGroupInput } from '@/components/ui/input-group';
import { Label } from '@/components/ui/label';
import { checkEmailDuplicate, sendVerificationCode, verifyCode } from '@/lib/auth';
import { cn } from '@/lib/utils';
import useSignupFormStore, { AgreementName } from '@/stores/signup-form-store';
import * as DialogPrimitive from '@radix-ui/react-dialog';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import PrivacyDialogTrigger from '../privacy-dialog-trigger';
import TermDialogTrigger from '../term-dialog-trigger';
import { useToast } from '@/hooks/use-toast';
import { useBreakpoint } from '@/hooks/use-breakpoint';

const messages: Array<{ type: 'success' | 'error'; text: string }> = [
  { type: 'success', text: '휴대폰 번호 인증을 성공했어요' },
  { type: 'error', text: '인증번호가 정확한 지 확인해 주세요' },
  { type: 'error', text: '인증번호를 입력해 주세요' },
  {
    type: 'error',
    text: '유효시간이 지났어요! [인증번호 재전송]을 눌러주세요',
  },
];

const messageTypes: Record<'success' | 'error', { className: string; icon: React.FC<React.SVGProps<SVGSVGElement>> }> =
  {
    success: { className: 'text-status-success-500', icon: Check },
    error: { className: 'text-status-error', icon: ErrorIcon },
  };

const checkboxInfo: {
  name: AgreementName;
  label: string;
  required: boolean;
  trigger?: React.ComponentType<{ onAgree: () => void } & React.ComponentProps<typeof DialogPrimitive.Trigger>>;
}[] = [
  {
    name: 'term',
    label: '서비스 이용약관 동의',
    required: true,
    trigger: TermDialogTrigger,
  },
  {
    name: 'privacy',
    label: '개인정보 수집 및 이용 동의',
    required: true,
    trigger: PrivacyDialogTrigger,
  },
  { name: 'marketing', label: '광고성 정보 수신 동의', required: false },
];

export default function UserInfoSection() {
  const router = useRouter();
  const { toast } = useToast();
  const isLg = useBreakpoint('lg'); // 왼쪽 배너 영역이 있는지 확인 (lg 이상에서만 표시)
  const agreements = useSignupFormStore((e) => e.agreements);
  const setAgreements = useSignupFormStore((e) => e.setAgreements);
  const age14Checked = useSignupFormStore((e) => e.age14Checked);
  const setAge14Checked = useSignupFormStore((e) => e.setAge14Checked);
  const phoneNumber = useSignupFormStore((e) => e.phoneNumber);
  const setPhoneNumber = useSignupFormStore((e) => e.setPhoneNumber);
  const email = useSignupFormStore((e) => e.email);
  const setEmail = useSignupFormStore((e) => e.setEmail);
  const nextFlowIndex = useSignupFormStore((e) => e.nextFlowIndex);
  const [messageIndex, setMessageIndex] = useState<number | null>(null);

  // Social login info
  const tempId = useSignupFormStore((e) => e.tempId);
  const provider = useSignupFormStore((e) => e.provider);
  const socialName = useSignupFormStore((e) => e.socialName);
  const needsEmail = useSignupFormStore((e) => e.needsEmail);

  // SMS verification state
  const [verificationCode, setVerificationCode] = useState('');
  const [isCodeSent, setIsCodeSent] = useState(false);
  const [isVerified, setIsVerified] = useState(false);
  const [isSending, setIsSending] = useState(false);
  const [isVerifying, setIsVerifying] = useState(false);
  const [timeLeft, setTimeLeft] = useState(180); // 3분 = 180초
  const [timerActive, setTimerActive] = useState(false);
  const [showAgreementError, setShowAgreementError] = useState(false);
  const [showAge14Error, setShowAge14Error] = useState(false);
  const [showEmailError, setShowEmailError] = useState(false);
  const [showPhoneError, setShowPhoneError] = useState(false);
  const [phoneErrorMessage, setPhoneErrorMessage] = useState<string>('');
  const [showVerificationError, setShowVerificationError] = useState(false);

  // 인증번호 전송 시 타이머 시작
  const handleSendCode = async () => {
    if (phoneNumber.length !== 13) {
      toast({
        title: '올바른 휴대폰 번호를 입력해주세요',
        description: '휴대폰 번호 형식을 확인해주세요.',
        position: 'split',
      });
      return;
    }

    setIsSending(true);

    try {
      await sendVerificationCode(phoneNumber);
      setIsCodeSent(true);
      setTimerActive(true); // 타이머 시작
      setTimeLeft(180); // 3분 초기화
      toast({
        description: '인증 번호가 발송되었습니다',
        position: isLg ? 'split' : 'default', // 왼쪽 영역 있을 때: split, 없을 때: default
      });
    } catch (error) {
      // API 에러 메시지 파싱
      let errorMessage = '인증번호 발송에 실패했습니다.';

      if (error instanceof Error) {
        // "이미 등록된 전화번호입니다" 같은 메시지 체크
        if (error.message.includes('이미') || error.message.includes('등록') || error.message.includes('전화번호')) {
          errorMessage = '이미 등록된 전화번호예요';
        } else {
          errorMessage = error.message;
        }
      }

      // UI에 에러 메시지 표시
      setShowPhoneError(true);
      setPhoneErrorMessage(errorMessage);
    } finally {
      setIsSending(false);
    }
  };

  // 1초마다 감소
  useEffect(() => {
    if (!timerActive) return;
    if (timeLeft <= 0) {
      setTimerActive(false);
      setMessageIndex(3);
      return;
    }

    const interval = setInterval(() => {
      setTimeLeft((prev) => prev - 1);
    }, 1000);

    return () => clearInterval(interval);
  }, [timeLeft, timerActive]);

  // mm:ss 포맷
  const formatTime = (sec: number) => {
    const m = Math.floor(sec / 60)
      .toString()
      .padStart(2, '0');
    const s = (sec % 60).toString().padStart(2, '0');
    return `${m}:${s}`;
  };
  // Check email duplicate on mount for social login users
  useEffect(() => {
    const checkEmail = async () => {
      if (email && tempId) {
        try {
          const isDuplicate = await checkEmailDuplicate(email);
          if (isDuplicate) {
            toast({
              title: '이미 가입된 이메일입니다',
              description: '로그인 페이지로 이동합니다.',
              position: 'split',
            });
            setTimeout(() => {
              router.push('/login');
            }, 2000);
          }
        } catch (error) {
          console.error('이메일 중복 확인 실패:', error);
        }
      }
    };

    checkEmail();
  }, [email, tempId, router, toast]);

  const hasUncheckedRequiredAgreements = checkboxInfo.filter((e) => e.required).some((e) => !agreements[e.name]);

  const isSocialLogin = !!tempId;

  // Send verification code

  // Verify code
  const handleVerifyCode = async () => {
    if (!verificationCode) {
      setMessageIndex(2);
      return;
    }
    if (verificationCode.length !== 6) {
      setMessageIndex(1);
      return;
    }

    setIsVerifying(true);

    try {
      await verifyCode(phoneNumber, verificationCode);
      setIsVerified(true);
      setTimerActive(false);
      setMessageIndex(0);
    } catch (error) {
      if (error instanceof Error) {
        setMessageIndex(1);
      } else {
        setMessageIndex(1);
      }
    } finally {
      setIsVerifying(false);
    }
  };

  // Reset verification when phone number changes
  const handlePhoneChange = (value: string) => {
    setPhoneNumber(value);
    setIsCodeSent(false);
    setIsVerified(false);
    setVerificationCode('');
  };
  const Icon = messageIndex !== null ? messageTypes[messages[messageIndex].type].icon : null;

  return (
    <SignupFormSection className="gap-15 md:gap-20 lg:gap-20">
      <SignupFormHeader>
        <SignupFormTitle>계정 정보를 입력해 주세요</SignupFormTitle>
        <SignupFormDescription>
          문자 미수신 시 <span className="text-secondary-700">[인증번호 재전송]</span> 버튼을 눌러주세요
        </SignupFormDescription>
      </SignupFormHeader>
      <SignupFormItems className="gap-8">
        {/* Social Login Info Display */}
        {/* {isSocialLogin && (
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 space-y-2">
            <div className="text-sm font-semibold text-blue-800">소셜 로그인 정보 (디버깅용)</div>
            <div className="text-xs space-y-1 text-blue-700">
              <div>Provider: {provider}</div>
              <div>Name: {socialName}</div>
              <div>Email: {email}</div>
              <div>TempId: {tempId}</div>
            </div>
          </div>
        )} */}

        <div className="gap-2.5 flex flex-col">
          <Input
            placeholder="이메일"
            type="email"
            value={email}
            onChange={(e) => {
              setEmail(e.target.value);
              setShowEmailError(false);
            }}
            disabled={isSocialLogin && !needsEmail && !!email}
            className={isSocialLogin && !needsEmail && !!email ? 'bg-gray-100' : ''}
          />
          {showEmailError && !email && (
            <div className="flex items-center gap-0.5">
              <ErrorIcon className="size-3 shrink-0" />
              <p className="text-caption font-medium text-status-error-500">이메일을 입력해 주세요.</p>
            </div>
          )}
        </div>
        <div className="space-y-3">
          <div className="flex flex-col gap-2.5">
            <div className="flex gap-3">
              <Input
                placeholder="휴대폰 번호"
                className="flex-1"
                type="tel"
                value={phoneNumber}
                onChange={(e) => {
                  handlePhoneChange(e.target.value);
                  setShowPhoneError(false);
                  setPhoneErrorMessage('');
                }}
                disabled={isVerified}
              />
              <Button
                variant="tertiary"
                className="px-4 py-3 whitespace-nowrap w-30 text-body-s"
                disabled={phoneNumber.length !== 13 || isSending || isVerified}
                onClick={handleSendCode}
              >
                {isSending ? '발송 중...' : isCodeSent ? '인증번호 재전송' : '인증번호 받기'}
              </Button>
            </div>
            {showPhoneError && (
              <div className="flex items-center gap-[0.19rem]">
                <ErrorIcon className="size-3 shrink-0" />
                <p className="text-caption font-medium text-status-error-500">
                  {phoneErrorMessage || '휴대폰 번호를 입력해 주세요.'}
                </p>
              </div>
            )}
          </div>
          <div className="space-y-2.5">
            <div className="flex flex-col gap-2.5">
              <div className="flex gap-3">
                <InputGroup className="h-auto">
                  <InputGroupInput
                    placeholder="인증번호 (6자리)"
                    value={verificationCode}
                    onChange={(e) => {
                      setVerificationCode(e.target.value);
                      setShowVerificationError(false);
                    }}
                    disabled={isSending || !isCodeSent || isVerifying || isVerified || timeLeft <= 0}
                    maxLength={6}
                  />
                  <InputGroupAddon align="inline-end" className="text-sm text-grayscale-gray5 pr-3.5 pl-1">
                    {isCodeSent ? formatTime(timeLeft) : '03:00'}
                  </InputGroupAddon>
                </InputGroup>
                <Button
                  variant="tertiary"
                  className="px-4 py-3 whitespace-nowrap w-30 text-body-s"
                  disabled={
                    verificationCode.length === 0 ||
                    isSending ||
                    !isCodeSent ||
                    isVerifying ||
                    isVerified ||
                    timeLeft <= 0
                  }
                  onClick={handleVerifyCode}
                >
                  {isVerifying ? '확인 중...' : isVerified ? '확인' : '확인'}
                </Button>
              </div>
              {showVerificationError && !isVerified && (
                <div className="flex items-center gap-0.5">
                  <ErrorIcon className="size-3 shrink-0" />
                  <p className="text-caption font-medium text-status-error-500">인증번호를 입력해 주세요.</p>
                </div>
              )}
            </div>

            {messageIndex !== null && (
              <div
                className={cn(
                  'text-caption-s font-medium flex items-center gap-0.5',
                  messageTypes[messages[messageIndex].type].className,
                  'flex items-center gap-1',
                )}
              >
                {Icon && <Icon className="size-3" />}
                {messages[messageIndex].text}
              </div>
            )}
          </div>
        </div>
        <div className="flex flex-col gap-2.5">
          <CheckboxFormList>
            <CheckboxForm
              label="전체 약관 동의"
              checked={Object.values(agreements).filter((e) => e).length === checkboxInfo.length}
              onCheckedChange={(checked) => {
                checkboxInfo.forEach(({ name }) => setAgreements(name, checked));
              }}
            />
            {checkboxInfo.map(({ name, label, required, trigger }) => (
              <CheckboxForm
                key={name}
                label={`(${required ? '필수' : '선택'}) ${label}`}
                onCheckedChange={(checked) => setAgreements(name, checked)}
                checked={agreements[name]}
                trigger={trigger}
              />
            ))}
          </CheckboxFormList>
          {showAgreementError && checkboxInfo.filter((e) => e.required).some((e) => !agreements[e.name]) && (
            <div className="flex items-center gap-0.5">
              <ErrorIcon className="size-3 shrink-0" />
              <p className="text-caption font-medium text-status-error-500">필수 약관에 동의해 주세요.</p>
            </div>
          )}
        </div>
        <div className="flex flex-col gap-2">
          <div className="py-2 flex items-center">
            <Label className="flex-1">
              <Checkbox checked={age14Checked} onCheckedChange={setAge14Checked} />
              <CheckboxFormLabel>본인은 만 14세 이상입니다.</CheckboxFormLabel>
            </Label>
          </div>
          {showAge14Error && !age14Checked && (
            <div className="flex items-center gap-0.5">
              <ErrorIcon className="size-3 shrink-0" />
              <p className="text-caption font-medium text-status-error-500">필수 약관에 동의해 주세요.</p>
            </div>
          )}
        </div>
        <div className="flex flex-col gap-4">
          <NextButton
            onClick={() => {
              let hasError = false;

              // 이메일 검증 (소셜 로그인이 아니거나, 이메일 입력이 필요한 경우)
              if ((!isSocialLogin || needsEmail || !email) && !email) {
                setShowEmailError(true);
                hasError = true;
              } else {
                setShowEmailError(false);
              }

              // 전화번호 검증
              if (!phoneNumber) {
                setShowPhoneError(true);
                hasError = true;
              } else {
                setShowPhoneError(false);
              }

              // 인증번호 검증
              if (!isVerified) {
                setShowVerificationError(true);
                hasError = true;
              } else {
                setShowVerificationError(false);
              }

              // 필수 약관 검증
              if (hasUncheckedRequiredAgreements) {
                setShowAgreementError(true);
                hasError = true;
              } else {
                setShowAgreementError(false);
              }

              // 14세 이상 동의 검증
              if (!age14Checked) {
                setShowAge14Error(true);
                hasError = true;
              } else {
                setShowAge14Error(false);
              }

              // 모든 검증 통과 시 다음 단계로
              if (!hasError) {
                nextFlowIndex();
              }
            }}
          />
          <UndoButton />
        </div>
      </SignupFormItems>
    </SignupFormSection>
  );
}
