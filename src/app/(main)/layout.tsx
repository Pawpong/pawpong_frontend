"use client";
import Gnb from "@/components/gnb/gnb";
import { Suspense } from "react";
import { usePathname } from "next/navigation";

export default function Layout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const isProfilePage = pathname === "/profile";

  return (
    <Suspense>
      <Gnb variant={isProfilePage ? "tertiary" : "default"} />
      {children}
    </Suspense>
  );
}
