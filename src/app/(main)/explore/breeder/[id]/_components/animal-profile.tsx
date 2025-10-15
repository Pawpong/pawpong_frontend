import Female from "@/assets/icons/female";
import Male from "@/assets/icons/male";
import { cn } from "@/lib/utils";
import Image from "next/image";

const sexInfo = {
  male: { icon: Male, className: "text-gender-male-500" },
  female: { icon: Female, className: "text-gender-female-500" },
};

export default function AnimalProfile({
  data: { avatarUrl, name, sex, birth, price, breed },
}: {
  data: {
    avatarUrl: string;
    name: string;
    sex: "male" | "female";
    birth: string;
    price: string;
    breed: string;
  };
}) {
  const Icon = sexInfo[sex].icon;
  return (
    <div className="space-y-4">
      <div className="aspect-square overflow-hidden rounded-[--spacing(4)]">
        <Image
          src={avatarUrl}
          alt={`${name}의 사진`}
          width={200}
          height={200}
          className="w-full h-full object-cover" // ✅ 핵심
        />
      </div>
      <div className="space-y-3">
        <div className="space-y-1.5">
          <div className="flex items-center gap-0.5">
            <div className="text-body-m font-semibold text-primary">{name}</div>

            <Icon className={cn("size-5", sexInfo[sex].className)} />
          </div>

          <div className="text-body-s text-grayscale-gray5">{birth}</div>
          <div className="text-body-s text-grayscale-gray5">{price}</div>
        </div>
        <div className="rounded-[--spacing(1)] bg-tertiary py-1.5 px-2.5 w-fit">
          {breed}
        </div>
      </div>
    </div>
  );
}
