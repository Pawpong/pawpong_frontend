'use client';

import { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import SignupFormItems from '@/components/signup-form-section/signup-form-items';
import SignupFormSection from '@/components/signup-form-section/signup-form-section';
import { Button } from '@/components/ui/button';
import DocumentFormContent from '@/components/document-form/document-form-content';
import SubmitSuccessDialog from '@/components/document-form/submit-success-dialog';
import ExitConfirmDialog from '@/components/document-form/exit-confirm-dialog';
import {
  getVerificationStatus,
  uploadVerificationDocuments,
  submitVerificationDocuments,
  type UploadedDocumentDto,
} from '@/lib/breeder-management';
import type { Animal, Level } from '@/components/document-form/document-constants';
import { useToast } from '@/hooks/use-toast';

/** 문서 상태 타입 */
interface DocumentState {
  file: File | null;
  fileName: string | null;
  url: string | null;
  isUploaded: boolean;
}

// Signed URL에서 스토리지 객체 경로(= submit에 필요한 fileName)를 최대한 안전하게 추출
// 예) https://storage.googleapis.com/<bucket>/verification/breeder123/idCard_uuid.pdf?...  -> verification/breeder123/idCard_uuid.pdf
const extractStorageFileNameFromUrl = (url: string): string | null => {
  try {
    const u = new URL(url);
    const pathname = u.pathname.replace(/^\/+/, ''); // "<bucket>/verification/..."
    const parts = pathname.split('/');
    // 케이스 1) pathname 자체가 이미 "verification/..." 인 경우
    if (parts[0] === 'verification') {
      return pathname || null;
    }
    // 케이스 2) GCS 기본 URL처럼 "<bucket>/verification/..." 인 경우
    if (parts.length >= 2 && parts[1] === 'verification') {
      return parts.slice(1).join('/') || null;
    }
    // 그 외: 일단 pathname 전체를 사용
    return pathname || null;
  } catch {
    return null;
  }
};

export default function DocumentEditSection() {
  const router = useRouter();
  const { toast } = useToast();

  // 상태 관리
  const [level, setLevel] = useState<Level>('new');
  const [submittedLevel, setSubmittedLevel] = useState<Level | null>(null); // 기존 제출된 레벨
  const [animal] = useState<Animal>('cat');
  const [oathChecked, setOathChecked] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showSuccessDialog, setShowSuccessDialog] = useState(false);
  const [showExitDialog, setShowExitDialog] = useState(false);
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);

  // 문서 상태 (각 타입별로 관리)
  const [documents, setDocuments] = useState<Record<string, DocumentState>>({});
  // 기존 제출된 문서 (레벨 변경 시에도 유지)
  const [submittedDocuments, setSubmittedDocuments] = useState<Record<string, DocumentState>>({});

  // 기존 데이터 로드
  useEffect(() => {
    const loadExistingData = async () => {
      try {
        setIsLoading(true);
        const status = await getVerificationStatus();

        // 기존 레벨 설정
        if (status.level) {
          setLevel(status.level);
        }

        // 기존 문서 상태 설정
        if (status.documents && status.documents.length > 0) {
          // API 타입 -> 프론트엔드 키 매핑
          const apiTypeToKey: Record<string, string> = {
            // snake_case (기존)
            id_card: 'idCard',
            animal_production_license: 'businessLicense',
            adoption_contract_sample: 'contractSample',
            recent_pedigree_document: 'pedigree',
            breeder_certification: 'breederCatCertificate',
            // camelCase (신규/스웨거)
            idCard: 'idCard',
            animalProductionLicense: 'businessLicense',
            adoptionContractSample: 'contractSample',
            breederDogCertificate: 'breederDogCertificate',
            breederCatCertificate: 'breederCatCertificate',
          };

          // URL에서 파일명 추출 함수
          const extractFileNameFromUrl = (url: string): string => {
            try {
              // URL에서 path 부분 추출 (쿼리 파라미터 제외)
              const urlPath = url.split('?')[0];
              // 마지막 / 이후의 파일명 추출
              const fileName = urlPath.split('/').pop() || '';
              return fileName;
            } catch {
              return '';
            }
          };

          const docState: Record<string, DocumentState> = {};
          status.documents.forEach((doc) => {
            const frontendKey = apiTypeToKey[doc.type] || doc.type;
            // 백엔드에서 제공하는 originalFileName을 우선 사용, 없으면 URL에서 추출
            const fileName = doc.originalFileName || extractFileNameFromUrl(doc.url);
            docState[frontendKey] = {
              file: null,
              fileName,
              url: doc.url,
              isUploaded: true,
            };
          });
          setDocuments(docState);
          setSubmittedDocuments(docState); // 기존 제출 문서 저장
          setSubmittedLevel(status.level || null); // 기존 제출 레벨 저장
          setOathChecked(true);
        }
      } catch (error) {
        console.error('기존 데이터 로드 실패:', error);
      } finally {
        setIsLoading(false);
      }
    };

    loadExistingData();
  }, []);

  // 브라우저 뒤로가기/새로고침 방지
  useEffect(() => {
    const handleBeforeUnload = (e: BeforeUnloadEvent) => {
      if (hasUnsavedChanges) {
        e.preventDefault();
        e.returnValue = '';
      }
    };

    window.addEventListener('beforeunload', handleBeforeUnload);
    return () => window.removeEventListener('beforeunload', handleBeforeUnload);
  }, [hasUnsavedChanges]);

  // 파일 업로드 핸들러
  const handleFileUpload = useCallback(
    (key: string) => (file: File) => {
      setHasUnsavedChanges(true);

      const previewUrl = URL.createObjectURL(file);

      setDocuments((prev) => ({
        ...prev,
        [key]: {
          file,
          fileName: null,
          url: previewUrl,
          isUploaded: false,
        },
      }));
    },
    [],
  );

  // 파일 삭제 핸들러
  const handleFileDelete = useCallback(
    (key: string) => () => {
      setHasUnsavedChanges(true);
      setDocuments((prev) => {
        const newDocs = { ...prev };
        if (newDocs[key]?.url && !newDocs[key]?.isUploaded) {
          URL.revokeObjectURL(newDocs[key].url!);
        }
        delete newDocs[key];
        return newDocs;
      });
    },
    [],
  );

  // documents를 File | null 형태로 변환
  const getDocumentsForForm = useCallback((): Record<string, File | null> => {
    const result: Record<string, File | null> = {};
    Object.entries(documents).forEach(([key, state]) => {
      result[key] = state.file;
    });
    return result;
  }, [documents]);

  // 기존 파일명 추출 (서버에서 이미 업로드된 파일들)
  const getExistingFileNames = useCallback((): Record<string, string> => {
    const result: Record<string, string> = {};
    Object.entries(documents).forEach(([key, state]) => {
      if (state.isUploaded && state.url) {
        // URL에서 파일명 추출 또는 타입명 사용
        result[key] = state.fileName || key;
      }
    });
    return result;
  }, [documents]);

  // 제출 핸들러
  const handleSubmit = async () => {
    if (!oathChecked) {
      toast({
        title: '브리더 입점 서약서에 동의해주세요.',
        position: 'default',
      });
      return;
    }

    // 기존 뉴(New) 브리더가 엘리트로 "수정"하는 케이스: 업로드만 하고 submit은 호출하지 않는다.
    const isUpgradeNewToElite = submittedLevel === 'new' && level === 'elite';

    // 레벨별 필수 서류 검증 (제출 전에 프론트에서 먼저 막아 서버 400을 줄임)
    const requiredKeys: string[] =
      level === 'elite'
        ? [
            'idCard',
            'businessLicense',
            'contractSample',
            animal === 'dog' ? 'breederDogCertificate' : 'breederCatCertificate',
          ]
        : ['idCard', 'businessLicense'];

    const missing = requiredKeys.filter((key) => {
      const state = documents[key];
      return !(state && (state.file || state.isUploaded));
    });

    if (missing.length > 0) {
      toast({
        title: '필수 서류를 모두 첨부해주세요.',
        description: level === 'elite' ? '엘리트 레벨은 4개 서류가 필요해요.' : '뉴 레벨은 2개 서류가 필요해요.',
        position: 'default',
      });
      return;
    }

    setIsSubmitting(true);

    try {
      const newFiles: File[] = [];
      const newTypes: string[] = [];
      const existingDocs: { type: string; fileName: string }[] = [];

      Object.entries(documents).forEach(([type, state]) => {
        if (state.file && !state.isUploaded) {
          newFiles.push(state.file);
          newTypes.push(type);
        } else if (state.isUploaded) {
          // 기존 업로드 문서는 서버가 요구하는 "fileName(저장 경로)"로 제출해야 함.
          // 상태에 display용 이름만 들어있는 경우가 있어 URL에서 저장 경로를 추출해 보완한다.
          const storageFileName =
            (state.fileName && state.fileName.includes('/') ? state.fileName : null) ||
            (state.url ? extractStorageFileNameFromUrl(state.url) : null) ||
            state.fileName;

          if (storageFileName) {
            existingDocs.push({ type, fileName: storageFileName });
          }
        }
      });

      let uploadedDocs: UploadedDocumentDto[] = [];

      if (newFiles.length > 0) {
        const uploadResult = await uploadVerificationDocuments(newFiles, newTypes, level);
        uploadedDocs = uploadResult.documents;
      }

      // New -> Elite 수정인 경우: upload까지만 수행하고 종료 (submit 호출 X)
      if (isUpgradeNewToElite) {
        if (uploadedDocs.length > 0) {
          setDocuments((prev) => {
            const next = { ...prev };
            uploadedDocs.forEach((doc) => {
              // 서버가 반환하는 type은 정규화된 값일 수 있어 화면 키로 다시 매핑
              const key =
                doc.type === 'animalProductionLicense'
                  ? 'businessLicense'
                  : doc.type === 'adoptionContractSample'
                  ? 'contractSample'
                  : doc.type;
              next[key] = {
                file: null,
                fileName: doc.originalFileName ?? next[key]?.fileName ?? null,
                url: doc.url,
                isUploaded: true,
              };
            });
            return next;
          });
        }

        setHasUnsavedChanges(false);
        toast({
          title: '서류 업로드가 완료되었습니다.',
          description: '엘리트 전환을 위한 추가 서류가 업로드되었어요.',
          position: 'default',
        });
        return;
      }

      const allDocs = [
        ...existingDocs,
        ...uploadedDocs.map((doc) => ({
          type: doc.type,
          fileName: doc.fileName,
        })),
      ];

      await submitVerificationDocuments({
        level,
        documents: allDocs,
      });

      setHasUnsavedChanges(false);
      setShowSuccessDialog(true);
    } catch (error) {
      console.error('서류 제출 실패:', error);
      toast({
        title: '서류 제출에 실패했습니다.',
        description: error instanceof Error ? error.message : '다시 시도해주세요.',
        position: 'default',
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleGoHome = () => {
    setShowSuccessDialog(false);
    router.push('/');
  };

  const handleConfirmExit = () => {
    setShowExitDialog(false);
    router.back();
  };

  const isSubmitDisabled = !oathChecked || isSubmitting || Object.keys(documents).length === 0;

  if (isLoading) {
    return (
      <SignupFormSection className="gap-15 mt-[3.5rem] md:gap-20 lg:gap-20">
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="text-grayscale-gray5">로딩 중...</div>
        </div>
      </SignupFormSection>
    );
  }

  return (
    <>
      <SignupFormSection className="gap-15 mt-[3.5rem] md:gap-20 lg:gap-20">
        <DocumentFormContent
          level={level}
          animal={animal}
          documents={getDocumentsForForm()}
          existingFileNames={getExistingFileNames()}
          oathChecked={oathChecked}
          onLevelChange={(newLevel) => {
            setLevel(newLevel);
            setHasUnsavedChanges(true);
            // 레벨 변경 시 문서 처리
            if (newLevel === submittedLevel) {
              // 기존 제출 레벨로 돌아오면 기존 문서 복원
              setDocuments(submittedDocuments);
              setOathChecked(true);
              return;
            }

            // New -> Elite 업그레이드는 기존(New) 서류는 유지하고 추가 서류만 받는 UX가 자연스러움
            if (submittedLevel === 'new' && newLevel === 'elite') {
              setDocuments((prev) => ({
                // 기존 상태(사용자가 이미 일부 추가했다면 유지)
                ...prev,
                // 제출된 뉴 레벨 필수 2개는 복원
                idCard: submittedDocuments.idCard,
                businessLicense: submittedDocuments.businessLicense,
              }));
              setOathChecked(true);
              return;
            }

            // 그 외 변경은 안전하게 초기화
            setDocuments({});
            setOathChecked(false);
          }}
          onFileUpload={handleFileUpload}
          onFileDelete={handleFileDelete}
          onOathCheckedChange={setOathChecked}
        />
        <SignupFormItems className="gap-4">
          <Button variant="tertiary" className="py-3 px-4 w-full" onClick={handleSubmit} disabled={isSubmitDisabled}>
            {isSubmitting ? '제출 중...' : '제출'}
          </Button>
        </SignupFormItems>
      </SignupFormSection>

      <SubmitSuccessDialog open={showSuccessDialog} onOpenChange={setShowSuccessDialog} onGoHome={handleGoHome} />

      <ExitConfirmDialog open={showExitDialog} onOpenChange={setShowExitDialog} onConfirm={handleConfirmExit} />
    </>
  );
}
