'use client';

import { cn } from '@/api/utils';
import PictureRemove from '@/assets/icons/picture-delete.svg';
export interface ImageFile {
  id: string;
  file: File | null; // null for URL-based images
  preview: string;
  isUrl?: boolean; // true if this is a URL-based image
  type?: string; // MIME type (image/* or video/*)
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

  const isVideo = (image: ImageFile) => {
    if (image.file) {
      return image.file.type.startsWith('video/');
    }
    // URL인 경우 확장자로 판단
    return image.preview.match(/\.(mp4|webm|ogg|mov|avi|wmv|flv|mkv)$/i) !== null;
  };

  return (
    <div className={cn('flex gap-[10px]', getLayoutClass())}>
      {images.slice(0, maxImages).map((image) => {
        const isVideoFile = isVideo(image);
        return (
          <div key={image.id} className="relative">
            {isVideoFile ? (
              <video
                src={image.preview}
                className={cn('rounded-lg object-contain bg-white border border-gray-200', getImageSizeClass())}
                muted
                playsInline
              />
            ) : (
              <img
                src={image.preview}
                alt={`preview ${image.id}`}
                className={cn('rounded-lg object-contain bg-white border border-gray-200', getImageSizeClass())}
              />
            )}
            {showRemoveButton && (
              <button onClick={() => onRemove(image.id)} className="absolute top-1 right-1   flex ">
                <PictureRemove className="group-hover:[&_path]:fill-[#4F3B2E]" />
              </button>
            )}
          </div>
        );
      })}
      {images.length > maxImages && (
        <div className={cn('relative', getImageSizeClass())}>
          <div
            className={cn(
              'bg-gray-100 rounded-lg border border-gray-200 flex items-center justify-center text-gray-500 text-xs font-medium',
              getImageSizeClass(),
            )}
          >
            +{images.length - maxImages}
          </div>
        </div>
      )}
    </div>
  );
};

export default ImagePreview;
