import React from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import FilterHeader from './filter-header';

const meta = {
  title: 'components/filter-sidebar/filter-header',
  component: FilterHeader,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
} satisfies Meta<typeof FilterHeader>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    children: React.createElement(React.Fragment, null,
      React.createElement('div', { style: { fontWeight: 'bold' } }, '품종'),
      React.createElement('button', { style: { fontSize: '12px', color: '#999' } }, '접기')
    ),
  },
};
