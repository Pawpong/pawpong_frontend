import React from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import ExploreButton from './explore-button';

const meta = {
  title: 'app/main/saved/components/explore-button',
  component: ExploreButton,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
} satisfies Meta<typeof ExploreButton>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
