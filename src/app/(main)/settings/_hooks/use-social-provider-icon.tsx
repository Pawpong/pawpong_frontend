import { ReactNode } from "react";
import { normalizeSocialProvider } from "./social-provider";
import { renderSocialProviderIcon } from "./social-provider-icon";

/* =========================
   Hook: 소셜 프로바이더 아이콘
   - 백엔드에서 받은 provider 값을 자동 정규화하여 아이콘 렌더링
========================= */
export function useSocialProviderIcon(
  provider: string | null | undefined
): ReactNode {
  const normalized = normalizeSocialProvider(provider);
  if (!normalized) {
    return null;
  }
  return renderSocialProviderIcon(normalized);
}
