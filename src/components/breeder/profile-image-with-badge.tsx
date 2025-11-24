import Image from "next/image";
import Cat from "@/assets/icons/cat";
import Dog from "@/assets/icons/dog";

interface ProfileImageWithBadgeProps {
  src?: string;
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
  const IconComponent = animalType === "cat" ? Cat : Dog;

  return (
    <div
      className={`relative shrink-0 rounded-lg overflow-hidden bg-grayscale-gray1 ${className}`}
      style={{ width: size, height: size }}
    >
      {src ? (
        <>
          <Image
            src={src}
            alt={alt}
            width={size}
            height={size}
            className="object-cover w-full h-full"
          />
          <div className="absolute bottom-0 left-0 right-0 bg-[var(--color-grayscale-gray1)] flex items-center justify-center py-1.5 px-1.5">
            <p className="text-caption font-medium text-grayscale-gray6 text-center">
              {animalType === "cat" ? "고양이" : "강아지"}
            </p>
          </div>
        </>
      ) : (
        <div className="w-full h-full flex items-center justify-center">
          <IconComponent
            className="text-grayscale-gray5"
            style={{ width: size * 0.7, height: size * 0.7 }}
          />
        </div>
      )}
      {/* 동물 타입 배지 */}
    </div>
  );
}
