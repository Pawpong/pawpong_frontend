import React from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import ReviewTabs from './review-tabs';

const meta = {
  title: 'app/main/application/components/review-tabs',
  component: ReviewTabs,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
} satisfies Meta<typeof ReviewTabs>;

export default meta;
type Story = StoryObj<typeof meta>;

export const 상담후기: Story = {
  args: {
    activeTab: '상담 후기',
    onChange: (tab) => console.log('Tab changed:', tab),
  },
};

export const 입양후기: Story = {
  args: {
    activeTab: '입양 후기',
    onChange: (tab) => console.log('Tab changed:', tab),
  },
};
