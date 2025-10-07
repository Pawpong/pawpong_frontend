"use client";

import useSignupFormStore, { UserType } from "@/stores/signup-form-store";
import AnimalSection from "./_components/sections/animal-section";
import BreederInfoSection from "./_components/sections/breeder-info-section";
import DocumentSection from "./_components/sections/document-section";
import NicknameSection from "./_components/sections/nickname-section";
import PlanSection from "./_components/sections/plan-section";
import SignupComplete from "./_components/sections/signup-complete";
import UserInfoSection from "./_components/sections/user-info-section";
import UserTypeSection from "./_components/sections/user-type-section";

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

export default function Page() {
  const flowIndex = useSignupFormStore((e) => e.flowIndex);
  const userType = useSignupFormStore((e) => e.userType);
  const CurrentSection = flowInfo[userType ?? "guest"][flowIndex];
  return <CurrentSection />;
  // return <DocumentSection />; // TODO: 나중에 지우기
}
