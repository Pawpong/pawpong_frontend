import React from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import SignupFormItems from './signup-form-items';

const meta = {
  title: 'components/signup-form-section/signup-form-items',
  component: SignupFormItems,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
} satisfies Meta<typeof SignupFormItems>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    children: React.createElement(React.Fragment, null,
      React.createElement('div', { style: { padding: '12px', background: '#f5f5f5', borderRadius: 8 } }, '입력 항목 1'),
      React.createElement('div', { style: { padding: '12px', background: '#f5f5f5', borderRadius: 8 } }, '입력 항목 2')
    ),
  },
};
