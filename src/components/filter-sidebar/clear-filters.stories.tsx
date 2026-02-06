import React from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import ClearFilters from './clear-filters';

const meta = {
  title: 'components/filter-sidebar/clear-filters',
  component: ClearFilters,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
} satisfies Meta<typeof ClearFilters>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
};
