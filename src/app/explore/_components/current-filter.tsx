"use client";

import Close from "@/assets/icons/close.svg";
import { Button, buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { usePathname, useRouter, useSearchParams } from "next/navigation";

export default function CurrentFilter() {
  const router = useRouter();
  const params = useSearchParams();
  const pathname = usePathname();

  const filters = [
    { key: "adoptable", label: "입양 가능", value: "true" },
    { key: "location", label: "현재 위치", value: "true" },
  ];

  const toggleQuery = (key: string, value: string) => {
    const searchParams = new URLSearchParams(params.toString());

    if (searchParams.get(key) === value) {
      searchParams.delete(key);
    } else {
      searchParams.set(key, value);
    }

    const queryString = searchParams.toString();
    // Update the URL with the new query string, preserving the current path
    router.push(`${pathname}?${queryString}`);
  };

  return (
    <div className="flex gap-2.5 items-center">
      <Button
        variant="secondary"
        size="icon"
        onClick={() => router.push(pathname)} // Reset filters by navigating to the current path without a query string
      >
        <Close className="size-7" />
      </Button>

      {filters.map((filter) => {
        const isActive = params.get(filter.key) === filter.value;
        return (
          <Button
            key={filter.key}
            onClick={() => toggleQuery(filter.key, filter.value)}
            variant="outline"
            className={cn({
              [buttonVariants({
                variant: "default",
                className: "border-primary hover:text-point-basic!",
              })]: isActive,
            })}
          >
            {filter.label}
          </Button>
        );
      })}
    </div>
  );
}
