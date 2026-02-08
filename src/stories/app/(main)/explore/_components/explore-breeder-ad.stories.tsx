import React from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import ExploreBreederAd from './explore-breeder-ad';

const meta = {
  title: 'app/main/explore/components/explore-breeder-ad',
  component: ExploreBreederAd,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
} satisfies Meta<typeof ExploreBreederAd>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
