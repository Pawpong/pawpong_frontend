'use client';

import { filter } from '@/constants/filter';
import { useSegment } from '@/hooks/use-segment';
import { useFilterStore } from '@/stores/filter-store';
import FilterContent from './filter-content';
import FilterHeader from './filter-header';
import FilterList from './filter-list';
import FilterListItem from './filter-list-item';
import FilterSection from './filter-section';
import FilterTitle from './filter-title';
import MinimizeButton from './minimize-button';
import MoreButton from './more-button';

// 인기 지역 (하드코딩)
const TOP_LOCATIONS = ['서울특별시', '부산광역시', '경기도', '인천광역시', '대구광역시'];

export default function LocationFilter() {
  const activeFilters = useFilterStore((state) => state.activeFilters);
  const toggleActiveFilter = useFilterStore((state) => state.toggleActiveFilter);
  const resetModalState = useFilterStore((state) => state.resetModalState);
  const selectPath = useFilterStore((state) => state.selectPath);
  const animal = (useSegment(1) as 'cat' | 'dog') || 'cat';
  const rootFilters = filter[animal];

  return (
    <FilterSection>
      <FilterHeader>
        <FilterTitle>지역</FilterTitle>
        <MinimizeButton />
      </FilterHeader>
      <FilterContent>
        <FilterList>
          {TOP_LOCATIONS.map((location, index) => (
            <FilterListItem
              key={`${location}-${index}`}
              checked={activeFilters.includes(location)}
              onCheckedChange={() => toggleActiveFilter(location)}
            >
              {location}
            </FilterListItem>
          ))}
        </FilterList>
        <MoreButton
          onClick={() => {
            resetModalState();
            selectPath(rootFilters[2], 0);
          }}
        />
      </FilterContent>
    </FilterSection>
  );
}
