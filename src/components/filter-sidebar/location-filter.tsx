"use client"; // 1. 클라이언트 컴포넌트로 변경

import { useFilterStore } from "@/stores/filter-store";
import FilterContent from "./filter-content";
import FilterHeader from "./filter-header";
import FilterList from "./filter-list";
import FilterListItem from "./filter-list-item";
import FilterSection from "./filter-section";
import FilterTitle from "./filter-title";
import MinimizeButton from "./minimize-button";
import MoreButton from "./more-button";

const locationFilterItems = [
  { id: 1, name: "경기도" },
  { id: 2, name: "인천광역시" },
  { id: 3, name: "강원도" },
  { id: 4, name: "전라북도" },
  { id: 5, name: "충청북도" },
];

export default function LocationFilter() {
  // 3. 스토어에서 상태와 액션을 가져옵니다.
  const { activeFilters, toggleActiveFilter } = useFilterStore();

  return (
    <FilterSection>
      <FilterHeader>
        <FilterTitle>지역</FilterTitle>
        <MinimizeButton />
      </FilterHeader>
      <FilterContent>
        <FilterList>
          {locationFilterItems.map((item) => (
            <FilterListItem
              key={item.id}
              // 4. 스토어 상태와 액션을 자식 컴포넌트에 연결합니다.
              checked={activeFilters.includes(item.name)}
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
