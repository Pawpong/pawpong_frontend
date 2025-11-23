import Female from "@/assets/icons/female";
import Male from "@/assets/icons/male";
import AdoptionStatusBadge from "@/components/adoption-status-badge";
import { cn } from "@/lib/utils";
import Image from "next/image";

const sexInfo = {
  male: { icon: Male, className: "text-gender-male-500" },
  female: { icon: Female, className: "text-gender-female-500" },
};

export default function AnimalProfile({
  data: { avatarUrl, name, sex, birth, price, breed, status },
}: {
  data: {
    avatarUrl: string;
    name: string;
    sex: "male" | "female";
    birth: string;
    price: string;
    breed: string;
    status?: "available" | "reserved" | "completed";
  };
}) {
  const Icon = sexInfo[sex].icon;

  // 이미지 URL 검증 및 폴백 처리
  const getValidImageUrl = (url: string) => {
    if (!url) return "/animal-sample.png";
    // http:// 또는 https://로 시작하면 그대로 사용
    if (url.startsWith("http://") || url.startsWith("https://")) {
      return url;
    }
    // 상대 경로인 경우 플레이스홀더 사용 (실제 이미지 파일이 없으므로)
    return "/animal-sample.png";
  };

  return (
    <div className="space-y-4">
      <div className="relative aspect-square overflow-hidden rounded-lg">
        <Image
          src={getValidImageUrl(avatarUrl)}
          alt={`${name}의 사진`}
          width={200}
          height={200}
          className="w-full h-full object-cover"
        />
        {status && (
          <div className="absolute top-3 left-3">
            <AdoptionStatusBadge status={status} />
          </div>
        )}
      </div>
      <div className="space-y-3 mt-3">
        <div className="gap-1.5 flex flex-col">
          <div className="flex items-center gap-1.5">
            <div className="text-body-m font-semibold text-primary-500">
              {name}
            </div>

            <Icon className={cn("size-5", sexInfo[sex].className)} />
          </div>

          <div className="text-body-s text-grayscale-gray5">{birth}</div>
          <div className="text-body-s text-grayscale-gray5">{price}</div>
        </div>
        <div className="rounded bg-tertiary-500 py-1.5 px-2.5 w-fit text-body-xs font-medium text-primary-500">
          {breed}
        </div>
      </div>
    </div>
  );
}
