import Image from "next/image";

interface ProfileImageWithBadgeProps {
  src: string;
  alt: string;
  animalType: "cat" | "dog";
  size?: number;
  className?: string;
}

export default function ProfileImageWithBadge({
  src,
  alt,
  animalType,
  size = 68,
  className = "",
}: ProfileImageWithBadgeProps) {
  return (
    <div
      className={`relative shrink-0 rounded-lg overflow-hidden ${className}`}
      style={{ width: size, height: size }}
    >
      <Image
        src={src}
        alt={alt}
        width={size}
        height={size}
        className="object-cover w-full h-full"
      />
      {/* 동물 타입 배지 */}
      <div className="absolute bottom-0 left-0 right-0 bg-[var(--color-grayscale-gray1)] flex items-center justify-center py-1.5 px-1.5">
        <p className="text-caption font-medium text-grayscale-gray6 text-center">
          {animalType === "cat" ? "고양이" : "강아지"}
        </p>
      </div>
    </div>
  );
}
