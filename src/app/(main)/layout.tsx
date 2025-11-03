"use client";
import Gnb from "@/components/gnb/gnb";
import { Suspense } from "react";
import { usePathname } from "next/navigation";

export default function Layout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const isProfilePage = pathname === "/profile";
  const isCounselFormPage = pathname === "/counselform";
  const useTertiaryVariant = isProfilePage || isCounselFormPage;

  return (
    <Suspense>
      <Gnb variant={useTertiaryVariant ? "tertiary" : "default"} />
      {children}
    </Suspense>
  );
}
