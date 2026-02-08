import React from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import FilterTitle from './filter-title';

const meta = {
  title: 'components/filter-sidebar/filter-title',
  component: FilterTitle,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
} satisfies Meta<typeof FilterTitle>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    children: '품종',
  },
};
