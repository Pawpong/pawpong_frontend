import Container from "@/components/ui/container";
import React from "react";

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <div className="bg-tertiary-500">
      <Container>{children}</Container>
    </div>
  );
}
