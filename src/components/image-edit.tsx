'use client';

import Camera from '@/assets/icons/camera.svg';
import { cn } from '@/api/utils';
import { useState, useRef, useEffect } from 'react';
import ImagePreview, { ImageFile } from './image-preview';
import { useToast } from '@/hooks/use-toast';
import { isVideoFile, extractVideoThumbnail, isVideoUrl, VIDEO_PLACEHOLDER_SVG } from '@/utils/video-thumbnail';
import { getImagePreview } from '@/utils/heic-convert';

interface ImageEditProps {
  className?: string;
  limit?: 'on' | 'off';
  status?: 'Default' | 'Hover' | 'Filled' | 'Error';
  maxCount?: number;
  onFileChange?: (files: (File | string)[]) => void;
  showPreview?: boolean;
  previewSize?: 'small' | 'medium' | 'large';
  previewLayout?: 'grid' | 'horizontal' | 'vertical';
  initialImages?: string[];
  labelText?: string;
  allowVideo?: boolean;
  resetKey?: number | string;
}

/** onFileChange에 전달할 값: URL-based는 원본 URL, File-based는 File 객체 */
function toFileChangeValue(img: ImageFile): File | string {
  if (img.isUrl) return img.originalUrl || img.preview;
  return img.file!;
}

export default function ImageEdit({
  className,
  limit = 'on',
  status = 'Default',
  maxCount = 3,
  onFileChange,
  showPreview = true,
  previewSize = 'medium',
  previewLayout = 'horizontal',
  initialImages = [],
  labelText,
  allowVideo = true,
  resetKey,
}: ImageEditProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [imageFiles, setImageFiles] = useState<ImageFile[]>([]);
  const initializedRef = useRef(false);
  const internalChangeRef = useRef(false);
  const abortControllerRef = useRef<AbortController | null>(null);
  const { toast } = useToast();

  // resetKey가 바뀌면 강제 재초기화 (저장 완료 후 서버 데이터로 리셋할 때 사용)
  // 내부 변경(사진 추가/삭제)으로 인한 resetKey 변경은 무시
  useEffect(() => {
    if (internalChangeRef.current) {
      internalChangeRef.current = false;
      return;
    }
    initializedRef.current = false;
  }, [resetKey]);

  // Initialize with existing images (URLs)
  useEffect(() => {
    if (initialImages.length > 0 && !initializedRef.current) {
      initializedRef.current = true;

      // 이전 비동기 초기화가 진행 중이면 취소
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
      }
      const controller = new AbortController();
      abortControllerRef.current = controller;

      const processInitialImages = async () => {
        const existingImages: ImageFile[] = await Promise.all(
          initialImages.map(async (url, index) => {
            const isVideo = isVideoUrl(url);
            // CDN 동영상은 CORS로 캔버스 썸네일 추출 불가 → placeholder 사용
            // image-preview에서 <video> 엘리먼트로 첫 프레임 직접 표시
            const preview = isVideo ? VIDEO_PLACEHOLDER_SVG : url;

            return {
              id: `existing-${index}-${Date.now()}`,
              file: null,
              preview,
              isUrl: true,
              isVideo,
              originalUrl: url, // 원본 CDN URL 보존
            };
          }),
        );

        // stale 비동기 결과가 현재 상태를 덮어쓰지 않도록 방어
        if (!controller.signal.aborted) {
          setImageFiles(existingImages);
        }
      };

      processInitialImages();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [initialImages, resetKey]);

  // Cleanup: 언마운트 시 비동기 초기화 취소
  useEffect(() => {
    return () => {
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
      }
    };
  }, []);

  const handleClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);

    // 이미 최대 개수에 도달한 경우 토스트 표시 후 종료
    if (imageFiles.length >= maxCount) {
      toast({
        title: `상세 사진·영상은 최대 ${maxCount}장 등록할 수 있어요`,
        position: 'split',
      });
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
      return;
    }

    // 파일별로 썸네일 생성 (동영상은 첫 프레임 추출, HEIC는 JPEG 변환)
    const heicErrors: string[] = [];
    const newFiles: ImageFile[] = await Promise.all(
      files.map(async (file) => {
        const isVideo = isVideoFile(file);
        let preview: string;

        if (isVideo) {
          try {
            preview = await extractVideoThumbnail(file);
          } catch {
            preview = VIDEO_PLACEHOLDER_SVG;
          }
        } else {
          const result = await getImagePreview(file);
          preview = result.preview;
          if (result.error) {
            heicErrors.push(result.error);
          }
        }

        return {
          id: `${file.name}-${Date.now()}-${Math.random()}`,
          file,
          preview,
          isUrl: false,
          isVideo,
        };
      }),
    );

    // HEIC 변환 실패 시 토스트 알림
    if (heicErrors.length > 0) {
      toast({
        title: heicErrors[0],
        position: 'split',
      });
    }

    // 추가하려는 파일 수와 기존 파일 수를 합쳐서 maxCount를 초과하는지 확인
    const totalCount = imageFiles.length + newFiles.length;
    if (totalCount > maxCount) {
      toast({
        title: `상세 사진·영상은 최대 ${maxCount}장 등록할 수 있어요`,
        position: 'split',
      });
      // maxCount까지만 추가
      const remainingSlots = maxCount - imageFiles.length;
      const filesToAdd = newFiles.slice(0, remainingSlots);
      const updatedFiles = [...imageFiles, ...filesToAdd];
      setImageFiles(updatedFiles);
      internalChangeRef.current = true;
      onFileChange?.(updatedFiles.map(toFileChangeValue));
    } else {
      const updatedFiles = [...imageFiles, ...newFiles];
      setImageFiles(updatedFiles);
      internalChangeRef.current = true;
      onFileChange?.(updatedFiles.map(toFileChangeValue));
    }

    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleRemoveImage = (id: string) => {
    const newFiles = imageFiles.filter((img) => img.id !== id);
    setImageFiles(newFiles);
    internalChangeRef.current = true;
    onFileChange?.(newFiles.map(toFileChangeValue));
  };

  const currentStatus = imageFiles.length > 0 ? 'Filled' : status;
  const isError = currentStatus === 'Error';

  // 허용할 파일 형식 설정
  const acceptFormats = allowVideo
    ? '.jpg,.jpeg,.png,.gif,.webp,.heif,.heic,.mp4,.mov,.avi,.webm'
    : '.jpg,.jpeg,.png,.gif,.webp,.heif,.heic';

  return (
    <div className="flex gap-2">
      <input
        ref={fileInputRef}
        type="file"
        accept={acceptFormats}
        multiple
        className="hidden"
        onChange={handleFileSelect}
      />

      {/* 카메라 박스: 최대 등록 시 숨김 */}
      {imageFiles.length < maxCount && (
        <div
          className={cn(
            'bg-white flex flex-col gap-1.5 items-center justify-center rounded-lg size-20 cursor-pointer transition-colors group',
            'pb-2.5 pt-2 px-0 border border-transparent',
            currentStatus === 'Hover' && 'bg-gray-50',
            isError && '',
            className,
          )}
          onClick={handleClick}
        >
          <Camera
            className={cn('size-7 transition-colors', {
              'group-hover:[&_path]:fill-[#4F3B2E]': !isError,
              '[&_path]:fill-status-error-500': isError,
            })}
          />

          {limit === 'on' && (
            <div
              className={cn('text-caption-s font-medium', isError ? 'text-status-error-500' : 'text-grayscale-gray5')}
            >
              {labelText || `${imageFiles.length}/${maxCount}`}
            </div>
          )}
        </div>
      )}

      {/* 이미지 미리보기 */}
      {showPreview && (
        <ImagePreview
          images={imageFiles}
          onRemove={handleRemoveImage}
          maxImages={maxCount}
          imageSize={previewSize}
          layout={previewLayout}
        />
      )}
    </div>
  );
}
