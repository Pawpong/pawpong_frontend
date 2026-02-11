import React from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import FilterSection from './filter-section';

const meta = {
  title: 'components/filter-sidebar/filter-section',
  component: FilterSection,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
} satisfies Meta<typeof FilterSection>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    children: (
      <>
        <div className="font-semibold mb-2">필터 제목</div>
        <div className="space-y-1">
          <label className="flex items-center gap-2">
            <input type="checkbox" /> 옵션 1
          </label>
          <label className="flex items-center gap-2">
            <input type="checkbox" /> 옵션 2
          </label>
          <label className="flex items-center gap-2">
            <input type="checkbox" /> 옵션 3
          </label>
        </div>
      </>
    ),
  },
};
