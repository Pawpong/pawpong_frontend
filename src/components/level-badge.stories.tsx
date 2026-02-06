import React from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import LevelBadge from './level-badge';

const meta = {
  title: 'components/level-badge',
  component: LevelBadge,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
} satisfies Meta<typeof LevelBadge>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Elite: Story = {
  args: {
    level: 'elite',
  },
};

export const New: Story = {
  args: {
    level: 'new',
  },
};
