import React from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import { CollapsibleProvider } from './collapsible-provider';

const meta = {
  title: 'components/filter-sidebar/collapsible-provider',
  component: CollapsibleProvider,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
} satisfies Meta<typeof CollapsibleProvider>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    children: <div className="p-4 border rounded">CollapsibleProvider 안의 콘텐츠</div>,
  },
};
