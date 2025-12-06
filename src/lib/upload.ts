import apiClient from './api';

/** API 응답 타입 */
interface ApiResponse<T> {
  success: boolean;
  data?: T;
  message?: string;
}

/** 업로드 응답 */
export interface UploadResponse {
  cdnUrl: string;
  fileName: string;
  fileSize: number;
}

/**
 * 대표 사진 업로드 (최대 3장)
 * POST /api/upload/representative-photos
 */
export const uploadRepresentativePhotos = async (files: File[]): Promise<UploadResponse[]> => {
  try {
    const formData = new FormData();
    files.forEach((file) => {
      formData.append('files', file);
    });

    const response = await apiClient.post<ApiResponse<UploadResponse[]>>(
      '/api/upload/representative-photos',
      formData,
      {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      },
    );

    if (!response.data.success || !response.data.data) {
      throw new Error('Failed to upload representative photos');
    }

    return response.data.data;
  } catch (error: unknown) {
    if (error instanceof Error) {
      console.error('Representative photos upload error:', error.message);
      throw error;
    }
    throw new Error('Unknown error during representative photos upload');
  }
};

/**
 * 부모견/묘 사진 업로드
 * POST /api/upload/parent-pet-photos/:petId
 */
export const uploadParentPetPhoto = async (petId: string, file: File): Promise<UploadResponse> => {
  try {
    const formData = new FormData();
    formData.append('file', file);

    const response = await apiClient.post<ApiResponse<UploadResponse>>(
      `/api/upload/parent-pet-photos/${petId}`,
      formData,
      {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      },
    );

    if (!response.data.success || !response.data.data) {
      throw new Error('Failed to upload parent pet photo');
    }

    return response.data.data;
  } catch (error: unknown) {
    if (error instanceof Error) {
      console.error('Parent pet photo upload error:', error.message);
      throw error;
    }
    throw new Error('Unknown error during parent pet photo upload');
  }
};

/**
 * 분양 개체 사진 업로드
 * POST /api/upload/available-pet-photos/:petId
 */
export const uploadAvailablePetPhoto = async (petId: string, file: File): Promise<UploadResponse> => {
  try {
    const formData = new FormData();
    formData.append('file', file);

    const response = await apiClient.post<ApiResponse<UploadResponse>>(
      `/api/upload/available-pet-photos/${petId}`,
      formData,
      {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      },
    );

    if (!response.data.success || !response.data.data) {
      throw new Error('Failed to upload available pet photo');
    }

    return response.data.data;
  } catch (error: unknown) {
    if (error instanceof Error) {
      console.error('Available pet photo upload error:', error.message);
      throw error;
    }
    throw new Error('Unknown error during available pet photo upload');
  }
};

/**
 * 단일 파일 업로드
 * POST /api/upload/single
 */
export const uploadSingleFile = async (file: File, folder?: string): Promise<UploadResponse> => {
  try {
    const formData = new FormData();
    formData.append('file', file);
    if (folder) {
      formData.append('folder', folder);
    }

    const response = await apiClient.post<ApiResponse<UploadResponse>>('/api/upload/single', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });

    if (!response.data.success || !response.data.data) {
      throw new Error('Failed to upload file');
    }

    return response.data.data;
  } catch (error: unknown) {
    if (error instanceof Error) {
      console.error('File upload error:', error.message);
      throw error;
    }
    throw new Error('Unknown error during file upload');
  }
};

/**
 * 다중 파일 업로드 (최대 10개)
 * POST /api/upload/multiple
 */
export const uploadMultipleFiles = async (files: File[], folder?: string): Promise<UploadResponse[]> => {
  try {
    const formData = new FormData();
    files.forEach((file) => {
      formData.append('files', file);
    });
    if (folder) {
      formData.append('folder', folder);
    }

    const response = await apiClient.post<ApiResponse<UploadResponse[]>>('/api/upload/multiple', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });

    if (!response.data.success || !response.data.data) {
      throw new Error('Failed to upload files');
    }

    return response.data.data;
  } catch (error: unknown) {
    if (error instanceof Error) {
      console.error('Multiple files upload error:', error.message);
      throw error;
    }
    throw new Error('Unknown error during multiple files upload');
  }
};

/**
 * 파일 삭제
 * DELETE /api/upload
 */
export const deleteFile = async (fileName: string): Promise<void> => {
  try {
    const response = await apiClient.delete<ApiResponse<null>>('/api/upload', {
      data: { fileName },
    });

    if (!response.data.success) {
      throw new Error('Failed to delete file');
    }
  } catch (error: unknown) {
    if (error instanceof Error) {
      console.error('File delete error:', error.message);
      throw error;
    }
    throw new Error('Unknown error during file deletion');
  }
};
