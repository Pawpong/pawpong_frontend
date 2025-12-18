import Link from 'next/link';
import BreederProfileSection from '@/components/breeder-profile/breeder-profile-section';
import BreederProfileSectionHeader from '@/components/breeder-profile/breeder-profile-section-header';
import BreederProfileSectionMore from '@/components/breeder-profile/breeder-profile-section-more';
import BreederProfileSectionTitle from '@/components/breeder-profile/breeder-profile-section-title';
import Review from './review';

interface ReviewsProps {
  data: { id: string; nickname: string; date: string; content: string }[];
  breederId: string;
}

export default function Reviews({ data, breederId }: ReviewsProps) {
  const displayedReviews = data.slice(0, 5);

  return (
    <BreederProfileSection>
      <BreederProfileSectionHeader>
        <BreederProfileSectionTitle>후기</BreederProfileSectionTitle>
        {data.length > 5 && (
          <Link href={`/explore/breeder/${breederId}/reviews`}>
            <BreederProfileSectionMore />
          </Link>
        )}
      </BreederProfileSectionHeader>
      <div className="flex flex-col gap-8">
        {displayedReviews.map((e: { id: string; nickname: string; date: string; content: string }) => (
          <Review key={e.id} data={e} />
        ))}
      </div>
    </BreederProfileSection>
  );
}
