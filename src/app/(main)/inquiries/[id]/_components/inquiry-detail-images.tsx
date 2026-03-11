import Image from 'next/image';

interface InquiryDetailImagesProps {
  imageUrls?: string[];
  className?: string;
  placeholderCount?: number;
}

export default function InquiryDetailImages({
  imageUrls = [],
  className,
  placeholderCount = 4,
}: InquiryDetailImagesProps) {
  const fallbackCount = Math.max(1, placeholderCount);
  const images = imageUrls.length > 0 ? imageUrls : Array.from({ length: fallbackCount }, () => '');

  return (
    <div className={`flex flex-col gap-6 w-full max-w-[22rem] md:max-w-[32rem] lg:max-w-[27rem] ${className ?? ''}`}>
      {images.map((url, index) => (
        <div
          key={`${url || 'placeholder'}-${index}`}
          className="w-full rounded-lg bg-grayscale-gray2 bg-[length:1rem_1rem] bg-[image:repeating-conic-gradient(#e5e5e5_0_25%,transparent_0_50%)]"
          role="img"
          aria-label={url ? `첨부 이미지 ${index + 1}` : '이미지 없음'}
        >
          {url ? (
            <Image src={url} alt="" width={800} height={1} unoptimized className="block w-full h-auto rounded-lg" />
          ) : (
            <div className="w-full h-[12rem] rounded-lg" aria-hidden />
          )}
        </div>
      ))}
    </div>
  );
}
