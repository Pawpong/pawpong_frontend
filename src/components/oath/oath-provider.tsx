"use client";

import {
  createContext,
  ReactNode,
  useContext,
  useEffect,
  useState,
} from "react";

// Context 타입 정의
interface OathContextType {
  checked: boolean;
  setChecked: (value: boolean) => void;
}

// 기본값
const OathContext = createContext<OathContextType | undefined>(undefined);

// Provider Props
interface OathProviderProps {
  children: ReactNode;
  onCheckedChange?: (value: boolean) => void;
}

// Provider 구현
export function Oath({ children, onCheckedChange }: OathProviderProps) {
  const [checked, setChecked] = useState<boolean>(false);

  useEffect(() => {
    setChecked(checked);
    onCheckedChange?.(checked);
  }, [checked, onCheckedChange]);

  return (
    <OathContext.Provider value={{ checked, setChecked }}>
      {children}
    </OathContext.Provider>
  );
}

// Hook으로 Context 쉽게 사용
export function useOath() {
  const context = useContext(OathContext);
  if (!context) throw new Error("useOath must be used within OathProvider");
  return context;
}
