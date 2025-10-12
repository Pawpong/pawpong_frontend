"use client"

import { useEffect } from "react"
import { useRouter, useSearchParams } from "next/navigation"

/**
 * 소셜 로그인 성공 페이지
 * OAuth 콜백에서 받은 토큰을 쿠키에 저장하고 홈으로 이동
 */
export default function LoginSuccessPage() {
  const router = useRouter()
  const searchParams = useSearchParams()

  useEffect(() => {
    const accessToken = searchParams.get("accessToken")
    const refreshToken = searchParams.get("refreshToken")

    if (!accessToken || !refreshToken) {
      console.error("토큰이 없습니다. 로그인 페이지로 이동합니다.")
      router.push("/login")
      return
    }

    try {
      // 액세스 토큰 저장 (1시간 만료) - camelCase
      document.cookie = `accessToken=${accessToken}; path=/; max-age=3600; SameSite=Lax`

      // 리프레시 토큰 저장 (7일 만료) - camelCase
      document.cookie = `refreshToken=${refreshToken}; path=/; max-age=604800; SameSite=Lax`

      console.log("로그인 성공! 쿠키에 토큰 저장 완료")
      console.log("저장된 쿠키:")
      console.log("- accessToken:", accessToken.substring(0, 50) + "...")
      console.log("- refreshToken:", refreshToken.substring(0, 50) + "...")

      // 쿠키 저장 확인
      const cookies = document.cookie
      console.log("현재 쿠키:", cookies)
      console.log("→ /explore 페이지로 이동합니다.")

      // 약간의 딜레이 후 리다이렉트 (쿠키 저장 보장)
      setTimeout(() => {
        router.replace("/explore")
      }, 300)
    } catch (error) {
      console.error(" 토큰 저장 중 오류 발생:", error)
      router.push("/login")
    }
  }, [searchParams, router])

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-50">
      <div className="text-center">
        <div className="mb-4 inline-block h-12 w-12 animate-spin rounded-full border-4 border-gray-300 border-t-blue-600"></div>
        <div className="mb-2 text-2xl font-bold text-gray-800">
          로그인 중...
        </div>
        <div className="text-gray-600">잠시만 기다려주세요.</div>
      </div>
    </div>
  )
}
