import React from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import ReviewTextarea from './review-textarea';

const meta = {
  title: 'app/main/application/components/review-textarea',
  component: ReviewTextarea,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
} satisfies Meta<typeof ReviewTextarea>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    value: '',
    onChange: (value: string) => console.log('Changed:', value),
    placeholder: '후기를 작성해주세요',
    maxLength: 800,
  },
};

export const WithContent: Story = {
  args: {
    value: '좋은 브리더였습니다. 친절하게 상담해주셨고 건강한 아이를 만날 수 있었습니다.',
    onChange: (value: string) => console.log('Changed:', value),
    placeholder: '후기를 작성해주세요',
    maxLength: 800,
  },
};
