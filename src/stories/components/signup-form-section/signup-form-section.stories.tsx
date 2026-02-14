import React from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import SignupFormSection from './signup-form-section';

const meta = {
  title: 'components/signup-form-section/signup-form-section',
  component: SignupFormSection,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
} satisfies Meta<typeof SignupFormSection>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    children: React.createElement(
      React.Fragment,
      null,
      React.createElement('div', { style: { textAlign: 'center', fontSize: '24px', fontWeight: 'bold' } }, '회원가입'),
      React.createElement(
        'div',
        { style: { textAlign: 'center', color: '#666' } },
        '포포에서 안전한 분양을 시작하세요',
      ),
    ),
  },
};
