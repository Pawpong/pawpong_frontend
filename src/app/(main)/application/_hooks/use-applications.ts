import { useInfiniteQuery } from "@tanstack/react-query";
import { getMyApplications, type ApplicationListItemDto } from "@/lib/application";

export interface ApplicationItem {
  breederId: string;
  breederName: string;
  breederLevel: "elite" | "new";
  applicationDate: string;
  profileImage: string;
  animalType: "cat" | "dog";
  applicationId: string;
  petId?: string;
  petBreed?: string;
  status: "consultation_pending" | "consultation_completed" | "adoption_approved" | "adoption_rejected";
}

interface ApplicationsResponse {
  data: ApplicationItem[];
  hasMore: boolean;
}

const PAGE_SIZE = 10;

/**
 * 백엔드 DTO를 프론트엔드 ApplicationItem으로 변환
 */
const mapDtoToApplicationItem = (dto: ApplicationListItemDto): ApplicationItem => ({
  applicationId: dto.applicationId,
  breederId: dto.breederId,
  breederName: dto.breederName,
  breederLevel: dto.breederLevel,
  applicationDate: dto.applicationDate,
  profileImage: dto.profileImage || "/avatar-sample.png",
  animalType: dto.animalType,
  petId: dto.petId,
  petBreed: dto.petBreed,
  status: dto.status,
});

const fetchApplications = async (
  page: number,
  animalType?: "cat" | "dog"
): Promise<ApplicationsResponse> => {
  const result = await getMyApplications(page, PAGE_SIZE, animalType);

  return {
    data: result.applications.map(mapDtoToApplicationItem),
    hasMore: result.pagination.hasNextPage,
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
