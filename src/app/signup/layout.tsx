import Container from "@/components/ui/container";
import React from "react";
import Header from "./_components/header";

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <div className="bg-tertiary-500  ">
      <Header />
      <Container className="lg:pr-0">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-padding min-h-[calc(100vh-(--spacing(16)))]">
          <div className="h-full w-full pt-4 pb-padding hidden lg:block">
            <div className="relative  bg-primary-600 h-full" />
          </div>
          <div className="h-full flex justify-center items-center w-full pb-padding">
            {children}
          </div>
        </div>
      </Container>
    </div>
  );
}
