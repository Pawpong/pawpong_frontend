import React from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import { Toggle } from './toggle';

const meta = {
  title: 'UI/Toggle',
  component: Toggle,
  parameters: { layout: 'centered' },
  tags: ['autodocs'],
  argTypes: {
    variant: { control: 'select', options: ['default', 'outline'] },
    size: { control: 'select', options: ['default', 'sm', 'lg'] },
  },
} satisfies Meta<typeof Toggle>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: { children: '토글' },
};

export const Outline: Story = {
  args: { children: '아웃라인', variant: 'outline' },
};

export const Small: Story = {
  args: { children: 'S', size: 'sm' },
};

export const Large: Story = {
  args: { children: 'Large', size: 'lg' },
};
