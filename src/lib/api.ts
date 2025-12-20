import axios, { AxiosError, AxiosInstance, InternalAxiosRequestConfig } from 'axios';

// trailing slash 제거하여 이중 슬래시 방지
const BASE = process.env.NEXT_PUBLIC_API_BASE_URL?.replace(/\/+$/, '') || 'https://dev-api.pawpong.kr';

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
  // cross-origin 요청 시 쿠키가 자동 전송되지 않으므로 Authorization 헤더로 토큰 전송
  instance.interceptors.request.use((config) => {
    // skipAuth 플래그가 있으면 인증 헤더를 추가하지 않음 (공개 API용)
    if ((config as any).skipAuth) {
      return config;
    }

    // 브라우저 환경에서만 쿠키 읽기
    if (typeof window !== 'undefined') {
      // 쿠키에서 accessToken 읽기
      const cookies = document.cookie.split(';').reduce(
        (acc, cookie) => {
          const [key, value] = cookie.trim().split('=');
          acc[key] = value;
          return acc;
        },
        {} as Record<string, string>,
      );

      const accessToken = cookies['accessToken'];
      if (accessToken && !config.headers['Authorization']) {
        config.headers['Authorization'] = `Bearer ${accessToken}`;
      }
    }
    return config;
  });

  // 응답 인터셉터 (공통 에러 처리 / 리프레시 토큰 로직 등)
  instance.interceptors.response.use(
    (res) => res,
    async (error: AxiosError) => {
      const originalRequest = error.config as InternalAxiosRequestConfig & { _retry?: boolean };

      // 탈퇴한 계정 에러는 특별 처리 (자동 리다이렉트 안 함)
      const errorMessage =
        (error.response?.data && typeof error.response.data === 'object'
          ? (error.response.data as { message?: string; error?: string }).message ||
            (error.response.data as { message?: string; error?: string }).error
          : undefined) || '';

      if (errorMessage.includes('탈퇴')) {
        console.log('[API Interceptor] 탈퇴 계정 에러 감지 - 자동 리다이렉트 안 함');
        return Promise.reject(new Error(errorMessage));
      }

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
          // 프론트엔드 API 라우트를 통해 리프레시 (cross-origin에서 httpOnly 쿠키 전송 불가)
          const refreshResponse = await fetch('/api/auth/refresh', {
            method: 'POST',
            credentials: 'include',
          });

          const refreshData = (await refreshResponse.json()) as {
            success: boolean;
            data?: { accessToken: string; refreshToken: string };
          };

          if (!refreshResponse.ok || !refreshData.success) {
            throw new Error('토큰 갱신 실패');
          }

          // 백엔드에서 새로운 토큰을 받으면 프론트엔드 쿠키에 저장
          if (refreshData.data?.accessToken && refreshData.data?.refreshToken) {
            await fetch('/api/auth/set-cookie', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({
                accessToken: refreshData.data.accessToken,
                refreshToken: refreshData.data.refreshToken,
              }),
            });
          }

          processQueue(null);

          // 원래 요청 재시도
          return instance(originalRequest);
        } catch (refreshError) {
          processQueue(refreshError as Error);

          // 리프레시 실패 시 인증 상태 초기화 및 로그인 페이지로 리다이렉트
          if (typeof window !== 'undefined') {
            // 쿠키 삭제 시도
            fetch('/api/auth/clear-cookie', { method: 'POST' }).catch(() => {});

            // 로컬 스토리지 초기화 (auth-storage)
            try {
              localStorage.removeItem('auth-storage');
            } catch (e) {
              console.error('Failed to clear auth storage:', e);
            }

            // 로그인 페이지가 아니면 리다이렉트
            if (!window.location.pathname.startsWith('/login')) {
              window.location.href = '/login';
            }
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
