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
      <div className="size-33 md:size-40 lg:w-full aspect-square">
        <Image
          src={avatarUrl}
          alt={nickname}
          width={132}
          height={132}
          className="object-cover w-full h-full rounded-lg"
        />
      </div>
      <div className="flex-1 space-y-4 flex flex-col md:justify-between">
        <div className="flex items-center flex-wrap gap-2">
          <span className="text-heading-3 text-primary font-semibold">
            {nickname}
          </span>
          <LevelBadge level={level} className="" />
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
                className="bg-tertiary py-1.5 px-2.5 rounded-[--spacing(1)] text-medium text-body-xs text-primary"
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
