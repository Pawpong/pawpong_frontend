import Image from "next/image";
import LevelBadge from "../../../../../../components/level-badge";

export default function BreederProfile({
  data: { avatarUrl, nickname, level, location, priceRange, breeds },
}: {
  data: {
    avatarUrl: string;
    nickname: string;
    level: "new" | "elite";
    location: string;
    priceRange: string;
    breeds: string[];
  };
}) {
  return (
    <div className="flex gap-4 lg:w-51 lg:flex-col lg:gap-8">
      <div className="w-[8.25rem] h-[8.25rem] md:w-[10rem] md:h-[10rem] lg:w-[12.75rem] lg:h-[12.75rem] rounded-lg overflow-hidden shrink-0">
        <Image
          src={avatarUrl}
          alt={nickname}
          width={204}
          height={204}
          className="object-cover w-full h-full rounded-[0.452rem]"
        />
      </div>
      <div className="flex-1 space-y-4 flex flex-col md:justify-between">
        <div className="flex items-center flex-wrap gap-2">
          <span className="text-heading-3 text-primary font-semibold">
            {nickname}
          </span>
          <LevelBadge level={level} />
        </div>
        <div className="space-y-3">
          <div className="text-body-s mb-2 text-grayscale-gray5">
            <div>{location}</div>
            <div>{priceRange}</div>
          </div>
          <div className="flex flex-wrap gap-2">
            {breeds.map((breed) => (
              <div
                key={breed}
                className="bg-tertiary-500 py-1.5 px-2.5 rounded-[--spacing(1)] text-medium text-body-xs text-primary"
              >
                {breed}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
