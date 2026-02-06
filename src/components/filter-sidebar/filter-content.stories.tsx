import React from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import FilterContent from './filter-content';
import { Collapsible } from '../ui/collapsible';

const meta = {
  title: 'components/filter-sidebar/filter-content',
  component: FilterContent,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
  decorators: [
    (Story) => (
      <Collapsible defaultOpen>
        <Story />
      </Collapsible>
    ),
  ],
} satisfies Meta<typeof FilterContent>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    children: <div className="p-4 bg-gray-100 rounded">필터 내용 영역</div>,
  },
};
