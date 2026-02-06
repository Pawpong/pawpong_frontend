import React from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import FilterListItem from './filter-list-item';

const meta = {
  title: 'components/filter-sidebar/filter-list-item',
  component: FilterListItem,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
} satisfies Meta<typeof FilterListItem>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    children: '랙돌',
    checked: true,
    onCheckedChange: () => {},
  },
};
