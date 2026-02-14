import React from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import ExitConfirmDialog from './exit-confirm-dialog';

const meta = {
  title: 'components/document-form/exit-confirm-dialog',
  component: ExitConfirmDialog,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
} satisfies Meta<typeof ExitConfirmDialog>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    open: true,
    onOpenChange: () => {},
    onConfirm: () => {},
    title: '확인 다이얼로그',
    description: '정말 진행하시겠습니까?',
  },
};
