import BreederProfile from "@/app/(main)/explore/breeder/[id]/_components/breeder-profile";
import BreederProfileSection from "@/components/breeder-profile/breeder-profile-section";
import BreederProfileSectionHeader from "@/components/breeder-profile/breeder-profile-section-header";
import BreederProfileSectionMore from "@/components/breeder-profile/breeder-profile-section-more";
import BreederProfileSectionTitle from "@/components/breeder-profile/breeder-profile-section-title";
import { Separator } from "@/components/ui/separator";
import EnvPhotos from "./_components/env-photos";

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
        <Separator />
        <BreederProfileSection>
          <BreederProfileSectionHeader>
            <BreederProfileSectionTitle>
              분양 중인 아이들
            </BreederProfileSectionTitle>
            <BreederProfileSectionMore />
          </BreederProfileSectionHeader>
          <div></div>
        </BreederProfileSection>
        <Separator />
        <BreederProfileSection>
          <BreederProfileSectionHeader>
            <BreederProfileSectionTitle>엄마 · 아빠</BreederProfileSectionTitle>
            <BreederProfileSectionMore />
          </BreederProfileSectionHeader>
          <div></div>
        </BreederProfileSection>
        <Separator />
        <BreederProfileSection>
          <BreederProfileSectionHeader>
            <BreederProfileSectionTitle>후기</BreederProfileSectionTitle>
            <BreederProfileSectionMore />
          </BreederProfileSectionHeader>
          <div></div>
        </BreederProfileSection>
      </div>
    </div>
  );
}
