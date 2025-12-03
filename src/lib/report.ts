import apiClient from "./api";

interface ApiResponse<T> {
  success: boolean;
  data?: T;
  message?: string;
}

export interface ReportReviewPayload {
  reviewId: string;
  reason: string;
  description?: string;
}

export interface ReportBreederPayload {
  breederId: string;
  reason: string;
  description?: string;
  evidence?: string[];
  contactInfo?: string;
}

export const reportReview = async (payload: ReportReviewPayload) => {
  try {
    const response = await apiClient.post<ApiResponse<null>>(
      "/api/adopter/report/review",
      payload
    );

    if (!response.data.success) {
      throw new Error(response.data.message ?? "신고 처리에 실패했습니다.");
    }
  } catch (error: unknown) {
    if (error instanceof Error) {
      console.error("Report review error:", error.message);
      throw error;
    }
    throw new Error("Unknown error during review report.");
  }
};

export const reportBreeder = async (payload: ReportBreederPayload) => {
  try {
    const body = {
      type: "breeder",
      breederId: payload.breederId,
      reason: payload.reason,
      description: payload.description,
      evidence: payload.evidence,
      contactInfo: payload.contactInfo,
    };

    const response = await apiClient.post<ApiResponse<null>>(
      "/api/adopter/report",
      body
    );

    if (!response.data.success) {
      throw new Error(response.data.message ?? "브리더 신고에 실패했습니다.");
    }
  } catch (error: unknown) {
    if (error instanceof Error) {
      console.error("Report breeder error:", error.message);
      throw error;
    }
    throw new Error("Unknown error during breeder report.");
  }
};
