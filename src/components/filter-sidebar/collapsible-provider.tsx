// context/collapsible-provider.tsx
"use client";

import { createContext, useContext, useState } from "react";

type CollapsibleContextType = {
  open: boolean;
  setOpen: (value: boolean) => void;
  toggle: () => void;
};

const CollapsibleContext = createContext<CollapsibleContextType | undefined>(
  undefined
);

export function CollapsibleProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [open, setOpen] = useState(false);

  const toggle = () => setOpen((prev) => !prev);

  return (
    <CollapsibleContext.Provider value={{ open, setOpen, toggle }}>
      {children}
    </CollapsibleContext.Provider>
  );
}

export function useCollapsible() {
  const ctx = useContext(CollapsibleContext);
  if (!ctx) {
    throw new Error("useCollapsible must be used within a CollapsibleProvider");
  }
  return ctx;
}
