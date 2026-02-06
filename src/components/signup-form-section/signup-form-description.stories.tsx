import React from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import SignupFormDescription from './signup-form-description';

const meta = {
  title: 'components/signup-form-section/signup-form-description',
  component: SignupFormDescription,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
} satisfies Meta<typeof SignupFormDescription>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    children: '포포에서 안전한 반려동물 분양을 시작하세요',
  },
};
