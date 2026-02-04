'use client';

import { cn } from '@/api/utils';
import PictureRemove from '@/assets/icons/picture-delete.svg';
import PlayIcon from '@/assets/icons/play.svg';
import Image from 'next/image';

export interface ImageFile {
  id: string;
  file: File | null; // null for URL-based images
  preview: string;
  isUrl?: boolean; // true if this is a URL-based image
  isVideo?: boolean; // true if this is a video file
}

interface ImagePreviewProps {
  images: ImageFile[];
  onRemove: (id: string) => void;
  maxImages?: number;
  showRemoveButton?: boolean;
  imageSize?: 'small' | 'medium' | 'large';
  layout?: 'grid' | 'horizontal' | 'vertical';
}

const ImagePreview: React.FC<ImagePreviewProps> = ({
  images,
  onRemove,
  maxImages = 3,
  showRemoveButton = true,
  imageSize = 'medium',
  layout = 'grid',
}) => {
  if (images.length === 0) return null;

  const getImageSizeClass = () => {
    switch (imageSize) {
      case 'small':
        return 'w-12 h-12';
      case 'large':
        return 'w-24 h-24';
      case 'medium':
      default:
        return 'w-20 h-20';
    }
  };

  const getLayoutClass = () => {
    switch (layout) {
      case 'horizontal':
        return 'flex-row flex-nowrap';
      case 'vertical':
        return 'flex-col items-start';
      case 'grid':
      default:
        return 'flex-wrap';
    }
  };

  return (
    <div className={cn('flex gap-3', getLayoutClass())}>
      {images.slice(0, maxImages).map((image, index) => (
        <div key={image.id} className="relative">
          <Image
            src={image.preview}
            alt={image.isVideo ? `동영상 미리보기 ${index + 1}` : `이미지 미리보기 ${index + 1}`}
            width={80}
            height={80}
            className={cn('rounded-lg object-contain bg-white border border-gray-200', getImageSizeClass())}
            unoptimized={image.isUrl || image.preview.startsWith('blob:')}
          />
          {image.isVideo && (
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
              <div className="bg-black/50 rounded-full p-1.5">
                <PlayIcon className="w-4 h-4 text-white [&_path]:fill-white" aria-hidden="true" />
              </div>
            </div>
          )}
          {showRemoveButton && (
            <button 
              onClick={() => onRemove(image.id)} 
              className="absolute top-1 right-1 flex bg-[var(--primary-500-basic,#4f3b2e)] rounded-full p-1 hover:opacity-80 transition-opacity"
              aria-label={`${image.isVideo ? '동영상' : '이미지'} ${index + 1} 삭제`}
            >
              <PictureRemove className="group-hover:[&_path]:fill-[#4F3B2E]" aria-hidden="true" />
            </button>
          )}
        </div>
      ))}
      {images.length > maxImages && (
        <div className={cn('relative', getImageSizeClass())}>
          <div
            className={cn(
              'bg-gray-100 rounded-lg border border-gray-200 flex items-center justify-center text-gray-500 text-xs font-medium',
              getImageSizeClass(),
            )}
            aria-label={`추가 이미지 ${images.length - maxImages}개`}
          >
            +{images.length - maxImages}
          </div>
        </div>
      )}
    </div>
  );
};

export default ImagePreview;
