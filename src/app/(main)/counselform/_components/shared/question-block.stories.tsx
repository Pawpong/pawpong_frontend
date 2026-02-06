import React from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import { QuestionBlock } from './question-block';

const meta = {
  title: 'app/main/counselform/components/shared/question-block',
  component: QuestionBlock,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
} satisfies Meta<typeof QuestionBlock>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    title: '질문 제목',
    children: <div className="p-4 border rounded">질문 내용 영역</div>,
  },
};
