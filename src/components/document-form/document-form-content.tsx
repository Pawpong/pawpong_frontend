"use client";

import SignupFormItems from "@/components/signup-form-section/signup-form-items";
import { LEVEL_INFO, type Animal, type Level } from "./document-constants";
import DocumentUploadFields from "./document-upload-fields";
import LevelTabs from "./level-tabs";
import OathCheckbox from "./oath-checkbox";

interface DocumentFormContentProps {
  level: Level;
  animal: Animal;
  documents: Record<string, File | null>;
  oathChecked: boolean;
  onLevelChange: (level: Level) => void;
  onFileUpload: (key: string) => (file: File) => void;
  onFileDelete: (key: string) => () => void;
  onOathCheckedChange: (checked: boolean) => void;
}

export default function DocumentFormContent({
  level,
  animal,
  documents,
  oathChecked,
  onLevelChange,
  onFileUpload,
  onFileDelete,
  onOathCheckedChange,
}: DocumentFormContentProps) {
  return (
    <SignupFormItems className="gap-8">
      <LevelTabs level={level} onLevelChange={onLevelChange} />
      <div className="text-primary-500/80 font-medium text-body-m text-balance text-center break-keep">
        {LEVEL_INFO.find((e) => e.name === level)?.description}
      </div>
      <div className="flex flex-col gap-8 w-full">
        <DocumentUploadFields
          level={level}
          animal={animal}
          documents={documents}
          onFileUpload={onFileUpload}
          onFileDelete={onFileDelete}
        />
        <OathCheckbox
          level={level}
          checked={oathChecked}
          onCheckedChange={onOathCheckedChange}
        />
      </div>
    </SignupFormItems>
  );
}
