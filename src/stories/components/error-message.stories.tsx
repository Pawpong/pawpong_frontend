import React from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import ErrorMessage from './error-message';

const meta = {
  title: 'components/error-message',
  component: ErrorMessage,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
} satisfies Meta<typeof ErrorMessage>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    message: '샘플 메시지',
  },
};
