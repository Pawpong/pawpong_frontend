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
  return (
    <FilterSection>
      <FilterHeader>
        <FilterTitle>지역</FilterTitle>
        <MinimizeButton />
      </FilterHeader>
      <FilterContent>
        <FilterList>
          {locationFilterItems.map((item) => (
            <FilterListItem key={item.id}>{item.name}</FilterListItem>
          ))}
        </FilterList>
        <MoreButton />
      </FilterContent>
    </FilterSection>
  );
}
