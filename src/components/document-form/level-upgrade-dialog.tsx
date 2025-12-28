'use client';

import { useState, useEffect, useCallback } from 'react';
import { Button } from '@/components/ui/button';
import { LargeDialog, LargeDialogContent, LargeDialogTrigger, LargeDialogClose } from '@/components/ui/large-dialog';
import { ScrollArea } from '@/components/ui/scroll-area';
import Close from '@/assets/icons/close';
import { cn } from '@/lib/utils';
import { LEVEL_INFO, type Animal, type Level } from './document-constants';
import DocumentUploadFields from './document-upload-fields';
import OathCheckbox from './oath-checkbox';
import {
  getVerificationStatus,
  uploadVerificationDocuments,
  submitVerificationDocuments,
  type UploadedDocumentDto,
} from '@/lib/breeder-management';
import { useToast } from '@/hooks/use-toast';

interface DocumentState {
  file: File | null;
  fileName: string | null;
  url: string | null;
  isUploaded: boolean;
}

// Signed URL에서 스토리지 객체 경로(= submit에 필요한 fileName)를 최대한 안전하게 추출
const extractStorageFileNameFromUrl = (url: string): string | null => {
  try {
    const u = new URL(url);
    const pathname = u.pathname.replace(/^\/+/, '');
    const parts = pathname.split('/');
    if (parts[0] === 'verification') {
      return pathname || null;
    }
    if (parts.length >= 2 && parts[1] === 'verification') {
      return parts.slice(1).join('/') || null;
    }
    return pathname || null;
  } catch {
    return null;
  }
};

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
        // API 타입 -> 프론트엔드 키 매핑 (문서 수정 화면과 동일하게 맞춤)
        const apiTypeToKey: Record<string, string> = {
          // snake_case
          id_card: 'idCard',
          animal_production_license: 'businessLicense',
          adoption_contract_sample: 'contractSample',
          breeder_certification: 'breederCatCertificate',
          // camelCase
          idCard: 'idCard',
          animalProductionLicense: 'businessLicense',
          adoptionContractSample: 'contractSample',
          breederDogCertificate: 'breederDogCertificate',
          breederCatCertificate: 'breederCatCertificate',
        };

        const docState: Record<string, DocumentState> = {};
        status.documents.forEach((doc) => {
          const frontendKey = apiTypeToKey[doc.type] || doc.type;
          docState[frontendKey] = {
            file: null,
            // 화면 표시는 원본 파일명 우선
            fileName: doc.originalFileName ?? null,
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

  // 기존 파일명들 추출
  const getExistingFileNames = useCallback((): Record<string, string> => {
    const result: Record<string, string> = {};
    Object.entries(documents).forEach(([key, state]) => {
      if (state.isUploaded && state.fileName) {
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

    // 뉴(New) -> 엘리트(Elite) "수정" 케이스에서는 업로드만 하고 submit은 호출하지 않는다.
    const isUpgradeNewToElite = currentLevel === 'new' && level === 'elite';

    // 레벨별 필수 서류 검증
    const breederDocKey = animal === 'dog' ? 'breederDogCertificate' : 'breederCatCertificate';
    const requiredKeys: string[] =
      level === 'elite'
        ? ['idCard', 'businessLicense', 'contractSample', breederDocKey]
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

        toast({
          title: '서류 업로드가 완료되었습니다.',
          description: '엘리트 전환을 위한 추가 서류가 업로드되었어요.',
          position: 'default',
        });
        setOpen(false);
        onSuccess?.();
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
          <h2 className="text-body-l font-semibold text-primary">브리더 레벨 변경</h2>
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
