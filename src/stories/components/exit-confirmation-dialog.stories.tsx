import React from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import ExitConfirmDialog from './exit-confirmation-dialog';

const meta = {
  title: 'components/exit-confirmation-dialog',
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
    hasData: true,
    open: true,
    onOpenChange: () => {},
    onConfirm: () => console.log('확인'),
    onCancel: () => console.log('취소'),
  },
};

export const Closed: Story = {
  args: {
    hasData: false,
    open: false,
    onOpenChange: () => {},
    children: <button className="px-4 py-2 bg-gray-200 rounded">뒤로가기</button>,
  },
};
