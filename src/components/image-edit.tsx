'use client';

import Camera from '@/assets/icons/camera.svg';
import { cn } from '@/api/utils';
import { useState, useRef, useEffect } from 'react';
import ImagePreview, { ImageFile } from './image-preview';
import { useToast } from '@/hooks/use-toast';
import { isVideoFile, extractVideoThumbnail, isVideoUrl, extractVideoThumbnailFromUrl } from '@/utils/video-thumbnail';

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
}: ImageEditProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [imageFiles, setImageFiles] = useState<ImageFile[]>([]);
  const initializedRef = useRef(false);
  const { toast } = useToast();

  // Initialize with existing images (URLs)
  useEffect(() => {
    if (initialImages.length > 0 && !initializedRef.current) {
      initializedRef.current = true;

      const processInitialImages = async () => {
        const existingImages: ImageFile[] = await Promise.all(
          initialImages.map(async (url, index) => {
            const isVideo = isVideoUrl(url);
            let preview = url;

            // 동영상 URL인 경우 썸네일 추출
            if (isVideo) {
              try {
                preview = await extractVideoThumbnailFromUrl(url);
              } catch {
                preview = url;
              }
            }

            return {
              id: `existing-${index}-${Date.now()}`,
              file: null,
              preview,
              isUrl: true,
              isVideo,
            };
          }),
        );
        setImageFiles(existingImages);
      };

      processInitialImages();
    }
  }, [initialImages]);

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

    // 파일별로 썸네일 생성 (동영상은 첫 프레임 추출)
    const newFiles: ImageFile[] = await Promise.all(
      files.map(async (file) => {
        const isVideo = isVideoFile(file);
        let preview: string;

        if (isVideo) {
          try {
            preview = await extractVideoThumbnail(file);
          } catch {
            preview = URL.createObjectURL(file);
          }
        } else {
          preview = URL.createObjectURL(file);
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
      onFileChange?.(updatedFiles.map((img) => (img.isUrl ? img.preview : img.file!)));
    } else {
      const updatedFiles = [...imageFiles, ...newFiles];
      setImageFiles(updatedFiles);
      // Return File objects for new uploads, string URLs for existing images
      onFileChange?.(updatedFiles.map((img) => (img.isUrl ? img.preview : img.file!)));
    }

    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleRemoveImage = (id: string) => {
    const newFiles = imageFiles.filter((img) => img.id !== id);
    setImageFiles(newFiles);
    // Return File objects for new uploads, string URLs for existing images
    onFileChange?.(newFiles.map((img) => (img.isUrl ? img.preview : img.file!)));
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

      {/* 카메라 박스 */}
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
          <div className={cn('text-caption-s font-medium', isError ? 'text-status-error-500' : 'text-grayscale-gray5')}>
            {labelText || `${imageFiles.length}/${maxCount}`}
          </div>
        )}
      </div>

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
