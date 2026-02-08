import React from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import AdoptionStatusBadge from './adoption-status-badge';

const meta = {
  title: 'components/adoption-status-badge',
  component: AdoptionStatusBadge,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
} satisfies Meta<typeof AdoptionStatusBadge>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Available: Story = {
  args: {
    status: 'available',
  },
};

export const Reserved: Story = {
  args: {
    status: 'reserved',
  },
};

export const Completed: Story = {
  args: {
    status: 'completed',
  },
};
