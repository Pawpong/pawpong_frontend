import React from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import ImageEdit from './image-edit';

const meta = {
  title: 'components/image-edit',
  component: ImageEdit,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
} satisfies Meta<typeof ImageEdit>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    maxCount: 3,
    onFileChange: (files) => console.log('파일 변경:', files),
    showPreview: true,
    labelText: '사진 업로드',
  },
};

export const SingleImage: Story = {
  args: {
    maxCount: 1,
    onFileChange: (files) => console.log('파일 변경:', files),
    showPreview: true,
    labelText: '프로필 사진',
  },
};
