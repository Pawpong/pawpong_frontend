import React from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import NoticeListItem from './notice-list-item';

const meta = {
  title: 'app/main/announcements/components/notice-list-item',
  component: NoticeListItem,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
} satisfies Meta<typeof NoticeListItem>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    title: '포퐁 서비스 업데이트 안내',
    date: '2025-01-15',
  },
};
