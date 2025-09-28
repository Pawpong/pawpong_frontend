"use client";

import Cat from "@/assets/icons/cat";

import Dog from "@/assets/icons/dog";
import { Button } from "@/components/ui/button";
import Container from "@/components/ui/container";
import { useSegment } from "@/hooks/use-segment";
import { cn } from "@/lib/utils";
import Link from "next/link";

const animalTabsItems = [
  { name: "고양이", href: "/explore/cat", icon: Cat },
  { name: "강아지", href: "/explore/dog", icon: Dog },
];

export default function AnimalTabs() {
  const currTab = useSegment(1) || "cat";

  return (
    <Container className="pt-6 md:pt-7 lg:pt-10 flex gap-5">
      {animalTabsItems.map((item) => {
        const active = currTab === item.href.split("/").at(-1);

        return (
          <Link
            key={item.href}
            href={item.href}
            className="flex items-center gap-2"
          >
            <Button
              variant={"ghost"}
              className={cn(
                "h-auto text-heading-3! text-grayscale-gray5 font-semibold -mx-2.5 -my-1.5 hover:bg-transparent flex-col gap-2 hover:text-primary",
                {
                  "text-primary": active,
                }
              )}
            >
              <div className="flex gap-2 items-center">
                <item.icon className="size-7" />
                {item.name}
              </div>
              <div
                className={cn("h-[2px] bg-transparent w-full", {
                  "bg-primary!": active,
                })}
              />
            </Button>
          </Link>
        );
      })}
    </Container>
  );
}
