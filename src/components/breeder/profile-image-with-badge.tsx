import Image from 'next/image';
import Cat from '@/assets/icons/cat';
import Dog from '@/assets/icons/dog';
import Profile from '@/assets/icons/profile';

// URL이 유효한지 확인하는 함수
function isValidImageUrl(url: string): boolean {
  if (!url) return false;
  // 절대 URL (http/https)이거나 슬래시로 시작하는 경로만 허용
  return url.startsWith('http://') || url.startsWith('https://') || url.startsWith('/');
}

interface ProfileImageWithBadgeProps {
  src?: string;
  alt: string;
  animalType?: 'cat' | 'dog' | 'profile'; // 'profile'은 사람 프로필용
  size?: number;
  className?: string;
}

export default function ProfileImageWithBadge({
  src,
  alt,
  animalType = 'profile',
  size = 68,
  className = '',
}: ProfileImageWithBadgeProps) {
  const IconComponent = animalType === 'cat' ? Cat : animalType === 'dog' ? Dog : Profile;
  const hasValidImage = src && isValidImageUrl(src);
  const isHumanProfile = animalType === 'profile';

  return (
    <div
      className={`relative shrink-0 rounded-lg overflow-hidden bg-grayscale-gray1 ${className}`}
      style={{ width: size, height: size }}
    >
      {hasValidImage ? (
        <>
          <Image src={src} alt={alt} width={size} height={size} className="object-cover w-full h-full" unoptimized />
          {!isHumanProfile && (
            <div className="absolute bottom-0 left-0 right-0 h-6 bg-[#F5F5F5] flex items-center justify-center">
              <p className="text-caption font-medium text-[#545454] text-center">
                {animalType === 'cat' ? '고양이' : '강아지'}
              </p>
            </div>
          )}
        </>
      ) : (
        <div className="w-full h-full flex items-center justify-center">
          <IconComponent className="text-grayscale-gray5" style={{ width: size * 0.6, height: size * 0.6 }} />
        </div>
      )}
    </div>
  );
}
