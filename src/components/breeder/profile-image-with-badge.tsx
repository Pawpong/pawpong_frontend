import Image from 'next/image';
import Cat from '@/assets/icons/cat';
import Dog from '@/assets/icons/dog';

// URL이 유효한지 확인하는 함수
function isValidImageUrl(url: string): boolean {
  if (!url) return false;
  // 절대 URL (http/https)이거나 슬래시로 시작하는 경로만 허용
  return url.startsWith('http://') || url.startsWith('https://') || url.startsWith('/');
}

interface ProfileImageWithBadgeProps {
  src?: string;
  alt: string;
  animalType: 'cat' | 'dog';
  size?: number;
  className?: string;
}

export default function ProfileImageWithBadge({
  src,
  alt,
  animalType,
  size = 68,
  className = '',
}: ProfileImageWithBadgeProps) {
  const IconComponent = animalType === 'cat' ? Cat : Dog;
  const hasValidImage = src && isValidImageUrl(src);

  // src가 유효한 URL인지 확인 (http:// 또는 https://로 시작하는 경우만)
  const isValidUrl = src && src.trim().length > 0 && (src.startsWith('http://') || src.startsWith('https://'));

  return (
    <div
      className={`relative shrink-0 rounded-lg overflow-hidden bg-grayscale-gray1 ${className}`}
      style={{ width: size, height: size }}
    >
      {hasValidImage ? (
        <>
          <Image src={src} alt={alt} width={size} height={size} className="object-cover w-full h-full" unoptimized />
          <div className="absolute bottom-0 left-0 right-0 bg-[var(--color-grayscale-gray1)] flex items-center justify-center py-1.5 px-1.5">
            <p className="text-caption font-medium text-grayscale-gray6 text-center">
              {animalType === 'cat' ? '고양이' : '강아지'}
            </p>
          </div>
        </>
      ) : (
        <div className="w-full h-full flex items-center justify-center">
          <IconComponent className="text-grayscale-gray5" style={{ width: size * 0.7, height: size * 0.7 }} />
        </div>
      )}
      {/* 동물 타입 배지 */}
    </div>
  );
}
