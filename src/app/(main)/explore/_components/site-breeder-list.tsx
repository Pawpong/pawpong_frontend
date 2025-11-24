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
import { BREEDER_LIST_MOCK } from "@/app/(main)/explore/_mocks/explore-mock-data";

export default function SiteBreederList() {
  return (
    <BreederList>
      {BREEDER_LIST_MOCK.map((breeder) => (
        <Link
          key={breeder.id}
          href={`/explore/breeder/${breeder.id}`}
          className="block"
        >
          <Breeder>
            <BreederProfile>
              <BreederHeader>
                <BreederAvatar src={breeder.avatar} animal={breeder.animal} />
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
