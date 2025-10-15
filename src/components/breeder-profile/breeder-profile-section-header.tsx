import React from "react";

export default function BreederProfileSectionHeader({
  children,
}: {
  children: React.ReactNode;
}) {
  return <div className="flex justify-between items-center">{children}</div>;
}
