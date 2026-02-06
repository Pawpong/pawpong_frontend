import React from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import FilterList from './filter-list';

const meta = {
  title: 'components/filter-sidebar/filter-list',
  component: FilterList,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
} satisfies Meta<typeof FilterList>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    children: React.createElement(React.Fragment, null,
      React.createElement('div', null, '☑ 랙돌'),
      React.createElement('div', null, '☐ 브리티쉬 숏헤어'),
      React.createElement('div', null, '☐ 러시안 블루')
    ),
  },
};
