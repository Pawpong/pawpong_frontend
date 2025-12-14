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

export default function BreederImage({ src }: { src?: string }) {
  const hasValidImage = src && isValidUrl(src);

  // 이미지가 없으면 빈 칸만 표시
  if (!hasValidImage) {
    return (
      <div className="relative w-full h-[224px] @xl:w-auto @xl:h-56 @xl:aspect-square @4xl:aspect-[432/224] overflow-hidden rounded-lg" />
    );
  }

  // CDN 서명된 URL은 Next.js 이미지 최적화 없이 직접 로드
  const isExternalUrl = src.startsWith('http');

  return (
    <div className="relative w-full h-[224px] @xl:w-auto @xl:h-56 @xl:aspect-square @4xl:aspect-[432/224] overflow-hidden rounded-lg">
      <Image src={src} alt="Breeder Image" fill className="object-cover" unoptimized={isExternalUrl} />
    </div>
  );
}
