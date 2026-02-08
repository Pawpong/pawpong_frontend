import React from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import DocumentUploadFields from './document-upload-fields';

const meta = {
  title: 'components/document-form/document-upload-fields',
  component: DocumentUploadFields,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
} satisfies Meta<typeof DocumentUploadFields>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    level: 'basic',
    animal: 'dog',
    documents: {},
    documentStates: {},
    existingFileNames: {},
    onFileUpload: (key: string) => (file: File) => console.log('File uploaded:', key, file.name),
    onFileDelete: (key: string) => () => console.log('File deleted:', key),
  },
};

export const WithExistingFiles: Story = {
  args: {
    level: 'professional',
    animal: 'cat',
    documents: {},
    documentStates: {},
    existingFileNames: {
      idCard: '신분증사본.pdf',
      businessLicense: '사업자등록증.pdf',
    },
    onFileUpload: (key: string) => (file: File) => console.log('File uploaded:', key, file.name),
    onFileDelete: (key: string) => () => console.log('File deleted:', key),
  },
};
