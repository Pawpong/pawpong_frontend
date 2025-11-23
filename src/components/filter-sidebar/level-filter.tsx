"use client";

import { useFilterStore } from "@/stores/filter-store";
import FilterContent from "./filter-content";
import FilterHeader from "./filter-header";
import FilterList from "./filter-list";
import FilterListItem from "./filter-list-item";
import FilterSection from "./filter-section";
import FilterTitle from "./filter-title";
import MinimizeButton from "./minimize-button";

const levelFilterItems = [
  { id: 1, name: "뉴 New" },
  { id: 2, name: "엘리트 Elite" },
];
export default function LevelFilter() {
  // 스토어에서 상태와 액션을 가져옵니다.
  const activeFilters = useFilterStore((state) => state.activeFilters);
  const toggleActiveFilter = useFilterStore(
    (state) => state.toggleActiveFilter
  );

  return (
    <FilterSection>
      <FilterHeader>
        <FilterTitle>브리더 레벨</FilterTitle>
        <MinimizeButton />
      </FilterHeader>
      <FilterContent>
        <FilterList>
          {levelFilterItems.map((item) => (
            <FilterListItem
              key={item.id}
              // 스토어 상태와 액션을 자식 컴포넌트에 연결합니다.
              checked={activeFilters.includes(item.name)}
              onCheckedChange={() => toggleActiveFilter(item.name)}
            >
              {item.name}
            </FilterListItem>
          ))}
        </FilterList>
      </FilterContent>
    </FilterSection>
  );
}
