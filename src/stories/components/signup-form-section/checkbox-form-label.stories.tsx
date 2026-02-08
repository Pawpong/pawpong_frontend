import React from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import CheckboxFormLabel from './checkbox-form-label';

const meta = {
  title: 'components/signup-form-section/checkbox-form-label',
  component: CheckboxFormLabel,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
} satisfies Meta<typeof CheckboxFormLabel>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    children: '이용약관에 동의합니다 (필수)',
  },
};
