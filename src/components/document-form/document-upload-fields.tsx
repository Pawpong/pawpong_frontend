'use client';

import FileButton from '@/app/signup/_components/sections/file-button';
import { DOCUMENT_KEYS, type Animal, type Level } from './document-constants';

interface DocumentState {
  file: File | null;
  fileName: string | null;
  url: string | null;
  isUploaded: boolean;
  originalFileName?: string; // 화면 표시용 원본 파일명
}

interface DocumentUploadFieldsProps {
  level: Level;
  animal: Animal;
  documents: Record<string, File | null>;
  documentStates?: Record<string, DocumentState>; // 전체 문서 상태
  existingFileNames?: Record<string, string>; // 기존 업로드된 파일명들
  onFileUpload: (key: string) => (file: File) => void;
  onFileDelete: (key: string) => () => void;
}

export default function DocumentUploadFields({
  level,
  animal,
  documents,
  documentStates = {},
  existingFileNames = {},
  onFileUpload,
  onFileDelete,
}: DocumentUploadFieldsProps) {
  return (
    <div className="flex flex-col gap-8 w-full">
      {/* 신분증 사본 - info 있음 */}
      <div className="flex flex-col gap-2.5">
        <FileButton
          file={documents[DOCUMENT_KEYS.ID_CARD] ?? null}
          existingFileName={documentStates[DOCUMENT_KEYS.ID_CARD]?.originalFileName || existingFileNames[DOCUMENT_KEYS.ID_CARD]}
          onUpload={onFileUpload(DOCUMENT_KEYS.ID_CARD)}
          onDelete={onFileDelete(DOCUMENT_KEYS.ID_CARD)}
        >
          신분증 사본
        </FileButton>
        <div className="text-secondary-700 font-medium text-caption">
          이름과 생년월일 이외에는 가려서 제출하시는 걸 권장드려요.
        </div>
      </div>

      {/* 동물생산업 등록증 */}
      <div className="flex flex-col gap-2.5">
        <FileButton
          file={documents[DOCUMENT_KEYS.BUSINESS_LICENSE] ?? null}
          existingFileName={documentStates[DOCUMENT_KEYS.BUSINESS_LICENSE]?.originalFileName || existingFileNames[DOCUMENT_KEYS.BUSINESS_LICENSE]}
          onUpload={onFileUpload(DOCUMENT_KEYS.BUSINESS_LICENSE)}
          onDelete={onFileDelete(DOCUMENT_KEYS.BUSINESS_LICENSE)}
        >
          동물생산업 등록증
        </FileButton>
      </div>
    </div>
  );
}
