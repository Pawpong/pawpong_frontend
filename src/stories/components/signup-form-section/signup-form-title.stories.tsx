import React from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import SignupFormTitle from './signup-form-title';

const meta = {
  title: 'components/signup-form-section/signup-form-title',
  component: SignupFormTitle,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
} satisfies Meta<typeof SignupFormTitle>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    children: '회원가입',
  },
};
