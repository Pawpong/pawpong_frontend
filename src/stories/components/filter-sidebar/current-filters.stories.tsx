import React from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import CurrentFilters from './current-filters';

const meta = {
  title: 'components/filter-sidebar/current-filters',
  component: CurrentFilters,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
} satisfies Meta<typeof CurrentFilters>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    selectedLeaves: ['랙돌', '서울특별시', '입양 가능'],
    onRemove: () => {},
  },
};
