'use client';

import { useRouter } from 'next/navigation';
import Image from 'next/image';

/**
 * 회원가입 유형 선택 페이지
 *
 * 입양자 또는 브리더 중 회원 유형을 선택하는 페이지
 */
export default function RegisterPage() {
  const router = useRouter();

  const handleRoleSelect = (role: 'adopter' | 'breeder') => {
    // TODO: 역할 선택 후 해당 회원가입 페이지로 이동
    if (role === 'adopter') {
      router.push('/register/adopter');
    } else {
      router.push('/register/breeder');
    }
  };

  return (
    <div className="flex min-h-screen">
      {/* 왼쪽: 이미지 영역 */}
      <div className="relative w-1/2 hidden lg:block">
        <Image
          src="http://localhost:3845/assets/5ec081c13977e5571ab558a1799a3a05b48cf366.png"
          alt="반려동물 이미지"
          fill
          className="object-cover"
          priority
        />
      </div>

      {/* 오른쪽: 선택 카드 영역 */}
      <div className="flex-1 flex items-center justify-center p-8 bg-white">
        <div className="w-full max-w-md space-y-8">
          <div className="text-center">
            <h1 className="text-heading-3 font-semibold text-primary-500 mb-2">
              회원 유형을 선택해 주세요
            </h1>
          </div>

          <div className="space-y-4">
            {/* 입양자 카드 */}
            <button
              onClick={() => handleRoleSelect('adopter')}
              className="w-full group"
            >
              <div className="flex items-center gap-4 p-6 rounded-2xl bg-[#B4D4FF] hover:bg-[#9BCAFF] transition-colors cursor-pointer">
                <div className="flex-1 text-left">
                  <h2 className="text-body-l font-semibold text-primary-500 mb-1">입양자</h2>
                  <p className="text-body-xs text-grayscale-gray6">
                    새로운 반려동물을 기르고싶<br />
                    맞이하실 분을 모시겠습니다.
                  </p>
                </div>
                <div className="relative w-20 h-20 flex-shrink-0">
                  {/* 입양자 일러스트 아이콘 */}
                  <div className="w-full h-full bg-white/20 rounded-full" />
                </div>
              </div>
            </button>

            {/* 브리더 카드 */}
            <button
              onClick={() => handleRoleSelect('breeder')}
              className="w-full group"
            >
              <div className="flex items-center gap-4 p-6 rounded-2xl bg-[#FFF4E0] hover:bg-[#FFE8C5] transition-colors cursor-pointer">
                <div className="flex-1 text-left">
                  <h2 className="text-body-l font-semibold text-primary-500 mb-1">브리더</h2>
                  <p className="text-body-xs text-grayscale-gray6">
                    반려동물을 책임감 있게<br />
                    분양드릴 전문가입니다.
                  </p>
                </div>
                <div className="relative w-20 h-20 flex-shrink-0">
                  {/* 브리더 일러스트 아이콘 */}
                  <div className="w-full h-full bg-white/20 rounded-full" />
                </div>
              </div>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
