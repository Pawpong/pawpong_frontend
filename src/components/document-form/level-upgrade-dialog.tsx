'use client';

import { useState, useEffect, useCallback } from 'react';
import { Button } from '@/components/ui/button';
import { LargeDialog, LargeDialogContent, LargeDialogTrigger, LargeDialogClose } from '@/components/ui/large-dialog';
import { ScrollArea } from '@/components/ui/scroll-area';
import Close from '@/assets/icons/close';
import { cn } from '@/api/utils';
import { LEVEL_INFO, DOCUMENT_KEYS, type Animal, type Level } from './document-constants';
import DocumentUploadFields from './document-upload-fields';
import OathCheckbox from './oath-checkbox';
import {
  getVerificationStatus,
  uploadVerificationDocuments,
  submitVerificationDocuments,
  type UploadedDocumentDto,
} from '@/api/breeder-management';
import { useToast } from '@/hooks/use-toast';

interface DocumentState {
  file: File | null;
  fileName: string | null;
  url: string | null;
  isUploaded: boolean;
}

interface LevelUpgradeDialogProps {
  children: React.ReactNode;
  currentLevel: Level;
  animal?: Animal;
  onSuccess?: () => void;
}

export default function LevelUpgradeDialog({
  children,
  currentLevel,
  animal = 'dog',
  onSuccess,
}: LevelUpgradeDialogProps) {
  const { toast } = useToast();
  const [open, setOpen] = useState(false);
  const [level, setLevel] = useState<Level>(currentLevel);
  const [oathChecked, setOathChecked] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [documents, setDocuments] = useState<Record<string, DocumentState>>({});

  // 모달 열릴 때 기존 데이터 로드
  useEffect(() => {
    if (open) {
      loadExistingData();
    }
  }, [open]);

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
            fileName: doc.fileName || doc.originalFileName || doc.type, // GCS 파일명 저장
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

  // 파일 업로드 핸들러
  const handleFileUpload = useCallback(
    (key: string) => (file: File) => {
      const previewUrl = URL.createObjectURL(file);
      setDocuments((prev) => ({
        ...prev,
        [key]: {
          file,
          fileName: file.name, // 파일명 저장
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
      // 새로 업로드한 파일이 있으면 그것을 사용
      if (state.file) {
        result[key] = state.file;
      } else {
        // 파일이 없으면 null (existingFileName으로 표시됨)
        result[key] = null;
      }
    });
    return result;
  }, [documents]);

  // 기존 파일명들 추출
  const getExistingFileNames = useCallback((): Record<string, string> => {
    const result: Record<string, string> = {};
    Object.entries(documents).forEach(([key, state]) => {
      // 업로드된 파일이거나 파일명이 있으면 추가
      if (state.fileName) {
        result[key] = state.fileName;
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

      setOpen(false);
      onSuccess?.();
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

  const isSubmitDisabled = !oathChecked || isSubmitting || Object.keys(documents).length === 0;

  return (
    <LargeDialog open={open} onOpenChange={setOpen}>
      <LargeDialogTrigger asChild>{children}</LargeDialogTrigger>
      <LargeDialogContent className="h-full md:h-auto md:max-h-[90vh]">
        {/* 헤더 */}
        <div className="flex justify-between items-center p-4 md:pt-6 md:px-6 md:pb-2.5 border-b md:border-0">
          <h2 className="text-body-l font-semibold text-primary-500">브리더 레벨 변경</h2>
          <LargeDialogClose asChild>
            <Button variant="secondary" className="size-9">
              <Close className="size-5 text-grayscale-gray-7" />
            </Button>
          </LargeDialogClose>
        </div>

        {/* 콘텐츠 */}
        <ScrollArea className="flex-1 px-4 md:px-6">
          {isLoading ? (
            <div className="flex items-center justify-center py-20">
              <p className="text-body-s text-grayscale-gray5">기존 서류 불러오는 중...</p>
            </div>
          ) : (
            <div className="flex flex-col gap-8 py-4">
              {/* 레벨 탭 */}
              <div className="flex gap-5 items-stretch w-full">
                {LEVEL_INFO.map(({ name, icon: Icon, label }) => (
                  <Button
                    key={name}
                    variant="ghost"
                    className={cn(
                      'flex flex-col gap-2 bg-transparent p-0 text-grayscale-gray5 hover:text-grayscale-gray6! flex-1',
                      {
                        'text-primary-500': level === name,
                      },
                    )}
                    onClick={() => setLevel(name)}
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

              {/* 레벨 설명 */}
              <div className="text-primary-500/80 font-medium text-body-m text-balance text-center break-keep">
                {LEVEL_INFO.find((e) => e.name === level)?.description}
              </div>

              {/* 서류 업로드 필드 */}
              <DocumentUploadFields
                level={level}
                animal={animal}
                documents={getDocumentsForForm()}
                documentStates={documents}
                existingFileNames={getExistingFileNames()}
                onFileUpload={handleFileUpload}
                onFileDelete={handleFileDelete}
              />

              {/* 서약서 체크박스 */}
              <OathCheckbox level={level} checked={oathChecked} onCheckedChange={setOathChecked} />
            </div>
          )}
        </ScrollArea>

        {/* 푸터 */}
        <div className="p-4 md:pt-4 md:px-6 md:pb-6 border-t">
          <Button variant="tertiary" className="py-3 px-4 w-full" onClick={handleSubmit} disabled={isSubmitDisabled}>
            {isSubmitting ? '제출 중...' : '제출'}
          </Button>
        </div>
      </LargeDialogContent>
    </LargeDialog>
  );
}
