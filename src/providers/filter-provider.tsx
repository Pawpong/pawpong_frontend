"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { createContext, useContext, useEffect, useState } from "react";

type Animal = "cat" | "dog";
type FilterState = {
  animal: Animal;
  filters: Record<string, string[]>; // label -> values
};

type FilterContextType = {
  state: FilterState;
  tempState: FilterState;
  setTempState: (updater: (prev: FilterState) => FilterState) => void;
  save: () => void;
};

const FilterContext = createContext<FilterContextType | null>(null);

export function FilterProvider({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const searchParams = useSearchParams();

  // ✅ URL → 상태 초기화
  const initAnimal = (searchParams.get("animal") as Animal) || "cat";
  const initFilters: Record<string, string[]> = {};
  searchParams.forEach((value, key) => {
    if (key !== "animal") {
      initFilters[key] = value.split(",");
    }
  });

  const [state, setState] = useState<FilterState>({
    animal: initAnimal,
    filters: initFilters,
  });

  const [tempState, setTempStateState] = useState<FilterState>(state);

  const setTempState = (updater: (prev: FilterState) => FilterState) => {
    setTempStateState((prev) => updater(prev));
  };

  // ✅ 저장 → URL & 상태 반영
  const save = () => {
    setState(tempState);

    const params = new URLSearchParams();
    params.set("animal", tempState.animal);
    Object.entries(tempState.filters).forEach(([key, values]) => {
      if (values.length > 0) params.set(key, values.join(","));
    });

    router.replace(`?${params.toString()}`);
  };

  // ✅ URL이 바뀌면 Provider도 싱크
  useEffect(() => {
    const animal = (searchParams.get("animal") as Animal) || "cat";
    const filters: Record<string, string[]> = {};
    searchParams.forEach((value, key) => {
      if (key !== "animal") filters[key] = value.split(",");
    });

    setState({ animal, filters });
    setTempStateState({ animal, filters });
  }, [searchParams]);

  return (
    <FilterContext.Provider
      value={{
        state,
        tempState,
        setTempState,
        save,
      }}
    >
      {children}
    </FilterContext.Provider>
  );
}

export function useFilter() {
  const ctx = useContext(FilterContext);
  if (!ctx) throw new Error("useFilter must be used within FilterProvider");
  return ctx;
}
