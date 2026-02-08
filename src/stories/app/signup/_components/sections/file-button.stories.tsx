import React from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import FileButton from './file-button';

const meta = {
  title: 'app/signup/components/sections/file-button',
  component: FileButton,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
} satisfies Meta<typeof FileButton>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    children: '파일 업로드',
    onUpload: (file: File) => console.log('Uploaded:', file.name),
    onDelete: () => console.log('Deleted'),
    maxSizeMB: 10,
  },
};

export const WithExistingFile: Story = {
  args: {
    children: '파일 업로드',
    existingFileName: '신분증사본.pdf',
    onDelete: () => console.log('Deleted'),
    maxSizeMB: 10,
  },
};

export const WithError: Story = {
  args: {
    children: '파일 업로드',
    onDelete: () => console.log('Deleted'),
    maxSizeMB: 1,
    errorMessage: '파일은 최대 1MB까지 업로드할 수 있어요',
  },
};
