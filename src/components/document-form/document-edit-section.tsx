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
  originalFileName?: string; // 화면 표시용 원본 파일명
}

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

  // 문서 상태 (레벨별로 분리해서 관리)
  const [documentsByLevel, setDocumentsByLevel] = useState<Record<Level, Record<string, DocumentState>>>({
    new: {},
    elite: {},
  });
  // 기존 제출된 문서 (레벨 변경 시에도 유지)
  const [submittedDocuments, setSubmittedDocuments] = useState<Record<string, DocumentState>>({});

  // 현재 레벨의 문서만 가져오기
  const documents = documentsByLevel[level] || {};

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
            id_card: 'idCard',
            animal_production_license: 'businessLicense',
            adoption_contract_sample: 'contractSample',
            recent_pedigree_document: 'pedigree',
            breeder_certification: 'breederCatCertificate',
          };

          // GCS 경로에서 파일명 추출 함수 (verification/userId/uuid.ext)
          const extractGcsFileName = (urlOrPath: string): string => {
            try {
              // URL에서 path 부분 추출 (쿼리 파라미터 제외)
              const urlPath = urlOrPath.split('?')[0];

              // URL인 경우 도메인 제거 (예: https://storage.googleapis.com/bucket/verification/...)
              const pathParts = urlPath.split('/');
              const verificationIndex = pathParts.findIndex(p => p === 'verification');

              if (verificationIndex !== -1) {
                // verification/ 이후 경로 추출
                return pathParts.slice(verificationIndex).join('/');
              }

              // 이미 GCS 경로인 경우 (verification/...)
              if (urlPath.startsWith('verification/')) {
                return urlPath;
              }

              // 마지막 / 이후의 파일명만 추출
              return pathParts[pathParts.length - 1] || '';
            } catch {
              return '';
            }
          };

          const docState: Record<string, DocumentState> = {};
          status.documents.forEach((doc) => {
            const frontendKey = apiTypeToKey[doc.type] || doc.type;

            // GCS 파일 경로 저장 (verification/userId/uuid.ext 형식)
            // 백엔드 제출 시 이 경로를 그대로 전달해야 함
            const gcsFileName = extractGcsFileName(doc.url);

            // 화면 표시용 파일명 (originalFileName 우선, 없으면 GCS 파일명)
            const displayFileName = doc.originalFileName || gcsFileName.split('/').pop() || '';

            docState[frontendKey] = {
              file: null,
              fileName: gcsFileName, // GCS 경로 전체 저장 (중요!)
              url: doc.url,
              isUploaded: true,
              originalFileName: displayFileName, // 화면 표시용
            };
          });
          // 레벨별로 문서 저장
          setDocumentsByLevel((prev) => ({
            ...prev,
            [status.level || 'new']: docState,
          }));
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

      setDocumentsByLevel((prev) => ({
        ...prev,
        [level]: {
          ...prev[level],
          [key]: {
            file,
            fileName: file.name, // 파일명 저장
            url: previewUrl,
            isUploaded: false,
          },
        },
      }));
    },
    [level],
  );

  // 파일 삭제 핸들러
  const handleFileDelete = useCallback(
    (key: string) => () => {
      setHasUnsavedChanges(true);
      setDocumentsByLevel((prev) => {
        const newDocs = { ...prev[level] };
        if (newDocs[key]?.url && !newDocs[key]?.isUploaded) {
          URL.revokeObjectURL(newDocs[key].url!);
        }
        delete newDocs[key];
        return {
          ...prev,
          [level]: newDocs,
        };
      });
    },
    [level],
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

    setIsSubmitting(true);

    try {
      const newFiles: File[] = [];
      const newTypes: string[] = [];
      const existingDocs: { type: string; fileName: string; originalFileName?: string }[] = [];

      Object.entries(documents).forEach(([type, state]) => {
        console.log(`[handleSubmit] Processing document - type: ${type}`, {
          hasFile: !!state.file,
          isUploaded: state.isUploaded,
          fileName: state.fileName,
          originalFileName: state.originalFileName,
        });

        if (state.file && !state.isUploaded) {
          // 새로 업로드한 파일
          newFiles.push(state.file);
          newTypes.push(type);
          console.log(`[handleSubmit] Added to newFiles: ${type}`);
        } else if (state.isUploaded && state.fileName) {
          // 기존 파일 유지 - GCS 경로 전체를 전달
          existingDocs.push({
            type,
            fileName: state.fileName, // verification/userId/uuid.ext 형식
            originalFileName: state.originalFileName, // 화면 표시용 원본 파일명
          });
          console.log(`[handleSubmit] Added to existingDocs: ${type} - ${state.fileName}`);
        }
      });

      let uploadedDocs: UploadedDocumentDto[] = [];

      if (newFiles.length > 0) {
        const uploadResult = await uploadVerificationDocuments(newFiles, newTypes, level);
        uploadedDocs = uploadResult.documents;
      }

      // 기존 서류 + 새로 업로드한 서류 병합
      const allDocs = [
        ...existingDocs,
        ...uploadedDocs.map((doc) => ({
          type: doc.type,
          fileName: doc.fileName,
          originalFileName: doc.originalFileName,
        })),
      ];

      console.log('[handleSubmit] 제출할 서류:', allDocs);

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

  // 제출 버튼 활성화 조건
  const isSubmitDisabled = (() => {
    if (!oathChecked || isSubmitting || Object.keys(documents).length === 0) {
      return true;
    }

    // Elite 레벨인 경우 브리더 인증 서류 필수 검증
    if (level === 'elite') {
      const hasBreederCert =
        documents['breederCatCertificate'] ||
        documents['breederDogCertificate'];

      if (!hasBreederCert) {
        return true;
      }
    }

    return false;
  })();

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
          documentStates={documents}
          existingFileNames={getExistingFileNames()}
          oathChecked={oathChecked}
          onLevelChange={(newLevel) => {
            setLevel(newLevel);
            setHasUnsavedChanges(true);
            // 레벨 변경 시 oath 체크 상태만 업데이트
            // 각 레벨의 문서는 documentsByLevel에 이미 저장되어 있으므로 자동으로 유지됨
            if (newLevel === submittedLevel && Object.keys(documentsByLevel[newLevel]).length > 0) {
              setOathChecked(true);
            } else {
              setOathChecked(false);
            }
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
