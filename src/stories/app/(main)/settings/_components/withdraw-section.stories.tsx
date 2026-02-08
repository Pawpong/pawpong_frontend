import React from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import WithdrawSection from './withdraw-section';

const meta = {
  title: 'app/main/settings/components/withdraw-section',
  component: WithdrawSection,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
} satisfies Meta<typeof WithdrawSection>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    onWithdraw: () => console.log('Withdraw clicked'),
  },
};
