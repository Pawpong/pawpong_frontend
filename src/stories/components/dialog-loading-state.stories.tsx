import React from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import { DialogLoadingState } from './dialog-loading-state';

const meta = {
  title: 'components/dialog-loading-state',
  component: DialogLoadingState,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
} satisfies Meta<typeof DialogLoadingState>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    open: true,
    onOpenChange: () => {},
    onConfirm: () => {},
    title: "확인 다이얼로그",
    description: "정말 진행하시겠습니까?",
  },
};
