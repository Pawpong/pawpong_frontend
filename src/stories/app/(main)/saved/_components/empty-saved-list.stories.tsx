import React from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import EmptySavedList from './empty-saved-list';

const meta = {
  title: 'app/main/saved/components/empty-saved-list',
  component: EmptySavedList,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
} satisfies Meta<typeof EmptySavedList>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
