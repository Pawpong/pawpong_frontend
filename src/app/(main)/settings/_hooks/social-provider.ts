export type SocialProvider = "kakao" | "google" | "naver";

const API_PROVIDER_MAP: Record<string, SocialProvider> = {
  kakao: "kakao",
  kakao_account: "kakao",
  google: "google",
  google_account: "google",
  naver: "naver",
  naver_account: "naver",
} as const;

export function normalizeSocialProvider(
  provider: string | null | undefined
): SocialProvider | null {
  if (!provider) {
    return null;
  }

  const normalized = provider.toLowerCase().trim();
  return API_PROVIDER_MAP[normalized] ?? null;
}
