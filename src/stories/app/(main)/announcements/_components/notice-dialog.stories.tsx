import React from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import NoticeDialog from './notice-dialog';

const meta = {
  title: 'app/main/announcements/components/notice-dialog',
  component: NoticeDialog,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
} satisfies Meta<typeof NoticeDialog>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    notice: {
      id: '1',
      title: '포퐁 서비스 업데이트 안내',
      date: '2025-01-15',
      content: '안녕하세요, 포퐁입니다.\n\n서비스가 업데이트되었습니다.\n\n감사합니다.',
    },
    children: React.createElement(
      'button',
      { style: { padding: '8px 16px', border: '1px solid #ddd', borderRadius: 8 } },
      '공지사항 열기',
    ),
  },
};
