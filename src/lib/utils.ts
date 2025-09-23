import { clsx, type ClassValue } from "clsx";
import { extendTailwindMerge } from "tailwind-merge";

const customTwMerge = extendTailwindMerge({
  extend: {
    classGroups: {
      "font-size": [
        "text-display",
        "text-heading-1",
        "text-heading-2",
        "text-heading-3",
        "text-body-l",
        "text-body-m",
        "text-body-s",
        "text-body-xs",
        "text-caption-s",
      ],
      color: [],
    },
  },
});

export function cn(...inputs: ClassValue[]) {
  return customTwMerge(clsx(inputs));
}
