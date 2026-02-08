import React from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import CheckboxFormList from './checkbox-form-list';

const meta = {
  title: 'components/signup-form-section/checkbox-form-list',
  component: CheckboxFormList,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
} satisfies Meta<typeof CheckboxFormList>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    children: React.createElement(React.Fragment, null,
      React.createElement('div', { style: { padding: '8px 0' } }, '☑ 이용약관 동의'),
      React.createElement('div', { style: { padding: '8px 0' } }, '☑ 개인정보처리방침 동의')
    ),
  },
};
