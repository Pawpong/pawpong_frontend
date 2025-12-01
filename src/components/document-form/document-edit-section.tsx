"use client";

import SignupFormItems from "@/components/signup-form-section/signup-form-items";
import SignupFormSection from "@/components/signup-form-section/signup-form-section";
import { Button } from "@/components/ui/button";
import DocumentFormContent from "@/components/document-form/document-form-content";
import useSignupFormStore from "@/stores/signup-form-store";
import { useState } from "react";
import type {
  Animal,
  Level,
} from "@/components/document-form/document-constants";

export default function DocumentEditSection() {
  const level = useSignupFormStore((e) => e.level);
  const setLevel = useSignupFormStore((e) => e.setLevel);
  const documents = useSignupFormStore((e) => e.documents);
  const setDocuments = useSignupFormStore((e) => e.setDocuments);
  const oathChecked = useSignupFormStore((e) => e.oathChecked);
  const setOathChecked = useSignupFormStore((e) => e.setOathChecked);
  const [animal] = useState<Animal>("cat"); // TODO: 실제 동물 타입 가져오기

  const handleFileUpload = (key: string) => (file: File) => {
    setDocuments(key, file);
  };

  const handleFileDelete = (key: string) => () => {
    setDocuments(key, null);
  };

  const handleSubmit = () => {
    // TODO: 서류 제출 로직 구현
    console.log("서류 제출", { level, documents, oathChecked });
  };

  return (
    <SignupFormSection className="gap-15  mt-[3.5rem] md:gap-20 lg:gap-20">
      <DocumentFormContent
        level={level as Level}
        animal={animal}
        documents={documents}
        oathChecked={oathChecked}
        onLevelChange={(newLevel) => setLevel(newLevel as "elite" | "new")}
        onFileUpload={handleFileUpload}
        onFileDelete={handleFileDelete}
        onOathCheckedChange={setOathChecked}
      />
      <SignupFormItems className="gap-4">
        <Button
          variant="tertiary"
          className="py-3 px-4 w-full"
          onClick={handleSubmit}
          disabled={!oathChecked}
        >
          제출
        </Button>
      </SignupFormItems>
    </SignupFormSection>
  );
}
