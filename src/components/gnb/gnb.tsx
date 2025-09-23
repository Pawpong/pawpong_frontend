"use client";
import { useBreakpoint } from "@/hooks/use-breakpoint";
import Container from "../ui/container";
import LogoButton from "./logo-button";
import NavBar from "./nav-bar";
import NavButton from "./nav-button";
import NoticeButton from "./notice-button";

export default function Gnb() {
  const isMd = useBreakpoint("md");
  return (
    <Container className="h-16 flex items-center justify-between">
      <LogoButton />
      {isMd && <NavBar />}
      <div className="flex gap-4 items-center">
        <NoticeButton />
        {!isMd && <NavButton />}
      </div>
    </Container>
  );
}
