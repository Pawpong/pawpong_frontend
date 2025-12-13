import BreederProfileSection from '@/components/breeder-profile/breeder-profile-section';
import BreederProfileSectionHeader from '@/components/breeder-profile/breeder-profile-section-header';
import BreederProfileSectionMore from '@/components/breeder-profile/breeder-profile-section-more';
import BreederProfileSectionTitle from '@/components/breeder-profile/breeder-profile-section-title';
import Review from './review';

export default function Reviews({ data }: { data: { id: string; nickname: string; date: string; content: string }[] }) {
  return (
    <BreederProfileSection>
      <BreederProfileSectionHeader>
        <BreederProfileSectionTitle>후기</BreederProfileSectionTitle>
        <BreederProfileSectionMore />
      </BreederProfileSectionHeader>
      <div className="flex flex-col gap-8">
        {data.map((e: { id: string; nickname: string; date: string; content: string }) => (
          <Review key={e.id} data={e} />
        ))}
      </div>
    </BreederProfileSection>
  );
}
