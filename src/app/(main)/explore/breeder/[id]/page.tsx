import BreederProfile from "@/app/(main)/explore/breeder/[id]/_components/breeder-profile";
import { Separator } from "@/components/ui/separator";
import BreederDescription from "./_components/breeder-description";
import BreedingAnimals from "./_components/breeding-animals";
import EnvPhotos from "./_components/env-photos";
import Parents from "./_components/parents";
import Reviews from "./_components/reviews";

export default function Page() {
  return (
    <div className="pt-4 lg:flex lg:gap-24.5 space-y-10 md:space-y-15 pb-10 md:pb-15 lg:lg-80">
      <div>
        <BreederProfile
          data={{
            avatarUrl: "/avatar-sample.png",
            nickname: "범과 같이",
            level: "elite",
            location: "경기도 용인시",
            priceRange: "500,000 - 1,000,000원",
            breeds: ["메인쿤", "러시안 블루", "샴"],
          }}
        />
      </div>
      <div className="space-y-12 ">
        <EnvPhotos photos={["/login-image.png", "/main-img-sample.png"]} />
        <Separator className="md:my-12" />

        <BreederDescription
          data={
            "이곳은 브리더에 대한 설명입니다.이곳은 브리더에 대한 설명입니다.이곳은 브리더에 대한 설명입니다.이곳은 브리더에 대한 설명입니다.이곳은 브리더에 대한 설명입니다.이곳은 브리더에 대한 설명입니다.이곳은 브리더에 대한 설명입니다.이곳은 브리더에 대한 설명입니다.이곳은 브리더에 대한 설명입니다.이곳은 브리더에 대한 설명입니다.이곳은 브리더에 대한 설명입니다.이곳은 브리더에 대한 설명입니다.이곳은 브리더에 대한 설명입니다.이곳은 브리더에 대한 설명입니다.이곳은 브리더에 대한 설명입니다.이곳은 브리더에 대한 설명입니다.이곳은 브리더에 대한 설명입니다.이곳은 브리더에 대한 설명입니다.이곳은 브리더에 대한 설명입니다.이곳은 브리더에 대한 설명입니다.이곳은 브리더에 대한 설명입니다.이곳은 브리더에 대한 설명입니다.이곳은 브리더에 대한 설명입니다.이곳은 브리더에 대한 설명입니다.이곳은 브리더에 대한 설명입니다.이곳은 브리더에 대한 설명입니다.이곳은 브리더에 대한 설명입니다.이곳은 브리더에 대한 설명입니다.이곳은 브리더에 대한 설명입니다.이곳은 브리더에 대한 설명입니다.이곳은 브리더에 대한 설명입니다.이곳은 브리더에 대한 설명입니다.이곳은 브리더에 대한 설명입니다.이곳은 브리더에 대한 설명입니다.이곳은 브리더에 대한 설명입니다.이곳은 브리더에 대한 설명입니다.이곳은 브리더에 대한 설명입니다.이곳은 브리더에 대한 설명입니다.이곳은 브리더에 대한 설명입니다.이곳은 브리더에 대한 설명입니다."
          }
        />
        <Separator className="md:my-12" />
        <BreedingAnimals
          data={[
            {
              id: "1",
              avatarUrl: "/animal-sample.png",
              name: "루시",
              sex: "male",
              birth: "2020-01-01",
              price: "500,000원",
              breed: "메인쿤",
            },
            {
              id: "2",
              avatarUrl: "/animal-sample.png",
              name: "코코",
              sex: "female",
              birth: "2021-01-01",
              price: "600,000원",
              breed: "러시안 블루",
            },
          ]}
        />
        <Separator className="md:my-12" />
        <Parents
          data={[
            {
              id: "1",
              avatarUrl: "/animal-sample.png",
              name: "루시",
              sex: "male",
              birth: "2020-01-01",
              price: "500,000원",
              breed: "메인쿤",
            },
            {
              id: "2",
              avatarUrl: "/animal-sample.png",
              name: "코코",
              sex: "female",
              birth: "2021-01-01",
              price: "600,000원",
              breed: "러시안 블루",
            },
          ]}
        />

        <Separator className="md:my-12" />
        <Reviews
          data={[
            {
              id: "1",
              nickname: "냥집사",
              date: "2023-10-01",
              content: "정말 좋은 브리더님이세요!",
            },
            {
              id: "2",
              nickname: "펫러버",
              date: "2023-09-15",
              content: "아이들이 건강하게 잘 자라고 있어요.",
            },
            {
              id: "3",
              nickname: "고양이매니아",
              date: "2023-08-20",
              content: "분양 과정이 매우 친절했습니다.",
            },
          ]}
        />
      </div>
    </div>
  );
}
