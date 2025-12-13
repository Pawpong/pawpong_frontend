import axios, { AxiosError, AxiosInstance, InternalAxiosRequestConfig } from 'axios';

// trailing slash 제거하여 이중 슬래시 방지
const BASE = process.env.NEXT_PUBLIC_API_BASE_URL?.replace(/\/+$/, '') || '';

// 토큰 리프레시 상태 관리 (중복 요청 방지)
let isRefreshing = false;
let failedQueue: Array<{
  resolve: (value?: unknown) => void;
  reject: (reason?: unknown) => void;
}> = [];

const processQueue = (error: Error | null) => {
  failedQueue.forEach((prom) => {
    if (error) {
      prom.reject(error);
    } else {
      prom.resolve();
    }
  });
  failedQueue = [];
};

function createApi(): AxiosInstance {
  const instance = axios.create({
    baseURL: BASE,
    withCredentials: true, // 쿠키 필요하면 true
    headers: {
      'Content-Type': 'application/json',
      Accept: 'application/json',
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
      const originalRequest = error.config as InternalAxiosRequestConfig & { _retry?: boolean };

      // 401 처리 (토큰 만료 시 리프레시 시도)
      if (error.response?.status === 401 && !originalRequest._retry) {
        // 리프레시 엔드포인트 자체의 401은 바로 에러 처리
        if (originalRequest.url?.includes('/api/auth/refresh')) {
          return Promise.reject(new Error('세션이 만료되었습니다. 다시 로그인해주세요.'));
        }

        if (isRefreshing) {
          // 이미 리프레시 진행 중이면 큐에 추가하여 대기
          return new Promise((resolve, reject) => {
            failedQueue.push({ resolve, reject });
          })
            .then(() => {
              return instance(originalRequest);
            })
            .catch((err) => {
              return Promise.reject(err);
            });
        }

        originalRequest._retry = true;
        isRefreshing = true;

        try {
          // 쿠키 기반 리프레시 - 백엔드가 쿠키에서 refreshToken을 읽어 처리
          await instance.post('/api/auth/refresh');

          processQueue(null);

          // 원래 요청 재시도
          return instance(originalRequest);
        } catch (refreshError) {
          processQueue(refreshError as Error);

          // 리프레시 실패 시 로그인 페이지로 리다이렉트 (이미 로그인 페이지면 제외)
          if (typeof window !== 'undefined' && !window.location.pathname.startsWith('/login')) {
            window.location.href = '/login';
          }

          return Promise.reject(new Error('세션이 만료되었습니다. 다시 로그인해주세요.'));
        } finally {
          isRefreshing = false;
        }
      }

      // 에러 메시지 포맷 통일해서 던지기
      const message =
        (error.response?.data && typeof error.response.data === 'object'
          ? (error.response.data as { message?: string; error?: string }).error ||
            (error.response.data as { message?: string; error?: string }).message
          : undefined) ||
        error.message ||
        'Unknown error';
      return Promise.reject(new Error(message));
    },
  );

  return instance;
}

const api = createApi();
export default api;
