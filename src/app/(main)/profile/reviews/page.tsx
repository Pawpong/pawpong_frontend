// 'use client';

// import React from 'react';
// import { useInfiniteQuery } from '@tanstack/react-query';
// import Container from '@/components/ui/container';
// import { Separator } from '@/components/ui/separator';
// import LoadMoreButton from '@/components/ui/load-more-button';
// import { useBreakpoint } from '@/hooks/use-breakpoint';
// import { useAuthGuard } from '@/hooks/use-auth-guard';
// import { getMyReviews, type MyReviewItemDto } from '@/app/api/breeder-management';
// import EmptyReviewsState from './_components/empty-reviews-state';
// import ReviewListItem from './_components/review-list-item';

// const PAGE_SIZE = 10;

// export default function ReviewsPage() {
//   const { isLoading: isAuthLoading } = useAuthGuard();
//   const isMdUp = useBreakpoint('md');

//   const { data, isLoading, isError, fetchNextPage, hasNextPage, isFetchingNextPage } = useInfiniteQuery({
//     queryKey: ['breeder-my-reviews'],
//     queryFn: ({ pageParam = 1 }) => getMyReviews('all', pageParam, PAGE_SIZE),
//     getNextPageParam: (lastPage) => {
//       if (lastPage.pagination.hasNextPage) {
//         return lastPage.pagination.currentPage + 1;
//       }
//       return undefined;
//     },
//     enabled: !isAuthLoading,
//   });

//   const allReviews = data?.pages.flatMap((page) => page.reviews) || [];

//   const handleLoadMore = () => {
//     if (hasNextPage && !isFetchingNextPage) {
//       fetchNextPage();
//     }
//   };

//   if (isAuthLoading || isLoading) {
//     return (
//       <Container>
//         <div className="flex-1 @container flex flex-col gap-6 lg:gap-10">
//           <div className="text-[#4F3B2E] text-heading-3 font-semibold mt-6 lg:mt-10">후기 관리</div>
//           <div className="flex justify-center py-20">
//             <p className="text-body-s text-grayscale-gray5">로딩 중...</p>
//           </div>
//         </div>
//       </Container>
//     );
//   }

//   if (isError) {
//     return (
//       <Container>
//         <div className="flex-1 @container flex flex-col gap-6 lg:gap-10">
//           <div className="text-[#4F3B2E] text-heading-3 font-semibold mt-6 lg:mt-10">후기 관리</div>
//           <div className="flex justify-center py-20">
//             <p className="text-body-s text-grayscale-gray5">후기를 불러오는 중 오류가 발생했습니다.</p>
//           </div>
//         </div>
//       </Container>
//     );
//   }

//   return (
//     <Container>
//       <div className="flex-1 @container flex flex-col gap-6 lg:gap-10">
//         <div className="text-[#4F3B2E] text-heading-3 font-semibold mt-6 lg:mt-10">후기 관리</div>

//         {allReviews.length === 0 ? (
//           <EmptyReviewsState />
//         ) : (
//           <>
//             <div className="flex flex-col gap-7">
//               {allReviews.map((review, index) => (
//                 <div key={review.reviewId} className="flex flex-col">
//                   <ReviewListItem review={review} />
//                   {(isMdUp ? index !== allReviews.length - 1 : true) && <Separator className="mt-7" />}
//                 </div>
//               ))}
//             </div>

//             {/* 더보기 버튼 */}
//             {hasNextPage && (
//               <LoadMoreButton
//                 onClick={handleLoadMore}
//                 isLoading={isFetchingNextPage}
//                 wrapperClassName="pb-20 lg:pb-24"
//               />
//             )}
//           </>
//         )}
//       </div>
//     </Container>
//   );
// }
