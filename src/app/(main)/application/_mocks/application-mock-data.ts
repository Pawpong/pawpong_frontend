import { ApplicationItem } from "../_hooks/use-applications";

// 고양이 신청 내역 목 데이터
export const catApplicationMockData: ApplicationItem[] = Array.from(
  { length: 50 },
  (_, i) => ({
    breederId: `cat-${i + 1}`,
    breederName: `냥 ${i + 1}번째`,
    breederLevel: "elite" as const,
    applicationDate: `2024. 01. ${String(15 - i).padStart(2, "0")}.`,
    profileImage: "/avatar-sample.png",
    animalType: "cat" as const,
  })
);

// 강아지 신청 내역 목 데이터
export const dogApplicationMockData: ApplicationItem[] = Array.from(
  { length: 50 },
  (_, i) => ({
    breederId: `dog-${i + 1}`,
    breederName: `멍 ${i + 1}번째`,
    breederLevel: (i % 3 === 0 ? "new" : "elite") as "elite" | "new",
    applicationDate: `2024. 01. ${String(15 - i).padStart(2, "0")}.`,
    profileImage: "/avatar-sample.png",
    animalType: "dog" as const,
  })
);

export const allApplicationMockData: ApplicationItem[] = [
  ...catApplicationMockData,
  ...dogApplicationMockData,
].sort((a, b) => {
  const dateA = a.applicationDate.replace(/\./g, "").replace(/\s/g, "");
  const dateB = b.applicationDate.replace(/\./g, "").replace(/\s/g, "");
  return dateB.localeCompare(dateA);
});
