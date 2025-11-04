"use client";
import Gnb from "@/components/gnb/gnb";
import { Suspense } from "react";
import { usePathname } from "next/navigation";
import { NavigationGuardProvider } from "@/contexts/navigation-guard-context";
import { QueryProvider } from "@/providers/query-provider";

export default function Layout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const isProfilePage = pathname === "/profile";
  const isCounselFormPage = pathname === "/counselform";
  const useTertiaryVariant = isProfilePage || isCounselFormPage;

  return (
    <QueryProvider>
      <Suspense>
        <NavigationGuardProvider>
          <Gnb variant={useTertiaryVariant ? "tertiary" : "default"} />
          {children}
        </NavigationGuardProvider>
      </Suspense>
    </QueryProvider>
  );
}
