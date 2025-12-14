import BreederProfileSection from '@/components/breeder-profile/breeder-profile-section';
import BreederProfileSectionHeader from '@/components/breeder-profile/breeder-profile-section-header';
import BreederProfileSectionMore from '@/components/breeder-profile/breeder-profile-section-more';
import BreederProfileSectionTitle from '@/components/breeder-profile/breeder-profile-section-title';
import AnimalProfile from './animal-profile';

export default function BreedingAnimals({
  data,
}: {
  data: {
    id: string;
    avatarUrl: string;
    name: string;
    sex: 'male' | 'female';
    birth: string;
    price: string | null;
    breed: string;
  }[];
}) {
  return (
    <BreederProfileSection>
      <BreederProfileSectionHeader>
        <BreederProfileSectionTitle>분양 중인 아이들</BreederProfileSectionTitle>
        {data.length > 3 && <BreederProfileSectionMore />}
      </BreederProfileSectionHeader>
      <div className="space-y-7 md:grid md:grid-cols-3 md:gap-gutter">
        {data.map(
          (e: {
            id: string;
            avatarUrl: string;
            name: string;
            sex: 'male' | 'female';
            birth: string;
            price: string | null;
            breed: string;
          }) => (
            <AnimalProfile key={e.id} data={e} />
          ),
        )}
      </div>
    </BreederProfileSection>
  );
}
