// components/filter/breed-filter.tsx

"use client"; // Zustand hook을 사용하기 위해 client 컴포넌트로 변경

import { useFilterStore } from "@/stores/filter-store";
import FilterContent from "./filter-content";
import FilterHeader from "./filter-header";
import FilterList from "./filter-list";
import FilterListItem from "./filter-list-item";
import FilterSection from "./filter-section";
import FilterTitle from "./filter-title";
import MinimizeButton from "./minimize-button";
import MoreButton from "./more-button";

const breedFilterItems = [
  { id: 1, name: "시베리안(트래디셔널, 네바마스커레이드)" },
  { id: 2, name: "브리티쉬 롱헤어" },
  { id: 3, name: "메인쿤" },
  { id: 4, name: "노르웨이숲" },
  { id: 5, name: "랙돌" },
];

export default function BreedFilter() {
  // 2. 스토어에서 상태와 액션을 가져옵니다.
  const { activeFilters, toggleActiveFilter } = useFilterStore();

  return (
    <FilterSection>
      <FilterHeader>
        <FilterTitle>품종</FilterTitle>
        <MinimizeButton />
      </FilterHeader>
      <FilterContent>
        <FilterList>
          {breedFilterItems.map((item) => (
            <FilterListItem
              key={item.id}
              // 3. 스토어 상태를 기반으로 checked 여부 결정
              checked={activeFilters.includes(item.name)}
              // 4. 체크박스 상태 변경 시 스토어 액션 호출
              onCheckedChange={() => toggleActiveFilter(item.name)}
            >
              {item.name}
            </FilterListItem>
          ))}
        </FilterList>
        <MoreButton />
      </FilterContent>
    </FilterSection>
  );
}
