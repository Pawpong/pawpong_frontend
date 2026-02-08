import React from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import BreederTags from './breeder-tags';

const meta = {
  title: 'components/breeder-list/breeder-tags',
  component: BreederTags,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
} satisfies Meta<typeof BreederTags>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    children: React.createElement(React.Fragment, null,
      React.createElement('span', { className: 'px-2 py-1 bg-gray-100 rounded text-xs' }, '건강검진완료'),
      React.createElement('span', { className: 'px-2 py-1 bg-gray-100 rounded text-xs' }, '예방접종'),
      React.createElement('span', { className: 'px-2 py-1 bg-gray-100 rounded text-xs' }, '혈통서')
    ),
  },
};
