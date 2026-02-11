import React from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import EmptyReviewsState from './empty-reviews-state';

const meta = {
  title: 'app/main/profile/reviews/components/empty-reviews-state',
  component: EmptyReviewsState,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
} satisfies Meta<typeof EmptyReviewsState>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
