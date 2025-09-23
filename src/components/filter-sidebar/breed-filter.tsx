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
  return (
    <FilterSection>
      <FilterHeader>
        <FilterTitle>품종</FilterTitle>
        <MinimizeButton />
      </FilterHeader>
      <FilterContent>
        <FilterList>
          {breedFilterItems.map((item) => (
            <FilterListItem key={item.id}>{item.name}</FilterListItem>
          ))}
        </FilterList>
        <MoreButton />
      </FilterContent>
    </FilterSection>
  );
}
