'use client';

import Camera from '@/assets/icons/camera.svg';
import { cn } from '@/api/utils';
import { useState, useRef, useEffect } from 'react';
import ImagePreview, { ImageFile } from './image-preview';
import { useToast } from '@/hooks/use-toast';

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
}: ImageEditProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [imageFiles, setImageFiles] = useState<ImageFile[]>([]);
  const initializedRef = useRef(false);
  const { toast } = useToast();

  // Initialize with existing images (URLs)
  useEffect(() => {
    if (initialImages.length > 0 && !initializedRef.current) {
      const existingImages: ImageFile[] = initialImages.map((url, index) => ({
        id: `existing-${index}-${Date.now()}`,
        file: null,
        preview: url,
        isUrl: true,
      }));
      setImageFiles(existingImages);
      initializedRef.current = true;
    }
  }, [initialImages]);

  const handleClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
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

    const newFiles: ImageFile[] = files.map((file) => ({
      id: `${file.name}-${Date.now()}-${Math.random()}`,
      file,
      preview: URL.createObjectURL(file),
      isUrl: false,
    }));

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

  return (
    <div className="flex gap-2">
      <input ref={fileInputRef} type="file" accept="image/*" multiple className="hidden" onChange={handleFileSelect} />

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
