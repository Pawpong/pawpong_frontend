import FilterContent from "./filter-content";
import FilterHeader from "./filter-header";
import FilterList from "./filter-list";
import FilterListItem from "./filter-list-item";
import FilterSection from "./filter-section";
import FilterTitle from "./filter-title";
import MinimizeButton from "./minimize-button";
import MoreButton from "./more-button";

const levelFilterItems = [
  { id: 1, name: "뉴 New" },
  { id: 2, name: "엘리트 Elite" },
];
export default function LevelFilter() {
  return (
    <FilterSection>
      <FilterHeader>
        <FilterTitle>지역</FilterTitle>
        <MinimizeButton />
      </FilterHeader>
      <FilterContent>
        <FilterList>
          {levelFilterItems.map((item) => (
            <FilterListItem key={item.id}>{item.name}</FilterListItem>
          ))}
        </FilterList>
        <MoreButton />
      </FilterContent>
    </FilterSection>
  );
}
