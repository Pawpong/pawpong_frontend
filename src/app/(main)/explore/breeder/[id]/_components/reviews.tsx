import Link from 'next/link';
import BreederProfileSection from '@/components/breeder-profile/breeder-profile-section';
import BreederProfileSectionHeader from '@/components/breeder-profile/breeder-profile-section-header';
import BreederProfileSectionMore from '@/components/breeder-profile/breeder-profile-section-more';
import BreederProfileSectionTitle from '@/components/breeder-profile/breeder-profile-section-title';
import Review from './review';
import { Button } from '@/components/ui/button';
import Pencil from '@/assets/icons/pencil.svg';

interface ReviewData {
  id: string;
  nickname: string;
  date: string;
  content: string;
  reviewType?: string;
  replyContent?: string | null;
  replyWrittenAt?: string | null;
  replyUpdatedAt?: string | null;
  breederNickname?: string;
  breederProfileImage?: string | null;
  breedingPetType?: string;
}

interface ReviewsProps {
  data: ReviewData[];
  breederId: string;
  isOwnProfile?: boolean;
}

export default function Reviews({ data, breederId, isOwnProfile = false }: ReviewsProps) {
  const displayedReviews = data.slice(0, 5);

  return (
    <BreederProfileSection id="reviews">
      <BreederProfileSectionHeader>
        <BreederProfileSectionTitle>후기</BreederProfileSectionTitle>
        {data.length > 5 && (
          <>
            {isOwnProfile ? (
              <Link href="/profile/reviews">
                <Button
                  type="button"
                  variant="ghost"
                  className="gap-1 has-[>svg]:px-0 text-body-xs font-medium text-secondary-700"
                >
                  <div>관리</div>
                  <Pencil />
                </Button>
              </Link>
            ) : (
              <Link href={`/explore/breeder/${breederId}/reviews`}>
                <BreederProfileSectionMore />
              </Link>
            )}
          </>
        )}
      </BreederProfileSectionHeader>
      <div className="flex flex-col gap-8 ">
        {displayedReviews.map((e: ReviewData) => (
          <Review key={e.id} data={e} />
        ))}
      </div>
    </BreederProfileSection>
  );
}
