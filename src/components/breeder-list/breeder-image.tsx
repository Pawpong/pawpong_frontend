import Image from 'next/image';

// URL이 유효한지 확인하는 함수
function isValidUrl(url: string): boolean {
  if (!url) return false;
  try {
    new URL(url);
    return true;
  } catch {
    // 상대 경로인 경우 (/, ./ 등으로 시작)
    return url.startsWith('/') || url.startsWith('./') || url.startsWith('../');
  }
}

export default function BreederImage({ src, alt }: { src?: string; alt?: string }) {
  const hasValidImage = src && isValidUrl(src);

  // CDN 서명된 URL은 Next.js 이미지 최적화 없이 직접 로드
  const isExternalUrl = hasValidImage && src.startsWith('http');
  const imageSrc = hasValidImage ? src : '/profile-empty.svg';
  const shouldUnoptimize = isExternalUrl || imageSrc.endsWith('.svg');
  const altText = alt || (hasValidImage ? '브리더 프로필 이미지' : '기본 프로필 이미지');

  return (
    <div className="relative w-full h-[224px] @xl:w-auto @xl:h-56 @xl:aspect-square @4xl:aspect-[432/224] overflow-hidden rounded-lg">
      <Image src={imageSrc} alt={altText} fill className="object-cover" unoptimized={shouldUnoptimize} />
    </div>
  );
}
