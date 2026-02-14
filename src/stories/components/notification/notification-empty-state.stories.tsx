import React from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import NotificationEmptyState from './notification-empty-state';

const meta = {
  title: 'components/notification/notification-empty-state',
  component: NotificationEmptyState,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
} satisfies Meta<typeof NotificationEmptyState>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
