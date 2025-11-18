import apiClient from "./api";

/** API 응답 */
interface ApiResponse<T> {
  success: boolean;
  data?: T;
  message?: string;
}

/** 신고 생성 요청 */
export interface ReportCreateRequest {
  type: "breeder" | "adopter" | "content";
  breederId: string;
  reason:
    | "no_contract"
    | "false_info"
    | "inappropriate_content"
    | "poor_conditions"
    | "fraud"
    | "other";
  description: string;
  evidence?: string[];
  contactInfo?: string;
}

/** 후기 신고 요청 */
export interface ReviewReportRequest {
  reviewId: string;
  reason: string;
  description: string;
}

/**
 * 브리더 신고
 * POST /api/adopter/report
 */
export const createReport = async (
  requestData: ReportCreateRequest
): Promise<{ reportId: string; message: string }> => {
  try {
    const response = await apiClient.post<
      ApiResponse<{ reportId: string; message: string }>
    >("/api/adopter/report", requestData);

    if (!response.data.success || !response.data.data) {
      throw new Error(response.data.message || "Failed to create report");
    }

    return response.data.data;
  } catch (error: unknown) {
    if (error instanceof Error) {
      console.error("Create report error:", error.message);
      throw error;
    }
    throw new Error("Unknown error during report creation");
  }
};

/**
 * 후기 신고
 * POST /api/adopter/report/review
 */
export const reportReview = async (
  requestData: ReviewReportRequest
): Promise<{ reportId: string; message: string }> => {
  try {
    const response = await apiClient.post<
      ApiResponse<{ reportId: string; message: string }>
    >("/api/adopter/report/review", requestData);

    if (!response.data.success || !response.data.data) {
      throw new Error(response.data.message || "Failed to report review");
    }

    return response.data.data;
  } catch (error: unknown) {
    if (error instanceof Error) {
      console.error("Report review error:", error.message);
      throw error;
    }
    throw new Error("Unknown error during review report");
  }
};
