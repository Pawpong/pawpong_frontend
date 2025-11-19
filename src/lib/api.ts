import axios, { AxiosError, AxiosInstance } from "axios";

// trailing slash 제거하여 이중 슬래시 방지
const BASE = process.env.NEXT_PUBLIC_API_BASE_URL?.replace(/\/+$/, "") || "";

function createApi(): AxiosInstance {
  const instance = axios.create({
    baseURL: BASE,
    withCredentials: true, // 쿠키 필요하면 true
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
    },
    timeout: 10000,
  });

  // 요청 인터셉터
  // HTTP-only 쿠키를 사용하므로 Authorization 헤더 설정 불필요
  // withCredentials: true로 브라우저가 자동으로 쿠키를 전송함
  instance.interceptors.request.use((config) => {
    // 필요한 경우 여기에 다른 요청 전처리 로직 추가
    return config;
  });

  // 응답 인터셉터 (공통 에러 처리 / 리프레시 토큰 로직 등)
  instance.interceptors.response.use(
    (res) => res,
    async (error: AxiosError) => {
      // 예시: 401 처리 (refresh token 흐름 등)
      if (error.response?.status === 401) {
        // TODO: 리프레시 처리 또는 로그아웃 로직
        // 예: await tryRefreshToken();
      }

      // 에러 메시지 포맷 통일해서 던지기
      const message =
        (error.response?.data &&
        typeof error.response.data === "object" &&
        "message" in error.response.data
          ? (error.response.data as { message?: string }).message
          : undefined) ||
        error.message ||
        "Unknown error";
      return Promise.reject(new Error(message));
    }
  );

  return instance;
}

const api = createApi();
export default api;
