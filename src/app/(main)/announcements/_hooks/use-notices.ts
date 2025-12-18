import { useInfiniteQuery } from '@tanstack/react-query';
// import { getAnnouncements, type AnnouncementDto } from "@/lib/announcement";

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

// 목데이터 14개
const MOCK_NOTICES: NoticeItem[] = [
  {
    id: '1',
    title: '[공지] 포포 서비스 오픈 안내',
    date: '2025-01-15',
    content:
      '안녕하세요, 포포입니다.\n\n드디어 포포 서비스가 정식 오픈되었습니다! 많은 관심과 사랑 부탁드립니다.\n\n감사합니다.',
  },
  {
    id: '2',
    title: '[안내] 브리더 회원가입 절차 안내',
    date: '2025-01-14',
    content:
      '브리더 회원가입 시 필요한 서류와 절차에 대해 안내드립니다.\n\n1. 신분증 사본\n2. 동물생산업 등록증\n3. (엘리트) 브리더 인증 서류\n\n자세한 내용은 회원가입 페이지를 참고해주세요.',
  },
  {
    id: '3',
    title: '[업데이트] 새로운 기능 추가 안내',
    date: '2025-01-13',
    content:
      '새로운 기능이 추가되었습니다.\n\n- 브리더 프로필 수정 기능\n- 반려동물 등록 기능 개선\n- UI/UX 개선\n\n많은 이용 부탁드립니다.',
  },
  {
    id: '4',
    title: '[이벤트] 오픈 기념 이벤트 안내',
    date: '2025-01-12',
    content:
      '포포 오픈 기념 이벤트를 진행합니다!\n\n참여 방법: 회원가입 후 첫 입양 문의하기\n기간: 2025.01.12 ~ 2025.02.12\n\n많은 참여 부탁드립니다.',
  },
  {
    id: '5',
    title: '[공지] 개인정보처리방침 변경 안내',
    date: '2025-01-11',
    content:
      '개인정보처리방침이 일부 변경되었습니다.\n\n변경 사항:\n- 개인정보 보유 기간 명시\n- 제3자 제공 동의 항목 추가\n\n시행일: 2025.02.01',
  },
  {
    id: '6',
    title: '[안내] 고객센터 운영시간 안내',
    date: '2025-01-10',
    content:
      '고객센터 운영시간을 안내드립니다.\n\n운영시간: 평일 10:00 ~ 18:00\n점심시간: 12:00 ~ 13:00\n주말/공휴일: 휴무\n\n문의: help@pawpong.com',
  },
  {
    id: '7',
    title: '[점검] 서버 정기점검 안내',
    date: '2025-01-09',
    content:
      '서버 정기점검이 예정되어 있습니다.\n\n점검 일시: 2025.01.20 02:00 ~ 06:00\n점검 내용: 서버 안정화 및 보안 업데이트\n\n이용에 불편을 드려 죄송합니다.',
  },
  {
    id: '8',
    title: '[공지] 입양 계약서 양식 변경 안내',
    date: '2025-01-08',
    content:
      '입양 계약서 양식이 변경되었습니다.\n\n주요 변경 사항:\n- 건강 보증 조항 추가\n- 반환 정책 명시\n\n새 양식은 마이페이지에서 다운로드 가능합니다.',
  },
  {
    id: '9',
    title: '[안내] 브리더 레벨 시스템 안내',
    date: '2025-01-07',
    content:
      '브리더 레벨 시스템에 대해 안내드립니다.\n\n- 뉴 레벨: 기본 신뢰 레벨\n- 엘리트 레벨: 전문성 인증 레벨\n\n자세한 내용은 FAQ를 참고해주세요.',
  },
  {
    id: '10',
    title: '[업데이트] 앱 버전 1.1.0 출시',
    date: '2025-01-06',
    content:
      '앱 버전 1.1.0이 출시되었습니다.\n\n업데이트 내용:\n- 성능 개선\n- 버그 수정\n- 새로운 필터 기능 추가\n\n앱스토어에서 업데이트해주세요.',
  },
  {
    id: '11',
    title: '[공지] 설 연휴 배송 안내',
    date: '2025-01-05',
    content:
      '설 연휴 기간 배송 일정을 안내드립니다.\n\n배송 중단 기간: 2025.01.27 ~ 2025.01.30\n정상 배송 시작: 2025.01.31\n\n참고 부탁드립니다.',
  },
  {
    id: '12',
    title: '[이벤트] 후기 작성 이벤트',
    date: '2025-01-04',
    content:
      '입양 후기 작성 이벤트를 진행합니다!\n\n참여 방법: 입양 후기 작성\n혜택: 포포 적립금 5,000원 지급\n\n많은 참여 부탁드립니다.',
  },
  {
    id: '13',
    title: '[안내] 분양 문의 방법 안내',
    date: '2025-01-03',
    content:
      "분양 문의 방법을 안내드립니다.\n\n1. 마음에 드는 반려동물 선택\n2. '문의하기' 버튼 클릭\n3. 브리더와 상담 진행\n\n궁금한 점은 고객센터로 문의해주세요.",
  },
  {
    id: '14',
    title: '[공지] 포포 이용약관 안내',
    date: '2025-01-02',
    content:
      '포포 이용약관을 안내드립니다.\n\n이용약관은 마이페이지 > 설정 > 이용약관에서 확인하실 수 있습니다.\n\n감사합니다.',
  },
];

/**
 * 백엔드 AnnouncementDto를 프론트엔드 NoticeItem으로 변환
 */
// const mapDtoToNoticeItem = (dto: AnnouncementDto): NoticeItem => {
//   return {
//     id: dto.announcementId,
//     title: dto.title,
//     date: new Date(dto.createdAt).toISOString().split('T')[0],
//     content: dto.content,
//   };
// };

// const fetchNotices = async (page: number): Promise<NoticesResponse> => {
//   try {
//     const result = await getAnnouncements(page, PAGE_SIZE);

//     return {
//       data: result.announcements.map(mapDtoToNoticeItem),
//       hasMore: result.pagination.hasNextPage,
//     };
//   } catch (error) {
//     console.error('공지사항 목록 조회 실패:', error);
//     return {
//       data: [],
//       hasMore: false,
//     };
//   }
// };

// 목데이터용 fetchNotices
const fetchNotices = async (page: number): Promise<NoticesResponse> => {
  const startIndex = (page - 1) * PAGE_SIZE;
  const endIndex = startIndex + PAGE_SIZE;
  const pageData = MOCK_NOTICES.slice(startIndex, endIndex);

  return {
    data: pageData,
    hasMore: endIndex < MOCK_NOTICES.length,
  };
};

export function useNotices() {
  return useInfiniteQuery({
    queryKey: ['notices'],
    queryFn: ({ pageParam }) => fetchNotices(pageParam),
    getNextPageParam: (lastPage, allPages) => (lastPage.hasMore ? allPages.length + 1 : undefined),
    initialPageParam: 1,
  });
}
