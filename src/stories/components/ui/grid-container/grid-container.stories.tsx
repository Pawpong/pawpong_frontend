import React from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import GridContainer from './grid-container';

const meta = {
  title: 'UI/GridContainer',
  component: GridContainer,
  parameters: { layout: 'fullscreen' },
  tags: ['autodocs'],
} satisfies Meta<typeof GridContainer>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    children: (
      <>
        {Array.from({ length: 6 }, (_, i) => (
          <div key={i} className="bg-gray-100 rounded p-4 text-center text-sm">
            아이템 {i + 1}
          </div>
        ))}
      </>
    ),
  },
};
