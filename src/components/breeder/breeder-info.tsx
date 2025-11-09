import LevelBadge from "@/components/level-badge";

interface BreederInfoProps {
  breederName: string;
  breederLevel: "elite" | "new";
  applicationDate?: string;
  nameWidth?: string;
  className?: string;
  hideDate?: boolean;
}

export default function BreederInfo({
  breederName,
  breederLevel,
  applicationDate,
  nameWidth = "w-[70px]",
  className = "",
  hideDate = false,
}: BreederInfoProps) {
  return (
    <div className={`flex flex-col items-start ${className}`}>
      <div className="flex gap-2 items-center">
        <p className={`text-body-l font-semibold text-primary ${nameWidth}`}>
          {breederName}
        </p>
        <LevelBadge level={breederLevel} />
      </div>
      {applicationDate && !hideDate && (
        <p className="text-body-s font-normal text-grayscale-gray5 whitespace-nowrap">
          {applicationDate}
        </p>
      )}
    </div>
  );
}
