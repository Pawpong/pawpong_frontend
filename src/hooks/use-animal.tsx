import { useFilterStore } from "@/stores/filter-store";
import { useEffect } from "react";
import { useSegment } from "./use-segment";

export default function useAnimal(): "cat" | "dog" {
  const { setAnimal } = useFilterStore();
  const animal = (useSegment(1) as "cat" | "dog") || "cat";

  // animal 값이 변경될 때마다 스토어의 상태를 업데이트합니다.
  useEffect(() => {
    setAnimal(animal);
  }, [animal, setAnimal]);
  return (useSegment(1) as "cat" | "dog") || "cat";
}
