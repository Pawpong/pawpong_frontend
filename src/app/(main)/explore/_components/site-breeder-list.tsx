import Link from "next/link";
import AdoptionStatusBadge from "@/components/adoption-status-badge";
import BreederDescription from "@/components/breeder-list/breader-description";
import BreederLikeButton from "@/components/breeder-list/breader-like-button";
import Breeder from "@/components/breeder-list/breeder";
import BreederAvatar from "@/components/breeder-list/breeder-avatar";
import BreederContent from "@/components/breeder-list/breeder-content";
import BreederHeader from "@/components/breeder-list/breeder-header";
import BreederImage from "@/components/breeder-list/breeder-image";
import BreederList from "@/components/breeder-list/breeder-list";
import BreederLocation from "@/components/breeder-list/breeder-location";
import BreederName from "@/components/breeder-list/breeder-name";
import BreederPrice from "@/components/breeder-list/breeder-price";
import BreederProfile from "@/components/breeder-list/breeder-profile";
import BreederTags from "@/components/breeder-list/breeder-tags";
import LevelBadge from "@/components/level-badge";
import { Button } from "@/components/ui/button";
import GrayDot from "@/assets/icons/gray-dot.svg";
import { useBreeders } from "../_hooks/use-breeders";
import { useFilterStore } from "@/stores/filter-store";
import { mapFiltersToParams } from "@/lib/filter-mapper";
import { useSegment } from "@/hooks/use-segment";

export default function SiteBreederList() {
  // URL 경로에서 petType 자동 감지 (useSegment 사용)
  const petType = (useSegment(1) as "cat" | "dog") || "cat";

  // 필터 스토어에서 활성화된 필터 가져오기
  const activeFilters = useFilterStore((state) => state.activeFilters);

  // 활성화된 필터를 백엔드 API 파라미터로 변환
  const filterParams = mapFiltersToParams(activeFilters, petType);

  const { data, isLoading, error } = useBreeders({
    petType, // URL 경로에 따라 자동으로 설정
    page: 1,
    limit: 20,
    ...filterParams, // 필터 파라미터 추가
  });

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-grayscale-500">브리더 목록을 불러오는 중...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-red-500">
          브리더 목록을 불러오는 데 실패했습니다.
        </div>
      </div>
    );
  }

  const breeders = data?.breeders || [];

  if (breeders.length === 0) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-grayscale-500">브리더가 없습니다.</div>
      </div>
    );
  }

  return (
    <BreederList>
      {breederListInfo.map((breeder) => (
        <Link
          key={breeder.id}
          href={`/explore/breeder/${breeder.id}`}
          className="block"
        >
          <Breeder>
            <BreederProfile>
              <BreederHeader>
                <BreederAvatar src={breeder.avatar} />
                <div className="flex items-center gap-2">
                  <BreederName>{breeder.name}</BreederName>
                  <LevelBadge level={breeder.level} />
                </div>
              </BreederHeader>
              <BreederContent>
                <BreederDescription>
                  <BreederLocation>{breeder.location}</BreederLocation>
                  <GrayDot className="block sm:hidden lg:block align-middle" />
                  <BreederPrice>{breeder.price}</BreederPrice>
                </BreederDescription>
                <BreederTags>
                  {breeder.tags.map((tag, idx) => (
                    <Button variant="secondary" key={idx}>
                      {tag}
                    </Button>
                  ))}
                </BreederTags>
              </BreederContent>
            </BreederProfile>
            <div className="relative">
              <BreederImage src={breeder.image} />
              <div className="absolute top-0 right-0 p-3">
                <BreederLikeButton breederId={breeder.id} />
              </div>
              <div className="absolute bottom-0 right-0 p-3">
                <AdoptionStatusBadge status={breeder.status} />
              </div>
            </div>
          </Breeder>
        </Link>
      ))}
    </BreederList>
  );
}
