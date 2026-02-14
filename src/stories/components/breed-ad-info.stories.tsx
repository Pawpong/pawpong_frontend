import React from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import BreedAdInfo from './breed-ad-info';

const meta = {
  title: 'components/breed-ad-info',
  component: BreedAdInfo,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
} satisfies Meta<typeof BreedAdInfo>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    breed: '골든 리트리버',
  },
};
