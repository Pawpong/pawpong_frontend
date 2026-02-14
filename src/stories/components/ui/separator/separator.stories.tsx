import React from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import { Separator } from './separator';

const meta = {
  title: 'UI/Separator',
  component: Separator,
  parameters: { layout: 'centered' },
  tags: ['autodocs'],
} satisfies Meta<typeof Separator>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Horizontal: Story = {
  decorators: [
    (Story) => (
      <div style={{ width: 300 }}>
        <Story />
      </div>
    ),
  ],
  args: { orientation: 'horizontal' },
};

export const Vertical: Story = {
  decorators: [
    (Story) => (
      <div style={{ height: 100, display: 'flex' }}>
        <Story />
      </div>
    ),
  ],
  args: { orientation: 'vertical' },
};

export const InContext: Story = {
  render: () => (
    <div className="w-[300px] space-y-3">
      <p className="text-sm">위쪽 내용</p>
      <Separator />
      <p className="text-sm">아래쪽 내용</p>
    </div>
  ),
};
