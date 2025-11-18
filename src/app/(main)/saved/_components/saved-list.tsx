"use client";

import { Button } from "@/components/ui/button";
import Breeder from "@/components/breeder-list/breeder";
import BreederContent from "@/components/breeder-list/breeder-content";
import BreederDescription from "@/components/breeder-list/breader-description";
import BreederHeader from "@/components/breeder-list/breeder-header";
import BreederImage from "@/components/breeder-list/breeder-image";
import BreederLocation from "@/components/breeder-list/breeder-location";
import BreederName from "@/components/breeder-list/breeder-name";
import BreederPrice from "@/components/breeder-list/breeder-price";
import BreederProfile from "@/components/breeder-list/breeder-profile";
import BreederTags from "@/components/breeder-list/breeder-tags";
import BreederAvatar from "@/components/breeder-list/breeder-avatar";
import BreederLikeButton from "@/components/breeder-list/breader-like-button";
import AdoptionStatusBadge from "@/components/adoption-status-badge";
import LevelBadge from "@/components/level-badge";
import GrayDot from "@/assets/icons/gray-dot.svg";
import BreederList from "@/components/breeder-list/breeder-list";
import Container from "@/components/ui/container";
import EmptySavedList from "./empty-saved-list";
import { useFavorites } from "../_hooks/use-favorites";

export default function SavedList() {
  const { data, isLoading, error } = useFavorites(1, 20);

  if (isLoading) {
    return (
      <Container>
        <div className="flex-1 @container">
          <div className="text-[#4F3B2E] text-heading-3 font-semibold mt-6 lg:mt-10">
            찜한 브리더
          </div>
          <div className="flex items-center justify-center min-h-[400px]">
            <div className="text-grayscale-500">즐겨찾기 목록을 불러오는 중...</div>
          </div>
        </div>
      </Container>
    );
  }

  if (error) {
    return (
      <Container>
        <div className="flex-1 @container">
          <div className="text-[#4F3B2E] text-heading-3 font-semibold mt-6 lg:mt-10">
            찜한 브리더
          </div>
          <div className="flex items-center justify-center min-h-[400px]">
            <div className="text-red-500">
              즐겨찾기 목록을 불러오는 데 실패했습니다.
            </div>
          </div>
        </div>
      </Container>
    );
  }

  const savedBreeders = data?.breeders || [];

  return (
    <Container>
      <div className="flex-1 @container">
        <div className="text-[#4F3B2E] text-heading-3 font-semibold mt-6 lg:mt-10">
          찜한 브리더
        </div>
        {savedBreeders.length === 0 ? (
          <EmptySavedList />
        ) : (
          <BreederList>
            {savedBreeders.map((breeder, index) => (
              <Breeder key={breeder.id || index}>
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
                    <BreederLikeButton
                      breederId={breeder.id}
                      initialIsFavorited={true}
                    />
                  </div>
                  <div className="absolute bottom-0 right-0 p-3">
                    <AdoptionStatusBadge status={breeder.status} />
                  </div>
                </div>
              </Breeder>
            ))}
          </BreederList>
        )}
      </div>
    </Container>
  );
}
