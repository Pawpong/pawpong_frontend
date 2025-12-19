import { useInfiniteQuery } from '@tanstack/react-query';
import { getNoticeList, type Notice } from '@/lib/notice';

export interface NoticeItem {
  id: string;
  title: string;
  date: string;
  content: string;
}

interface NoticesResponse {
  data: NoticeItem[];
  hasMore: boolean;
}

const PAGE_SIZE = 10;

/**
 * 백엔드 Notice DTO를 프론트엔드 NoticeItem으로 변환
 */
const mapDtoToNoticeItem = (dto: Notice): NoticeItem => {
  return {
    id: dto.noticeId,
    title: dto.title,
    date: new Date(dto.createdAt).toISOString().split('T')[0],
    content: dto.content,
  };
};

/**
 * 공지사항 목록 조회 (실제 API 연결)
 */
const fetchNotices = async (page: number): Promise<NoticesResponse> => {
  try {
    const result = await getNoticeList(page, PAGE_SIZE);

    return {
      data: result.data.items.map(mapDtoToNoticeItem),
      hasMore: result.data.pagination.hasNextPage,
    };
  } catch (error) {
    console.error('공지사항 목록 조회 실패:', error);
    return {
      data: [],
      hasMore: false,
    };
  }
};

export function useNotices() {
  return useInfiniteQuery({
    queryKey: ['notices'],
    queryFn: ({ pageParam }) => fetchNotices(pageParam),
    getNextPageParam: (lastPage, allPages) => (lastPage.hasMore ? allPages.length + 1 : undefined),
    initialPageParam: 1,
  });
}
