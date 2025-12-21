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
import { useAnalytics } from '@/hooks/use-analytics';

// 강아지 인기 품종 (하드코딩)
const TOP_DOG_BREEDS = ['말티즈', '푸들', '웰시코기', '시바견', '골든 리트리버'];

// 고양이 인기 품종 (하드코딩)
const TOP_CAT_BREEDS = ['시베리안', '브리티쉬 롱헤어', '아비시니안', '아메리칸 숏헤어', '뱅갈'];

export default function BreedFilter() {
  const activeFilters = useFilterStore((state) => state.activeFilters);
  const toggleActiveFilter = useFilterStore((state) => state.toggleActiveFilter);
  const resetModalState = useFilterStore((state) => state.resetModalState);
  const selectPath = useFilterStore((state) => state.selectPath);
  const animal = (useSegment(1) as 'cat' | 'dog') || 'cat';
  const rootFilters = filter[animal];
  const { trackSearch } = useAnalytics();

  // 동물 타입에 따라 상위 품종 선택
  const topBreeds = animal === 'dog' ? TOP_DOG_BREEDS : TOP_CAT_BREEDS;

  const handleBreedToggle = (breed: string) => {
    toggleActiveFilter(breed);
    // GA4 품종 검색 트래킹
    trackSearch(breed, 'breed');
  };

  return (
    <FilterSection>
      <FilterHeader>
        <FilterTitle>품종</FilterTitle>
        <MinimizeButton />
      </FilterHeader>
      <FilterContent>
        <FilterList>
          {topBreeds.map((breed, index) => (
            <FilterListItem
              key={`${breed}-${index}`}
              checked={activeFilters.includes(breed)}
              onCheckedChange={() => handleBreedToggle(breed)}
            >
              {breed}
            </FilterListItem>
          ))}
        </FilterList>
        <MoreButton
          onClick={() => {
            resetModalState();
            selectPath(rootFilters[1], 0);
          }}
        />
      </FilterContent>
    </FilterSection>
  );
}
