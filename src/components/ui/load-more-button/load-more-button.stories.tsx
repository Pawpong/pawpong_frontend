import React from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import LoadMoreButton from './load-more-button';

const meta = {
  title: 'UI/LoadMoreButton',
  component: LoadMoreButton,
  parameters: { layout: 'centered' },
  tags: ['autodocs'],
} satisfies Meta<typeof LoadMoreButton>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: { onClick: () => console.log('더보기 클릭') },
};

export const Loading: Story = {
  args: { onClick: () => console.log('더보기 클릭'), isLoading: true },
};

export const Disabled: Story = {
  args: { onClick: () => console.log('더보기 클릭'), disabled: true },
};

export const Custom: Story = {
  args: { onClick: () => console.log('더보기 클릭'), variant: 'custom' },
};
