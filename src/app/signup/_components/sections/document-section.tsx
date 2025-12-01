"use client";

import SignupFormDescription from "@/components/signup-form-section/signup-form-description";
import SignupFormHeader from "@/components/signup-form-section/signup-form-header";
import SignupFormItems from "@/components/signup-form-section/signup-form-items";
import SignupFormSection from "@/components/signup-form-section/signup-form-section";
import SignupFormTitle from "@/components/signup-form-section/signup-form-title";
import UndoButton from "@/components/signup-form-section/undo-button";
import { Button } from "@/components/ui/button";
import DocumentFormContent from "@/components/document-form/document-form-content";
import useSignupFormStore from "@/stores/signup-form-store";
import { useState } from "react";
import DocumentSkipDialogTrigger from "../document-skip-dialog-trigger";
import type { Level } from "@/components/document-form/document-constants";

export default function DocumentSection() {
  const level = useSignupFormStore((e) => e.level);
  const setLevel = useSignupFormStore((e) => e.setLevel);
  const animal = useSignupFormStore((e) => e.animal);
  const documents = useSignupFormStore((e) => e.documents);
  const setDocuments = useSignupFormStore((e) => e.setDocuments);
  const [oathChecked, setOathChecked] = useState(false);

  const handleFileUpload = (key: string) => (file: File) => {
    setDocuments(key, file);
  };

  const handleFileDelete = (key: string) => () => {
    setDocuments(key, null);
  };

  return (
    <SignupFormSection className="gap-15 md:gap-20 lg:gap-20">
      <SignupFormHeader>
        <SignupFormTitle>브리더 입점 서류를 등록해 주세요</SignupFormTitle>
        <SignupFormDescription>
          브리더 활동 경험에 따라 적합한 레벨을 선택해 <br />
          서류를 업로드해주세요.
        </SignupFormDescription>
      </SignupFormHeader>
      <DocumentFormContent
        level={level as Level}
        animal={animal ?? "cat"}
        documents={documents}
        oathChecked={oathChecked}
        onLevelChange={(newLevel) => setLevel(newLevel as "elite" | "new")}
        onFileUpload={handleFileUpload}
        onFileDelete={handleFileDelete}
        onOathCheckedChange={setOathChecked}
      />
      <SignupFormItems className="gap-4">
        <div className="flex gap-3">
          <DocumentSkipDialogTrigger asChild>
            <Button
              className="bg-tertiary-700 text-grayscale-gray6! py-3 px-4 hover:bg-tertiary-800 hover:text-grayscale-gray6!"
              variant="tertiary"
            >
              나중에 할래요
            </Button>
          </DocumentSkipDialogTrigger>

          <Button variant={"tertiary"} className="py-3 px-4 w-full flex-1">
            제출
          </Button>
        </div>
        <UndoButton />
      </SignupFormItems>
    </SignupFormSection>
  );
}
