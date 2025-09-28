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

const breederListInfo: {
  avatar: string;
  name: string;
  level: "elite" | "new";
  location: string;
  price: string;
  tags: string[];
}[] = [
  {
    avatar: "/avatar-sample.png",
    name: "범과같이",
    level: "elite",
    location: "경기도 용인시",
    price: "500,000 - 1,000,000원",
    tags: ["시베리안(트래디셔널, 네바마스커레이드)", "브리티쉬 롱헤어"],
  },
  {
    avatar: "/avatar-sample.png",
    name: "범과같이",
    level: "elite",
    location: "경기도 용인시",
    price: "500,000 - 1,000,000원",
    tags: ["시베리안(트래디셔널, 네바마스커레이드)", "브리티쉬 롱헤어"],
  },
  {
    avatar: "/avatar-sample.png",
    name: "범과같이",
    level: "elite",
    location: "경기도 용인시",
    price: "500,000 - 1,000,000원",
    tags: ["시베리안(트래디셔널, 네바마스커레이드)", "브리티쉬 롱헤어"],
  },
  {
    avatar: "/avatar-sample.png",
    name: "범과같이",
    level: "elite",
    location: "경기도 용인시",
    price: "500,000 - 1,000,000원",
    tags: ["시베리안(트래디셔널, 네바마스커레이드)", "브리티쉬 롱헤어"],
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
              <BreederLikeButton />
            </div>
          </div>
        </Breeder>
      ))}
    </BreederList>
  );
}
