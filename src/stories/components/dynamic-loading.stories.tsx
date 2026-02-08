import React from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import { LoadingText } from './dynamic-loading';

const meta = {
  title: 'components/dynamic-loading',
  component: LoadingText,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
} satisfies Meta<typeof LoadingText>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
};
