import React from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import ReviewFooter from './review-footer';

const meta = {
  title: 'app/main/application/components/review-footer',
  component: ReviewFooter,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
} satisfies Meta<typeof ReviewFooter>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    onSubmit: () => console.log('Submit clicked'),
    disabled: false,
  },
};

export const Disabled: Story = {
  args: {
    onSubmit: () => console.log('Submit clicked'),
    disabled: true,
  },
};
