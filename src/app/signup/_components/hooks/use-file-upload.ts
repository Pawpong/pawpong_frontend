import { useEffect, useMemo, useRef, useState } from "react";
import { z } from "zod";

interface UseFileUploadOptions {
  onUpload?: (file: File) => void;
  onDelete?: () => void;
  file?: File | null;
  maxSizeMB?: number;
  errorMessage?: string;
}

export function useFileUpload({
  onUpload,
  onDelete,
  file,
  maxSizeMB,
  errorMessage,
}: UseFileUploadOptions = {}) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [fileName, setFileName] = useState<string>(file?.name ?? "");
  const [error, setError] = useState<string>("");
  const fileSchema = useMemo(() => {
    if (!maxSizeMB) return null;
    const maxBytes = maxSizeMB * 1024 * 1024;
    return z.instanceof(File).refine((curFile) => curFile.size <= maxBytes, {
      message:
        errorMessage ?? `파일은 최대 ${maxSizeMB}MB까지 업로드할 수 있어요`,
    });
  }, [maxSizeMB, errorMessage]);

  useEffect(() => {
    setFileName(file?.name ?? "");
    if (file) {
      setError("");
    }
  }, [file]);

  const handleClick = () => {
    // 파일이 있어도 클릭 가능하게 함
    // 파일 선택 다이얼로그에서 파일을 선택하면 change 이벤트가 발생하고,
    // 취소하면 change 이벤트가 발생하지 않아 기존 파일이 유지됨
    inputRef.current?.click();
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (!selectedFile) {
      // 파일 선택이 취소된 경우 기존 파일 유지
      return;
    }

    if (fileSchema) {
      const result = fileSchema.safeParse(selectedFile);
      if (!result.success) {
        setError(
          result.error.issues[0]?.message ??
            `파일은 최대 ${maxSizeMB}MB까지 업로드할 수 있어요`
        );
        if (inputRef.current) {
          inputRef.current.value = "";
        }
        return;
      }
    }

    // 새 파일 선택 시 기존 파일 삭제하고 새 파일로 교체
    setError("");
    setFileName(selectedFile.name);
    onUpload?.(selectedFile);
  };

  const handleDelete = (e: React.MouseEvent) => {
    e.stopPropagation();
    setFileName("");
    if (inputRef.current) {
      inputRef.current.value = "";
    }
    setError("");
    onDelete?.();
  };

  return {
    inputRef,
    fileName,
    handleClick,
    handleChange,
    handleDelete,
    error,
  };
}
