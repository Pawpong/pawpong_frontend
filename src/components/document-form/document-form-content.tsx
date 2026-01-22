'use client';

import SignupFormItems from '@/components/signup-form-section/signup-form-items';
import { type Animal, type Level } from './document-constants';
import DocumentUploadFields from './document-upload-fields';
import OathCheckbox from './oath-checkbox';

interface DocumentState {
  file: File | null;
  fileName: string | null;
  url: string | null;
  isUploaded: boolean;
}

interface DocumentFormContentProps {
  level: Level;
  animal: Animal;
  documents: Record<string, File | null>;
  documentStates?: Record<string, DocumentState>;
  existingFileNames?: Record<string, string>;
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
  documentStates,
  existingFileNames,
  oathChecked,
  onLevelChange,
  onFileUpload,
  onFileDelete,
  onOathCheckedChange,
}: DocumentFormContentProps) {
  return (
    <SignupFormItems className="gap-8">
      <div className="flex flex-col gap-8 w-full">
        <DocumentUploadFields
          level={level}
          animal={animal}
          documents={documents}
          documentStates={documentStates}
          existingFileNames={existingFileNames}
          onFileUpload={onFileUpload}
          onFileDelete={onFileDelete}
        />
        <OathCheckbox level={level} checked={oathChecked} onCheckedChange={onOathCheckedChange} />
      </div>
    </SignupFormItems>
  );
}
