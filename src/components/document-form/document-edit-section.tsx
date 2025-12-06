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

/** 문서 상태 타입 */
interface DocumentState {
  file: File | null;
  fileName: string | null;
  url: string | null;
  isUploaded: boolean;
}

export default function DocumentEditSection() {
  const router = useRouter();

  // 상태 관리
  const [level, setLevel] = useState<Level>('new');
  const [animal] = useState<Animal>('cat');
  const [oathChecked, setOathChecked] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showSuccessDialog, setShowSuccessDialog] = useState(false);
  const [showExitDialog, setShowExitDialog] = useState(false);
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);

  // 문서 상태 (각 타입별로 관리)
  const [documents, setDocuments] = useState<Record<string, DocumentState>>({});

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
          const docState: Record<string, DocumentState> = {};
          status.documents.forEach((doc) => {
            docState[doc.type] = {
              file: null,
              fileName: doc.type,
              url: doc.url,
              isUploaded: true,
            };
          });
          setDocuments(docState);
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

  // 제출 핸들러
  const handleSubmit = async () => {
    if (!oathChecked) {
      alert('브리더 입점 서약서에 동의해주세요.');
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
        } else if (state.isUploaded && state.fileName) {
          existingDocs.push({ type, fileName: state.fileName });
        }
      });

      let uploadedDocs: UploadedDocumentDto[] = [];

      if (newFiles.length > 0) {
        const uploadResult = await uploadVerificationDocuments(newFiles, newTypes, level);
        uploadedDocs = uploadResult.documents;
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
      if (error instanceof Error) {
        alert(error.message);
      } else {
        alert('서류 제출에 실패했습니다.');
      }
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
          oathChecked={oathChecked}
          onLevelChange={(newLevel) => {
            setLevel(newLevel);
            setHasUnsavedChanges(true);
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
