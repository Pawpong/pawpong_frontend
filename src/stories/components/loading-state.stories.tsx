import React from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import { LoadingState } from './loading-state';

const meta = {
  title: 'components/loading-state',
  component: LoadingState,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
} satisfies Meta<typeof LoadingState>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    message: '로딩 중...',
    size: 'md',
    fullScreen: false,
  },
};

export const Small: Story = {
  args: {
    message: '로딩 중...',
    size: 'sm',
    fullScreen: false,
  },
};

export const Large: Story = {
  args: {
    message: '데이터를 불러오는 중...',
    size: 'lg',
    fullScreen: false,
  },
};
