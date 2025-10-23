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

const breederListInfo: {
  id: string;
  avatar: string;
  name: string;
  level: "elite" | "new";
  location: string;
  price: string;
  tags: string[];
  image: string;
  status: "available" | "reserved" | "completed";
}[] = [
  {
    id: "1",
    avatar: "/avatar-sample.png",
    name: "범과같이",
    level: "elite",
    location: "경기도 용인시",
    price: "500,000 - 1,000,000원",
    tags: ["시베리안(트래디셔널, 네바마스커레이드)", "브리티쉬 롱헤어"],
    image: "/main-img-sample.png",
    status: "available",
  },
  {
    id: "2",
    avatar: "/avatar-sample.png",
    name: "범과같이",
    level: "elite",
    location: "경기도 용인시",
    price: "500,000 - 1,000,000원",
    tags: ["시베리안(트래디셔널, 네바마스커레이드)", "브리티쉬 롱헤어"],
    image: "/main-img-sample.png",
    status: "reserved",
  },
  {
    id: "3",
    avatar: "/avatar-sample.png",
    name: "범과같이",
    level: "elite",
    location: "경기도 용인시",
    price: "500,000 - 1,000,000원",
    tags: ["시베리안(트래디셔널, 네바마스커레이드)", "브리티쉬 롱헤어"],
    image: "/main-img-sample.png",
    status: "completed",
  },
  {
    id: "4",
    avatar: "/avatar-sample.png",
    name: "범과같이",
    level: "elite",
    location: "경기도 용인시",
    price: "500,000 - 1,000,000원",
    tags: ["시베리안(트래디셔널, 네바마스커레이드)", "브리티쉬 롱헤어"],
    image: "/main-img-sample.png",
    status: "available",
  },
];

export default function SiteBreederList() {
  return (
    <BreederList>
      {breederListInfo.map((breeder, index) => (
        <Breeder key={index}>
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
            <BreederImage src="/main-img-sample.png" />
            <div className="absolute top-0 right-0 p-3">
              <BreederLikeButton breederId={breeder.id} />
            </div>
            <div className="absolute bottom-0 right-0 p-3">
              <AdoptionStatusBadge status={breeder.status} />
            </div>
          </div>
        </Breeder>
      ))}
    </BreederList>
  );
}
