import React from "react";
import Header from "./_components/header";

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <div className="bg-primary-600 h-svh">
      <Header />
      {children}
    </div>
  );
}
