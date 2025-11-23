import { cn } from "@/lib/utils";
import Check from "@/assets/icons/check-pixel.svg";
import ThreeDot from "@/assets/icons/three-dot.svg";

interface RequestStatusBadgeProps {
  status: "before" | "done";
  className?: string;
}

const statusConfig = {
  before: {
    label: "상담 전",
    bgColor: "bg-secondary-500",
    textColor: "text-primary-500",
    icon: ThreeDot,
  },
  done: {
    label: "상담 완료",
    bgColor: "bg-grayscale-gray4",
    textColor: "text-white",
    icon: Check,
  },
};

export default function RequestStatusBadge({
  status,
  className,
}: RequestStatusBadgeProps) {
  const config = statusConfig[status];
  const Icon = config.icon;

  return (
    <div
      className={cn(
        "inline-flex items-center justify-center gap-1.5 px-3 py-1.5 rounded-full",
        config.bgColor,
        config.textColor,
        className
      )}
    >
      <Icon className="size-4 shrink-0" />
      <span className="text-caption font-medium whitespace-nowrap">
        {config.label}
      </span>
    </div>
  );
}
