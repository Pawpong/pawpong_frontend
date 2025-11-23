// components/filter/breed-filter.tsx

"use client"; // Zustand hook을 사용하기 위해 client 컴포넌트로 변경

import { useFilterStore } from "@/stores/filter-store";
import FilterContent from "./filter-content";
import FilterList from "./filter-list";
import FilterListItem from "./filter-list-item";
import FilterSection from "./filter-section";

export default function AdoptableFilter() {
  const activeFilters = useFilterStore((state) => state.activeFilters);
  const toggleActiveFilter = useFilterStore(
    (state) => state.toggleActiveFilter
  );
  return (
    <FilterSection>
      <FilterContent>
        <FilterList>
          <FilterListItem
            // 3. 스토어 상태를 기반으로 checked 여부 결정
            checked={activeFilters.includes("입양 가능")}
            // 4. 체크박스 상태 변경 시 스토어 액션 호출
            onCheckedChange={() => toggleActiveFilter("입양 가능")}
          >
            입양 가능
          </FilterListItem>
        </FilterList>
      </FilterContent>
    </FilterSection>
  );
}
