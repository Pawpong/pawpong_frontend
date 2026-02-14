import React from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import FaqItemComponent from './faq-item';

const meta = {
  title: 'app/main/faq/components/faq-item',
  component: FaqItemComponent,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
} satisfies Meta<typeof FaqItemComponent>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    item: {
      faqId: '1',
      question: '포포에서 분양은 어떻게 진행되나요?',
      answer:
        '포포에서는 검증된 브리더와 직접 연결하여 안전한 분양을 진행합니다. 상담 신청 후 브리더와 상담을 거쳐 분양이 이루어집니다.',
      category: 'general',
      userType: 'adopter',
      order: 1,
    },
    isOpen: true,
    onToggle: () => {},
  },
};

export const Closed: Story = {
  args: {
    item: {
      faqId: '2',
      question: '분양 후 건강 문제가 발생하면 어떻게 하나요?',
      answer:
        '분양 후 건강 문제가 발생할 경우, 브리더에게 직접 연락하시거나 포포 고객센터를 통해 도움을 받으실 수 있습니다.',
      category: 'general',
      userType: 'adopter',
      order: 2,
    },
    isOpen: false,
    onToggle: () => {},
  },
};
