"use client";
import { useBreakpoint } from "@/hooks/use-breakpoint";
import Container from "../ui/container";
import LogoButton from "./logo-button";
import NavBar from "./nav-bar";
import NavButton from "./nav-button";
import NoticeButton from "./notice-button";
interface GnbProps {
  variant?: "default" | "tertiary";
}

export default function Gnb({ variant = "default" }: GnbProps) {
  const isLg = useBreakpoint("lg");
  const bgClass = variant === "tertiary" ? "bg-tertiary-500" : "bg-background";

  return (
    <div className={bgClass}>
      <Container className="h-16 flex items-center justify-between">
        <LogoButton />
        {isLg && <NavBar />}
        <div className="flex gap-4 items-center">
          <NoticeButton />
          {!isLg && <NavButton />}
        </div>
      </Container>
    </div>
  );
}
