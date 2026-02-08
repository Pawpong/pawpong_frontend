import React from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import NotificationItem from './notification-item';

const meta = {
  title: 'components/notification/notification-item',
  component: NotificationItem,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
} satisfies Meta<typeof NotificationItem>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    icon: <span style={{ fontSize: '20px' }}>🔔</span>,
    content: '새로운 상담 신청이 도착했습니다.',
    date: '2025-01-15',
    onClick: () => console.log('알림 클릭'),
  },
};

export const WithoutClick: Story = {
  args: {
    icon: <span style={{ fontSize: '20px' }}>📋</span>,
    content: '후기가 등록되었습니다.',
    date: '2025-01-14',
  },
};
