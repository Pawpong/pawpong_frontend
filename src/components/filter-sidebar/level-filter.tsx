"use client"; // 클라이언트 컴포넌트로 변경

import { filter } from "@/constants/filter";
import { useSegment } from "@/hooks/use-segment";
import { useFilterStore } from "@/stores/filter-store";
import FilterContent from "./filter-content";
import FilterHeader from "./filter-header";
import FilterList from "./filter-list";
import FilterListItem from "./filter-list-item";
import FilterSection from "./filter-section";
import FilterTitle from "./filter-title";
import MinimizeButton from "./minimize-button";
import MoreButton from "./more-button";

// 하드코딩된 브리더 레벨 데이터 (더보기 전까지는 API 호출 안함)
const BREEDER_LEVELS = [
  { value: "elite", label: "엘리트", description: "인증된 전문 브리더" },
  { value: "new", label: "뉴", description: "신규 브리더" },
];

export default function LevelFilter() {
  // 스토어에서 상태와 액션을 가져옵니다.
  const activeFilters = useFilterStore((state) => state.activeFilters);
  const toggleActiveFilter = useFilterStore(
    (state) => state.toggleActiveFilter
  );
  const resetModalState = useFilterStore((state) => state.resetModalState);
  const selectPath = useFilterStore((state) => state.selectPath);
  const animal = (useSegment(1) as "cat" | "dog") || "cat";
  const rootFilters = filter[animal];

  return (
    <FilterSection>
      <FilterHeader>
        <FilterTitle>브리더 레벨</FilterTitle>
        <MinimizeButton />
      </FilterHeader>
      <FilterContent>
        <FilterList>
          {BREEDER_LEVELS.map((level) => (
            <FilterListItem
              key={level.value}
              // 스토어 상태와 액션을 자식 컴포넌트에 연결합니다.
              checked={activeFilters.includes(level.label)}
              onCheckedChange={() => toggleActiveFilter(level.label)}
            >
              {level.label}
            </FilterListItem>
          ))}
        </FilterList>
        <MoreButton
          onClick={() => {
            resetModalState();
            selectPath(rootFilters[3], 0);
          }}
        />
      </FilterContent>
    </FilterSection>
  );
}
