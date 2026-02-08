import React from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import SignupFormHeader from './signup-form-header';

const meta = {
  title: 'components/signup-form-section/signup-form-header',
  component: SignupFormHeader,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
} satisfies Meta<typeof SignupFormHeader>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    children: React.createElement(React.Fragment, null,
      React.createElement('div', { style: { fontSize: '24px', fontWeight: 'bold' } }, '회원가입'),
      React.createElement('div', { style: { color: '#666' } }, '포포에서 안전한 분양을 시작하세요')
    ),
  },
};
