import React from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import { Switch } from './switch';
import { Label } from '../label/label';

const meta = {
  title: 'UI/Switch',
  component: Switch,
  parameters: { layout: 'centered' },
  tags: ['autodocs'],
} satisfies Meta<typeof Switch>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {},
};

export const Checked: Story = {
  args: { defaultChecked: true },
};

export const Disabled: Story = {
  args: { disabled: true },
};

export const WithLabel: Story = {
  render: () => (
    <div className="flex items-center gap-2">
      <Switch id="notification" />
      <Label htmlFor="notification">알림 받기</Label>
    </div>
  ),
};
