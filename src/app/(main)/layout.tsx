import Gnb from "@/components/gnb/gnb";
import { Suspense } from "react";

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <Suspense>
      <Gnb />
      {children}
    </Suspense>
  );
}
