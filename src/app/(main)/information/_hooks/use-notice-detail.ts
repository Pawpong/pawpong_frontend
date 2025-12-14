import { useQuery } from '@tanstack/react-query';
import apiClient from '@/lib/api';
import { NoticeItem } from './use-notices';

const fetchNoticeDetail = async (noticeId: string | number): Promise<NoticeItem> => {
  console.log('[공지사항 상세] 요청:', noticeId);

  const response = await apiClient.get<{
    announcementId: string;
    title: string;
    content: string;
    createdAt: string;
  }>(`/api/announcement/${noticeId}`);

  console.log('[공지사항 상세] 응답:', response.data);

  const { announcementId, title, content, createdAt } = response.data;

  const mapped = {
    id: announcementId,
    title,
    date: createdAt,
    content,
  };

  console.log('[공지사항 상세] 매핑된 데이터:', mapped);

  return mapped;
};

export function useNoticeDetail(noticeId?: string | number) {
  return useQuery({
    queryKey: ['notice', noticeId],
    queryFn: () => fetchNoticeDetail(noticeId as string | number),
    enabled: !!noticeId,
  });
}
