import React from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import CheckboxForm from './checkbox-form';

const meta = {
  title: 'components/signup-form-section/checkbox-form',
  component: CheckboxForm,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
} satisfies Meta<typeof CheckboxForm>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    label: '이용약관에 동의합니다 (필수)',
    checked: false,
    onCheckedChange: () => {},
  },
};
