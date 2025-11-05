import { useInfiniteQuery } from "@tanstack/react-query";
import {
  allApplicationMockData,
  catApplicationMockData,
  dogApplicationMockData,
} from "../_mocks/application-mock-data";

export interface ApplicationItem {
  breederId: string;
  breederName: string;
  breederLevel: "elite" | "new";
  applicationDate: string;
  profileImage: string;
  animalType: "cat" | "dog";
}

interface ApplicationsResponse {
  data: ApplicationItem[];
  hasMore: boolean;
}

const PAGE_SIZE = 10;

const fetchApplications = async (
  page: number,
  animalType?: "cat" | "dog"
): Promise<ApplicationsResponse> => {
  // TODO: API 연동 시 아래 주석 해제
  // const response = await api.get(`/applications`, {
  //   params: { page, limit: PAGE_SIZE, animalType },
  // });
  // return response.data;

  // 목 데이터
  const data =
    animalType === "cat"
      ? catApplicationMockData
      : animalType === "dog"
      ? dogApplicationMockData
      : allApplicationMockData;

  const startIndex = (page - 1) * PAGE_SIZE;
  const endIndex = startIndex + PAGE_SIZE;

  return {
    data: data.slice(startIndex, endIndex),
    hasMore: endIndex < data.length,
  };
};

export function useApplications(animalType?: "cat" | "dog") {
  return useInfiniteQuery({
    queryKey: ["applications", animalType],
    queryFn: ({ pageParam }) => fetchApplications(pageParam, animalType),
    getNextPageParam: (lastPage, allPages) =>
      lastPage.hasMore ? allPages.length + 1 : undefined,
    initialPageParam: 1,
  });
}
