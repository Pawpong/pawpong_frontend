import { redirect } from "next/navigation";

interface LoginSuccessPageProps {
  searchParams: Promise<{ accessToken?: string; refreshToken?: string }>;
}

export default async function LoginSuccessPage({
  searchParams,
}: LoginSuccessPageProps) {
  const { accessToken, refreshToken } = await searchParams;

  if (!accessToken || !refreshToken) {
    console.error("토큰이 없습니다. 로그인 페이지로 이동합니다.");
    redirect("/login");
  }

  console.log("로그인 성공:", { accessToken, refreshToken });

  // Route Handler 호출
  const res = await fetch(
    `${process.env.NEXT_PUBLIC_BASE_URL}/api/auth/set-cookie`,
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ accessToken, refreshToken }),
      // 서버 컴포넌트에서는 credentials: 'include' 필요 없음
      // cache: 'no-store'를 넣어 새 요청을 강제
      cache: "no-store",
    }
  );
  if (res.ok) {
    redirect("/explore");
  } else {
    redirect("/login");
  }
  // 성공하면 바로 리다이렉트

  return null; // 화면 렌더링 없이 리다이렉트
}
