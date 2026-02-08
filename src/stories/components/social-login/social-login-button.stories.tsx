import React from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import SocialLoginButton from './social-login-button';

const meta = {
  title: 'components/social-login/social-login-button',
  component: SocialLoginButton,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
} satisfies Meta<typeof SocialLoginButton>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    children: React.createElement(React.Fragment, null,
      React.createElement('div', { className: 'size-4' }),
      '카카오로 시작하기'
    ),
    className: 'bg-[#FEE500] text-black hover:bg-[#FEE500]/80',
  },
};
