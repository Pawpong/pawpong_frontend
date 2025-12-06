'use client';

import FileButton from '@/app/signup/_components/sections/file-button';
import { DOCUMENT_KEYS, type Animal, type Level } from './document-constants';

interface DocumentUploadFieldsProps {
  level: Level;
  animal: Animal;
  documents: Record<string, File | null>;
  onFileUpload: (key: string) => (file: File) => void;
  onFileDelete: (key: string) => () => void;
}

export default function DocumentUploadFields({
  level,
  animal,
  documents,
  onFileUpload,
  onFileDelete,
}: DocumentUploadFieldsProps) {
  const breederDocKey = animal === 'dog' ? DOCUMENT_KEYS.BREEDER_DOG : DOCUMENT_KEYS.BREEDER_CAT;

  return (
    <div className="flex flex-col gap-8 w-full">
      {/* 신분증 사본 - info 있음 */}
      <div className="flex flex-col gap-2.5">
        <FileButton
          file={documents[DOCUMENT_KEYS.ID_CARD] ?? null}
          onUpload={onFileUpload(DOCUMENT_KEYS.ID_CARD)}
          onDelete={onFileDelete(DOCUMENT_KEYS.ID_CARD)}
        >
          신분증 사본
        </FileButton>
        <div className="text-secondary-700 font-medium text-caption">
          이름과 생년월일 이외에는 가려서 제출하시는 걸 권장드려요.
        </div>
      </div>

      {/* 동물생산업 등록증, 표준 입양계약서 샘플*/}
      <div className="flex flex-col gap-3">
        <FileButton
          file={documents[DOCUMENT_KEYS.BUSINESS_LICENSE] ?? null}
          onUpload={onFileUpload(DOCUMENT_KEYS.BUSINESS_LICENSE)}
          onDelete={onFileDelete(DOCUMENT_KEYS.BUSINESS_LICENSE)}
        >
          동물생산업 등록증
        </FileButton>
        {level === 'elite' && (
          <FileButton
            file={documents[DOCUMENT_KEYS.CONTRACT_SAMPLE] ?? null}
            onUpload={onFileUpload(DOCUMENT_KEYS.CONTRACT_SAMPLE)}
            onDelete={onFileDelete(DOCUMENT_KEYS.CONTRACT_SAMPLE)}
          >
            표준 입양계약서 샘플
          </FileButton>
        )}
      </div>

      {/* 브리더 인증 서류 - info 있음 (elite만) */}
      {level === 'elite' && (
        <div className="flex flex-col gap-2.5">
          <FileButton
            file={documents[breederDocKey] ?? null}
            onUpload={onFileUpload(breederDocKey)}
            onDelete={onFileDelete(breederDocKey)}
          >
            {animal === 'dog' ? '강아지 브리더 인증 서류' : '고양이 브리더 인증 서류'}
          </FileButton>
          <div className="flex flex-col gap-2">
            <p className="text-grayscale-gray5 font-medium text-caption">해당되는 서류를 하나 골라 첨부해 주세요</p>
            <div className="flex flex-col gap-2">
              {animal === 'dog' ? (
                <>
                  <div className="flex gap-1 items-start">
                    <div className="h-3 flex items-center pt-0.5">
                      <div className="size-0.5 rounded-full bg-grayscale-gray5" />
                    </div>
                    <span className="text-grayscale-gray5 font-medium text-caption">애견연맹견사호등록증</span>
                  </div>
                  <div className="flex gap-1 items-start">
                    <div className="h-3 flex items-center pt-0.5">
                      <div className="size-0.5 rounded-full bg-grayscale-gray5" />
                    </div>
                    <span className="text-grayscale-gray5 font-medium text-caption">
                      도그쇼 참가 증빙 자료(참가 확인증, 수상 기록, 공식 프로그램 등에 게재된 기록 등)
                    </span>
                  </div>
                </>
              ) : (
                [
                  'TICA 또는 CFA 등록 확인서 (브리더 회원증/캐터리 등록증)',
                  '캣쇼 참가 증빙 자료 (참가 확인증, 수상 기록, 공식 프로그램 등에 게재된 기록 등)',
                ].map((e, i) => (
                  <div className="flex gap-1 items-start" key={i}>
                    <div className="h-3 flex items-center pt-0.5">
                      <div className="size-0.5 rounded-full bg-grayscale-gray5" />
                    </div>
                    <span className="text-grayscale-gray5 font-medium text-caption">{e}</span>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
