import api from "./api";

/**
 * GET 요청
 * @param url - 요청 경로
 * @param params - 쿼리 파라미터
 */
export async function get<TResponse = unknown>(
  url: string,
  params?: Record<string, unknown>
): Promise<TResponse> {
  const res = await api.get<TResponse>(url, { params });
  return res.data;
}

/**
 * POST 요청
 * @param url - 요청 경로
 * @param body - 요청 바디
 */
export async function post<TResponse = unknown, TBody = unknown>(
  url: string,
  body?: TBody
): Promise<TResponse> {
  const res = await api.post<TResponse>(url, body);
  return res.data;
}

/**
 * PUT 요청
 */
export async function put<TResponse = unknown, TBody = unknown>(
  url: string,
  body?: TBody
): Promise<TResponse> {
  const res = await api.put<TResponse>(url, body);
  return res.data;
}

/**
 * DELETE 요청
 */
export async function del<TResponse = unknown>(
  url: string
): Promise<TResponse> {
  const res = await api.delete<TResponse>(url);
  return res.data;
}
