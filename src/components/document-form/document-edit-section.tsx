"use client";

import SignupFormItems from "@/components/signup-form-section/signup-form-items";
import SignupFormSection from "@/components/signup-form-section/signup-form-section";
import { Button } from "@/components/ui/button";
import DocumentFormContent from "@/components/document-form/document-form-content";
import { useState } from "react";
import type {
  Animal,
  Level,
} from "@/components/document-form/document-constants";

export default function DocumentEditSection() {
  const [level, setLevel] = useState<Level>("elite");
  const [documents, setDocuments] = useState<Record<string, File | null>>({});
  const [oathChecked, setOathChecked] = useState(false);
  const [animal] = useState<Animal>("cat"); // TODO: 실제 동물 타입 가져오기

  const handleFileUpload = (key: string) => (file: File) => {
    setDocuments((prev) => ({ ...prev, [key]: file }));
  };

  const handleFileDelete = (key: string) => () => {
    setDocuments((prev) => ({ ...prev, [key]: null }));
  };

  const handleSubmit = () => {
    // TODO: 서류 제출 로직 구현
    console.log("서류 제출", { level, documents, oathChecked });
  };

  return (
    <SignupFormSection className="gap-15  mt-[3.5rem] md:gap-20 lg:gap-20">
      <DocumentFormContent
        level={level}
        animal={animal}
        documents={documents}
        oathChecked={oathChecked}
        onLevelChange={setLevel}
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

