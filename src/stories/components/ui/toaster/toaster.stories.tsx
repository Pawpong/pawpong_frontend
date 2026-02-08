import React from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import { Toaster } from './toaster';

const meta = {
  title: 'UI/Toaster',
  component: Toaster,
  parameters: { layout: 'fullscreen' },
  tags: ['autodocs'],
} satisfies Meta<typeof Toaster>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  render: () => (
    <div className="p-8">
      <p className="text-sm text-gray-500 mb-4">
        Toaster는 useToast 훅과 함께 사용됩니다. 실제 동작은 앱에서 확인하세요.
      </p>
      <Toaster />
    </div>
  ),
};
