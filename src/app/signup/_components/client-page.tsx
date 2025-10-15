"use client";
import useSignupFormStore, { UserType } from "@/stores/signup-form-store";
import { useSearchParams } from "next/navigation";
import { useEffect } from "react";
import AnimalSection from "./sections/animal-section";
import BreederInfoSection from "./sections/breeder-info-section";
import DocumentSection from "./sections/document-section";
import NicknameSection from "./sections/nickname-section";
import PlanSection from "./sections/plan-section";
import SignupComplete from "./sections/signup-complete";
import UserInfoSection from "./sections/user-info-section";
import UserTypeSection from "./sections/user-type-section";
const flowInfo: Record<UserType, React.ComponentType[]> = {
  guest: [UserTypeSection, UserInfoSection, NicknameSection, SignupComplete],
  breeder: [
    UserTypeSection,
    AnimalSection,
    PlanSection,
    UserInfoSection,
    BreederInfoSection,
    DocumentSection,
    SignupComplete,
  ],
};
export default function ClientPage() {
  const searchParams = useSearchParams();
  const flowIndex = useSignupFormStore((e) => e.flowIndex);
  const userType = useSignupFormStore((e) => e.userType);
  const setTempId = useSignupFormStore((e) => e.setTempId);
  const setProvider = useSignupFormStore((e) => e.setProvider);
  const setSocialName = useSignupFormStore((e) => e.setSocialName);
  const setEmail = useSignupFormStore((e) => e.setEmail);
  const setProfileImage = useSignupFormStore((e) => e.setProfileImage);
  const resetFlowIndex = useSignupFormStore((e) => e.resetFlowIndex);

  // URL 파라미터에서 소셜 로그인 정보 읽어오기
  useEffect(() => {
    const tempId = searchParams.get("tempId");
    const provider = searchParams.get("provider");
    const email = searchParams.get("email");
    const name = searchParams.get("name");
    const profileImage = searchParams.get("profileImage");

    if (tempId) {
      setTempId(tempId);
      setProvider(provider || "");
      setEmail(email || "");
      setSocialName(name || "");
      setProfileImage(profileImage || "");
      // 소셜 로그인으로 들어온 경우 flowIndex 초기화
      resetFlowIndex();
    }
  }, [
    searchParams,
    setTempId,
    setProvider,
    setEmail,
    setSocialName,
    setProfileImage,
    resetFlowIndex,
  ]);

  const CurrentSection = flowInfo[userType ?? "guest"][flowIndex];
  return <CurrentSection />;
  // return <BreederInfoSection />; // TODO: 나중에 지우기
}
