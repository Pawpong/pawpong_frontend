import React from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import DocumentFormContent from './document-form-content';

const meta = {
  title: 'components/document-form/document-form-content',
  component: DocumentFormContent,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
} satisfies Meta<typeof DocumentFormContent>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    level: 'basic',
    animal: 'dog',
    documents: {},
    documentStates: {},
    existingFileNames: {},
    oathChecked: false,
    onLevelChange: (level) => console.log('Level changed:', level),
    onFileUpload: (key: string) => (file: File) => console.log('File uploaded:', key, file.name),
    onFileDelete: (key: string) => () => console.log('File deleted:', key),
    onOathCheckedChange: (checked: boolean) => console.log('Oath checked:', checked),
  },
};

export const WithOathChecked: Story = {
  args: {
    level: 'professional',
    animal: 'cat',
    documents: {},
    documentStates: {},
    existingFileNames: {},
    oathChecked: true,
    onLevelChange: (level) => console.log('Level changed:', level),
    onFileUpload: (key: string) => (file: File) => console.log('File uploaded:', key, file.name),
    onFileDelete: (key: string) => () => console.log('File deleted:', key),
    onOathCheckedChange: (checked: boolean) => console.log('Oath checked:', checked),
  },
};
