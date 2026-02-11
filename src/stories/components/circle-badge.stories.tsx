import React from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import CircleBadge from './circle-badge';

const meta = {
  title: 'components/circle-badge',
  component: CircleBadge,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
} satisfies Meta<typeof CircleBadge>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
