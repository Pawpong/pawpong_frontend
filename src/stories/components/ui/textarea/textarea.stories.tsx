import React from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import { Textarea } from './textarea';

const meta = {
  title: 'UI/Textarea',
  component: Textarea,
  parameters: { layout: 'centered' },
  tags: ['autodocs'],
  decorators: [
    (Story) => (
      <div style={{ width: 400 }}>
        <Story />
      </div>
    ),
  ],
} satisfies Meta<typeof Textarea>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: { placeholder: '내용을 입력하세요', maxLength: 500 },
};

export const WithValue: Story = {
  args: {
    defaultValue: '이미 작성된 내용입니다.',
    maxLength: 500,
  },
};

export const NoCounter: Story = {
  args: { placeholder: '글자 수 표시 없음', showLength: false },
};
