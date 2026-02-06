import React from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import RequestStatusBadge from './request-status-badge';

const meta = {
  title: 'app/main/receivedApplications/components/request-status-badge',
  component: RequestStatusBadge,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
} satisfies Meta<typeof RequestStatusBadge>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Before: Story = {
  args: {
    status: 'before',
  },
};

export const Done: Story = {
  args: {
    status: 'done',
  },
};
