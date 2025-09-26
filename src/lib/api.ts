import axios, { AxiosError, AxiosInstance } from "axios";

const BASE = process.env.NEXT_PUBLIC_API_BASE_URL;

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

  // 요청 인터셉터 (예: Authorization 헤더 자동 삽입)
  instance.interceptors.request.use((config) => {
    try {
      // 클라이언트 전용: localStorage에서 토큰 읽기 (서버에서 실행될 때는 건너뜀)
      if (typeof window !== "undefined") {
        const token = localStorage.getItem("access_token");
        if (token && config.headers)
          config.headers.Authorization = `Bearer ${token}`;
      }
    } catch (e) {
      /* silent */
    }
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
        (error.response?.data && (error.response.data as any).message) ||
        error.message ||
        "Unknown error";
      return Promise.reject(new Error(message));
    }
  );

  return instance;
}

const api = createApi();
export default api;
