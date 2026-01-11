'use client';

import Crown from '@/assets/icons/crown';
import ErrorIcon from '@/assets/icons/error';
import Plant from '@/assets/icons/plant';
import SignupFormDescription from '@/components/signup-form-section/signup-form-description';
import SignupFormHeader from '@/components/signup-form-section/signup-form-header';
import SignupFormItems from '@/components/signup-form-section/signup-form-items';
import SignupFormSection from '@/components/signup-form-section/signup-form-section';
import SignupFormTitle from '@/components/signup-form-section/signup-form-title';
import UndoButton from '@/components/signup-form-section/undo-button';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { cn } from '@/lib/utils';
import { completeBreederRegistration, uploadBreederDocuments, uploadProfileImage } from '@/lib/auth';
import useSignupFormStore from '@/stores/signup-form-store';
import { useRouter } from 'next/navigation';
import { ChevronRight } from 'lucide-react';
import { useState } from 'react';
import { useToast } from '@/hooks/use-toast';
import DocumentSkipDialogTrigger from '../document-skip-dialog-trigger';
import OathDialogTrigger from '../oath-dialog-trigger';
import FileButton from './file-button';
import { DOCUMENT_ERROR_MESSAGES, BREEDER_CERT_INFO } from '@/constants/document';

// 서류 타입 매핑 (백엔드 camelCase 형식에 맞춤)
const DOCUMENT_TYPES = {
  ID_CARD: 'idCard',
  ANIMAL_LICENSE: 'animalProductionLicense',
  CONTRACT_SAMPLE: 'adoptionContractSample',
  BREEDER_CERT: 'breederCertification',
} as const;

const levelInfo = [
  {
    name: 'elite',
    icon: Crown,
    label: 'Elite 엘리트',
    description: '엘리트 레벨은 전문성과 윤리적 기준을 증명해 차별화된 신뢰와 가치를 제공하는 상위 레벨이에요.',
    documents: ['신분증 사본', '동물생산업 등록증', '표준 입양계약서 샘플', '고양이 브리더 인증 서류'],
  },
  {
    name: 'new',
    icon: Plant,
    label: 'New 뉴',
    description: '뉴 레벨은 법적 필수 요건만 충족하면 입점할 수 있는, 막 시작한 브리더를 위한 기본 신뢰 레벨이에요.',
    documents: ['신분증 사본', '동물생산업 등록증'],
  },
];

export default function DocumentSection() {
  const router = useRouter();
  const setDocumentsSkipped = useSignupFormStore((e) => e.setDocumentsSkipped);
  const level = useSignupFormStore((e) => e.level);
  const setLevel = useSignupFormStore((e) => e.setLevel);
  const nextFlowIndex = useSignupFormStore((e) => e.nextFlowIndex);

  // Social login info
  const tempId = useSignupFormStore((e) => e.tempId);
  const provider = useSignupFormStore((e) => e.provider);
  const email = useSignupFormStore((e) => e.email);
  const socialName = useSignupFormStore((e) => e.socialName);
  const phoneNumber = useSignupFormStore((e) => e.phoneNumber);
  const agreements = useSignupFormStore((e) => e.agreements);

  // Breeder info
  const animal = useSignupFormStore((e) => e.animal);
  const plan = useSignupFormStore((e) => e.plan);
  const breederName = useSignupFormStore((e) => e.breederName);
  const breederLocation = useSignupFormStore((e) => e.breederLocation);
  const breeds = useSignupFormStore((e) => e.breeds);
  const photo = useSignupFormStore((e) => e.photo);

  const [check, setCheck] = useState({ elite: false, new: false });
  const [submitting, setSubmitting] = useState(false);
  const [uploadedFiles, setUploadedFiles] = useState<{ type: string; file: File }[]>([]);
  const [uploading, setUploading] = useState(false);
  const [submitAttempted, setSubmitAttempted] = useState(false);
  const { toast } = useToast();

  // 각 서류 업로드 여부 확인 (필수 서류만, 브리더 인증 서류 제외)
  const hasIdCard = uploadedFiles.some((f) => f.type === DOCUMENT_TYPES.ID_CARD);
  const hasAnimalLicense = uploadedFiles.some((f) => f.type === DOCUMENT_TYPES.ANIMAL_LICENSE);
  const hasContractSample = uploadedFiles.some((f) => f.type === DOCUMENT_TYPES.CONTRACT_SAMPLE);
  const hasBreederCert = uploadedFiles.some((f) => f.type === DOCUMENT_TYPES.BREEDER_CERT);

  // 파일 업로드 핸들러 - 파일을 복제하여 저장 (ERR_UPLOAD_FILE_CHANGED 방지)
  const handleFileUpload = (type: string) => async (file: File) => {
    try {
      // 파일 내용을 ArrayBuffer로 읽어서 새 File 객체 생성
      const arrayBuffer = await file.arrayBuffer();
      const clonedFile = new File([arrayBuffer], file.name, { type: file.type });

      setUploadedFiles((prev) => {
        // 같은 타입의 파일이 있으면 교체, 없으면 추가
        const filtered = prev.filter((f) => f.type !== type);
        return [...filtered, { type, file: clonedFile }];
      });
    } catch (error) {
      console.error('파일 복제 실패:', error);
      // 복제 실패 시 원본 파일 사용
      setUploadedFiles((prev) => {
        const filtered = prev.filter((f) => f.type !== type);
        return [...filtered, { type, file }];
      });
    }
  };

  // 서류 없이 회원가입 완료 (나중에 제출)
  const handleSkipAndRegister = async () => {
    if (!tempId) {
      toast({
        title: '로그인 정보 없음',
        description: '소셜 로그인 정보가 없습니다. 다시 로그인해주세요.',
        position: 'split',
      });
      router.push('/login');
      return;
    }

    // Parse location into city and district
    const locationParts = breederLocation?.split(' ') || ['', ''];
    const city = locationParts[0] || '';
    const district = locationParts.slice(1).join(' ') || '';

    setSubmitting(true);

    try {
      // 프로필 이미지가 있으면 업로드
      if (photo) {
        setUploading(true);
        await uploadProfileImage(photo, tempId);
      }

      // 업로드된 서류가 있으면 먼저 서버에 업로드 (회원가입 완료 전)
      if (uploadedFiles.length > 0) {
        setUploading(true);
        await uploadBreederDocuments(tempId, uploadedFiles, level);
      }

      setUploading(false);

      // 회원가입 완료
      const requestData = {
        tempId,
        provider,
        email,
        name: socialName,
        phone: phoneNumber.replace(/-/g, ''),
        petType: animal || '',
        plan: plan || '',
        breederName,
        city,
        district,
        breeds,
        level,
        marketingAgreed: agreements.marketing,
      };

      const result = await completeBreederRegistration(requestData);

      // HttpOnly 쿠키에 저장
      await fetch('/api/auth/set-cookie', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          accessToken: result.accessToken,
          refreshToken: result.refreshToken,
        }),
      });

      // 서류 건너뛰기 표시
      setDocumentsSkipped(true);

      // 다음 단계 진행 (SignupComplete)
      nextFlowIndex();
    } catch (error) {
      console.error('=== Breeder Registration Error (Skip) ===', error);
      if (error instanceof Error) {
        toast({
          title: '회원가입 실패',
          description: error.message,
          position: 'split',
        });
      } else {
        toast({
          title: '회원가입 실패',
          description: '회원가입에 실패했습니다.',
          position: 'split',
        });
      }
    } finally {
      setSubmitting(false);
      setUploading(false);
    }
  };

  // Complete breeder registration
  const handleSubmit = async () => {
    setSubmitAttempted(true);

    // 필수 서류 검증
    // 엘리트: 신분증 사본, 동물생산업 등록증, 표준 입양계약서 샘플, 브리더 인증 서류 (4개 필수)
    // 뉴: 신분증 사본, 동물생산업 등록증 (2개 필수)
    const missingRequired =
      !hasIdCard ||
      !hasAnimalLicense ||
      (level === 'elite' && (!hasContractSample || !hasBreederCert));

    const currentCheck = check[level];

    if (missingRequired || !currentCheck) {
      return;
    }

    if (!tempId) {
      toast({
        title: '로그인 정보 없음',
        description: '소셜 로그인 정보가 없습니다. 다시 로그인해주세요.',
        position: 'split',
      });
      router.push('/login');
      return;
    }

    // Parse location into city and district
    const locationParts = breederLocation?.split(' ') || ['', ''];
    const city = locationParts[0] || '';
    const district = locationParts.slice(1).join(' ') || '';

    setSubmitting(true);

    try {
      // 1단계: 프로필 이미지가 있으면 먼저 업로드
      if (photo) {
        setUploading(true);
        console.log('=== Uploading Profile Image ===');

        await uploadProfileImage(photo, tempId);

        console.log('=== Profile Image Uploaded Successfully ===');
      }

      // 2단계: 서류 파일이 있으면 업로드
      if (uploadedFiles.length > 0) {
        setUploading(true);
        console.log('=== Uploading Documents ===', uploadedFiles.length);

        await uploadBreederDocuments(tempId, uploadedFiles, level);

        console.log('=== Documents Uploaded Successfully ===');
      }

      setUploading(false);

      // 3단계: 회원가입 완료
      const requestData = {
        tempId,
        provider,
        email,
        name: socialName,
        phone: phoneNumber.replace(/-/g, ''),
        petType: animal || '',
        plan: plan || '',
        breederName,
        city,
        district,
        breeds,
        level,
        marketingAgreed: agreements.marketing,
      };

      console.log('=== Breeder Registration Request ===', requestData);

      const result = await completeBreederRegistration(requestData);

      // HttpOnly 쿠키에 저장
      await fetch('/api/auth/set-cookie', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          accessToken: result.accessToken,
          refreshToken: result.refreshToken,
        }),
      });

      // 서류 제출 완료 표시
      setDocumentsSkipped(false);

      // 다음 단계 진행 (SignupComplete)
      nextFlowIndex();
    } catch (error) {
      console.error('=== Breeder Registration Error ===', error);
      if (error instanceof Error) {
        toast({
          title: '회원가입 실패',
          description: error.message,
          position: 'split',
        });
      } else {
        toast({
          title: '회원가입 실패',
          description: '회원가입에 실패했습니다.',
          position: 'split',
        });
      }
    } finally {
      setSubmitting(false);
      setUploading(false);
    }
  };

  return (
    <SignupFormSection className="gap-15 md:gap-20 lg:gap-20">
      <SignupFormHeader>
        <SignupFormTitle>브리더 입점 서류를 등록해 주세요</SignupFormTitle>
        <SignupFormDescription>
          브리더 활동 경험에 따라 적합한 레벨을 선택해 <br />
          서류를 업로드해주세요.
        </SignupFormDescription>
      </SignupFormHeader>
      <SignupFormItems className="gap-8">
        <div className="flex gap-5 items-stretch w-full">
          {levelInfo.map(({ name, icon: Icon, label }) => (
            <Button
              key={name}
              variant="ghost"
              className={cn(
                'flex flex-col gap-2 bg-transparent p-0 text-grayscale-gray5 hover:text-grayscale-gray6! flex-1',
                {
                  'text-primary-500': level === name,
                },
              )}
              onClick={() => setLevel(name as 'elite' | 'new')}
            >
              <div className="flex items-center gap-2 justify-center">
                <Icon className="size-7" />
                <div className="text-heading-3 font-semibold">{label}</div>
              </div>
              <div
                className={cn('h-0.5 w-full bg-transparent', {
                  'bg-primary-500': level === name,
                })}
              />
            </Button>
          ))}
        </div>
        <div className="text-primary-500/80 font-medium text-body-m text-balance text-center break-keep">
          {levelInfo.find((e) => e.name === level)?.description}
        </div>
        <div className="flex flex-col gap-8">
          {/* 1덩이: 신분증 사본 */}
          <div className="space-y-2.5">
            <FileButton onUpload={handleFileUpload(DOCUMENT_TYPES.ID_CARD)}>신분증 사본</FileButton>
            {submitAttempted && !hasIdCard && (
              <div className="flex items-center gap-[0.19rem]">
                <ErrorIcon className="size-3 shrink-0" />
                <p className="text-caption font-medium text-status-error-500">
                  {DOCUMENT_ERROR_MESSAGES.REQUIRED_DOCUMENTS}
                </p>
              </div>
            )}
            <div className="text-secondary-700 font-medium text-caption-s">
              이름과 생년월일 이외에는 가려서 제출하시길 권장드립니다.
            </div>
          </div>

          {/* 2덩이: 동물생산업 등록증 + 표준 입양계약서 샘플 */}
          <div className="space-y-3">
            <div className="space-y-2.5">
              <FileButton onUpload={handleFileUpload(DOCUMENT_TYPES.ANIMAL_LICENSE)}>동물생산업 등록증</FileButton>
              {submitAttempted && !hasAnimalLicense && (
                <div className="flex items-center gap-[0.19rem]">
                  <ErrorIcon className="size-3 shrink-0" />
                  <p className="text-caption font-medium text-status-error-500">
                    {DOCUMENT_ERROR_MESSAGES.REQUIRED_DOCUMENTS}
                  </p>
                </div>
              )}
            </div>
            {level === 'elite' && (
              <div className="space-y-2.5">
                <FileButton onUpload={handleFileUpload(DOCUMENT_TYPES.CONTRACT_SAMPLE)}>
                  표준 입양계약서 샘플
                </FileButton>
                {submitAttempted && !hasContractSample && (
                  <div className="flex items-center gap-[0.19rem]">
                    <ErrorIcon className="size-3 shrink-0" />
                    <p className="text-caption font-medium text-status-error-500">
                      {DOCUMENT_ERROR_MESSAGES.REQUIRED_DOCUMENTS}
                    </p>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* 3덩이: 브리더 인증 서류 (elite만) */}
          {level === 'elite' && (
            <div className="space-y-2.5">
              <FileButton onUpload={handleFileUpload(DOCUMENT_TYPES.BREEDER_CERT)}>
                {animal === 'cat' ? '고양이 브리더 인증 서류' : '강아지 브리더 인증 서류'}
              </FileButton>
              <div
                className={cn('font-medium text-caption-s space-y-2', {
                  'text-grayscale-gray5': hasBreederCert || !submitAttempted,
                  'text-status-error-500': submitAttempted && !hasBreederCert,
                })}
              >
                <div className="flex items-center gap-[0.19rem]">
                  {submitAttempted && !hasBreederCert && <ErrorIcon className="size-3 shrink-0" />}
                  <p>{DOCUMENT_ERROR_MESSAGES.BREEDER_CERT}</p>
                </div>
                {BREEDER_CERT_INFO[animal === 'cat' ? 'cat' : 'dog'].map((text, i) => (
                  <div className="flex gap-1" key={i}>
                    <div className="h-3 flex items-center">
                      <div
                        className={cn('size-0.5 rounded-full', {
                          'bg-grayscale-gray5': hasBreederCert || !submitAttempted,
                          'bg-status-error-500': submitAttempted && !hasBreederCert,
                        })}
                      />
                    </div>
                    {text}
                  </div>
                ))}
              </div>
            </div>
          )}
          <div className="space-y-2.5">
            <OathDialogTrigger
              className="cursor-pointer"
              onAgree={() => {
                setCheck((prev) => ({ ...prev, [level]: true }));
              }}
              asChild
              level={level}
            >
              <div className="flex items-center">
                <div className="flex-1 flex items-center gap-2 py-2 pr-2.5 font-medium">
                  <div className="size-5 flex items-center justify-center">
                    <Checkbox
                      checked={check[level]}
                      onClick={(e) => {
                        if (check[level] === true) {
                          e.stopPropagation();
                          setCheck((prev) => ({ ...prev, [level]: false }));
                        }
                      }}
                    />
                  </div>
                  <span className="text-body-xs text-grayscale-gray6 select-none">
                    (필수) {level === 'elite' ? '엘리트' : '뉴'} 레벨 브리더 입점 서약서
                  </span>
                </div>

                <Button variant="ghost" className="flex items-center gap-2.5 text-grayscale-gray5 text-body-xs">
                  <div>보기</div>
                  <div className="size-5 flex items-center justify-center">
                    <ChevronRight className="size-4" />
                  </div>
                </Button>
              </div>
            </OathDialogTrigger>
            {submitAttempted && !check[level] && (
              <div className="flex items-center gap-[0.19rem]">
                <ErrorIcon className="size-3 shrink-0" />
                <p className="text-caption font-medium text-status-error-500">입점 서약서에 동의해 주세요</p>
              </div>
            )}
          </div>
        </div>
      </SignupFormItems>

      <SignupFormItems className="gap-4 ">
        <div className="flex gap-3">
          <DocumentSkipDialogTrigger asChild onSkip={handleSkipAndRegister}>
            <Button
              className="bg-tertiary-700 text-grayscale-gray6! py-3 px-4 hover:bg-tertiary-800 hover:text-grayscale-gray6!"
              variant="tertiary"
              disabled={submitting}
            >
              나중에 할래요
            </Button>
          </DocumentSkipDialogTrigger>

          <Button variant={'tertiary'} className="py-3 px-4 w-full flex-1" onClick={handleSubmit} disabled={submitting}>
            {uploading ? '서류 업로드 중...' : submitting ? '회원가입 중...' : '제출'}
          </Button>
        </div>
        <UndoButton />
      </SignupFormItems>
    </SignupFormSection>
  );
}
