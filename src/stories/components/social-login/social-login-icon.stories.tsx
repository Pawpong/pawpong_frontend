import React from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import SocialLoginIcon from './social-login-icon';

const meta = {
  title: 'components/social-login/social-login-icon',
  component: SocialLoginIcon,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
} satisfies Meta<typeof SocialLoginIcon>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    children: React.createElement('div', { style: { width: 16, height: 16, background: '#FEE500', borderRadius: '50%' } }),
  },
};
