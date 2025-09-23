import Crown from "@/assets/icons/crown";
import Plant from "@/assets/icons/plant";
import { cn } from "@/lib/utils";

export default function LevelBadge({ level }: { level: "elite" | "new" }) {
  const levelInfo = {
    elite: {
      name: "Elite",
      color: "bg-level-elite/10 text-level-elite",
      icon: Crown,
    },
    new: { name: "New", color: "bg-level-new/10 text-level-new", icon: Plant },
  };
  const Icon = levelInfo[level].icon;
  return (
    <div
      className={cn(
        "py-1.5 px-3 gap-1.5 rounded-full flex items-center",
        levelInfo[level].color
      )}
    >
      <Icon className="size-4" />
      <span className="text-caption-s">{levelInfo[level].name}</span>
    </div>
  );
}
