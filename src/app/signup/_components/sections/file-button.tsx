'use client';

import FileIcon from '@/assets/icons/file';
import CloseTertiary from '@/assets/icons/close-tertiary.svg';
import ErrorMessage from '@/components/error-message';
import { useFileUpload } from '../hooks/use-file-upload';
import { cn } from '@/lib/utils';

interface FileButtonProps {
  children: React.ReactNode;
  className?: string;
  onUpload?: (file: File) => void;
  onDelete?: () => void;
  file?: File | null;
  existingFileName?: string; // 기존 업로드된 파일명 (서버에서 불러온 경우)
  maxSizeMB?: number;
  errorMessage?: string;
}

export default function FileButton({
  children,
  className,
  onUpload,
  onDelete,
  file,
  existingFileName,
  maxSizeMB = 10,
  errorMessage,
}: FileButtonProps) {
  const resolvedErrorMessage = errorMessage ?? `파일은 최대 ${maxSizeMB}MB까지 업로드할 수 있어요`;

  const { inputRef, fileName, handleClick, handleChange, handleDelete, error } = useFileUpload({
    onUpload,
    onDelete,
    file,
    maxSizeMB,
    errorMessage: resolvedErrorMessage,
  });

  // 표시할 파일명: 새로 선택한 파일 > 기존 업로드된 파일
  const displayFileName = fileName || existingFileName;

  return (
    <div className="flex flex-col gap-2 w-full">
      <input type="file" ref={inputRef} onChange={handleChange} className="hidden" />
      <div
        className={cn('bg-white rounded-lg px-4 py-3 flex items-center gap-2 group cursor-pointer', className)}
        onClick={handleClick}
      >
        <FileIcon className="fill-transparent stroke-grayscale-gray5 size-5 shrink-0" />
        {displayFileName ? (
          <span className="text-body-m font-medium text-[#4F3B2E] flex-1 truncate">{displayFileName}</span>
        ) : (
          <span className="text-body-m font-medium text-grayscale-gray5">{children}</span>
        )}
        {displayFileName && (
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              handleDelete(e);
            }}
          >
            <CloseTertiary className="size-6" />
          </button>
        )}
      </div>
      {error && <ErrorMessage message={error} />}
    </div>
  );
}
