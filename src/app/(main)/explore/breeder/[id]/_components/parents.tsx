import BreederProfileSection from "@/components/breeder-profile/breeder-profile-section";
import BreederProfileSectionHeader from "@/components/breeder-profile/breeder-profile-section-header";
import BreederProfileSectionMore from "@/components/breeder-profile/breeder-profile-section-more";
import BreederProfileSectionTitle from "@/components/breeder-profile/breeder-profile-section-title";
import AnimalProfile from "./animal-profile";

export default function Parents({
  data,
}: {
  data: {
    id: string;
    avatarUrl: string;
    name: string;
    sex: "male" | "female";
    birth: string;
    price: string;
    breed: string;
  }[];
}) {
  return (
    <BreederProfileSection>
      <BreederProfileSectionHeader>
        <BreederProfileSectionTitle>엄마 · 아빠</BreederProfileSectionTitle>
        <BreederProfileSectionMore />
      </BreederProfileSectionHeader>
      <div className="space-y-7 md:grid md:grid-cols-3 md:gap-gutter">
        {data.map(
          (e: {
            id: string;
            avatarUrl: string;
            name: string;
            sex: "male" | "female";
            birth: string;
            price: string;
            breed: string;
          }) => (
            <AnimalProfile key={e.id} data={e} />
          )
        )}
      </div>
    </BreederProfileSection>
  );
}
