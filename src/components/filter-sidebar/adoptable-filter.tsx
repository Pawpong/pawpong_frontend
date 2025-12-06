// components/filter/adoptable-filter.tsx

'use client'; // Zustand hook을 사용하기 위해 client 컴포넌트로 변경

import { useFilterStore } from '@/stores/filter-store';
import FilterContent from './filter-content';
import FilterList from './filter-list';
import FilterListItem from './filter-list-item';
import FilterSection from './filter-section';

// 하드코딩된 입양 가능 여부 데이터 (더보기 전까지는 API 호출 안함)
const ADOPTION_STATUS = [{ label: '입양 가능', value: true, description: '현재 입양 가능한 반려동물이 있는 브리더' }];

export default function AdoptableFilter() {
  const activeFilters = useFilterStore((state) => state.activeFilters);
  const toggleActiveFilter = useFilterStore((state) => state.toggleActiveFilter);

  return (
    <FilterSection>
      <FilterContent>
        <FilterList>
          {ADOPTION_STATUS.map((status) => (
            <FilterListItem
              key={status.label}
              // 스토어 상태를 기반으로 checked 여부 결정
              checked={activeFilters.includes(status.label)}
              // 체크박스 상태 변경 시 스토어 액션 호출
              onCheckedChange={() => toggleActiveFilter(status.label)}
            >
              {status.label}
            </FilterListItem>
          ))}
        </FilterList>
      </FilterContent>
    </FilterSection>
  );
}
