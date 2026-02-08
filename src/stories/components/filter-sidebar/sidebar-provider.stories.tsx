import React from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import { SidebarProvider } from './sidebar-provider';

const meta = {
  title: 'components/filter-sidebar/sidebar-provider',
  component: SidebarProvider,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
} satisfies Meta<typeof SidebarProvider>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    children: React.createElement('div', { style: { padding: 16 } }, '사이드바 컨텐츠 영역'),
  },
};
