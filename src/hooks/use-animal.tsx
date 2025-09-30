import { useFilterStore } from "@/stores/filter-store";
import { useEffect } from "react";
import { useSegment } from "./use-segment";

export default function useAnimal(): "cat" | "dog" {
  const setAnimal = useFilterStore((state) => state.setAnimal);
  const animal = (useSegment(1) as "cat" | "dog") || "cat";
  const clearActiveFilters = useFilterStore(
    (state) => state.clearActiveFilters
  );
  // animal 값이 변경될 때마다 스토어의 상태를 업데이트합니다.
  useEffect(() => {
    setAnimal(animal);
    clearActiveFilters();
  }, [animal, setAnimal, clearActiveFilters]);
  return animal;
}
