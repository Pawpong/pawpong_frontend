import React from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import { Input } from './input';

const meta = {
  title: 'UI/Input',
  component: Input,
  parameters: { layout: 'centered' },
  tags: ['autodocs'],
  decorators: [(Story) => <div style={{ width: 320 }}><Story /></div>],
} satisfies Meta<typeof Input>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: { placeholder: '입력하세요', type: 'text' },
};

export const WithValue: Story = {
  args: { defaultValue: '안녕하세요', type: 'text' },
};

export const Password: Story = {
  args: { placeholder: '비밀번호를 입력하세요', type: 'password' },
};

export const Disabled: Story = {
  args: { placeholder: '비활성화', disabled: true },
};
