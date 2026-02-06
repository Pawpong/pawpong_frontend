import React from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import SocialLoginSection from './social-login-section';

const meta = {
  title: 'app/main/settings/components/social-login-section',
  component: SocialLoginSection,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
} satisfies Meta<typeof SocialLoginSection>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Kakao: Story = {
  args: {
    email: 'user@kakao.com',
    provider: 'kakao',
  },
};

export const Google: Story = {
  args: {
    email: 'user@gmail.com',
    provider: 'google',
  },
};

export const Naver: Story = {
  args: {
    email: 'user@naver.com',
    provider: 'naver',
  },
};
