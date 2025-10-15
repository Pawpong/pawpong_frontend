import Container from "@/components/ui/container";
import React from "react";
import Header from "./_components/header";

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <Container>
      <Header />
      {children}
    </Container>
  );
}
