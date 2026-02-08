import React from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import MyReviewListItem from './my-review-list-item';

const meta = {
  title: 'app/main/myapplication/components/my-review-list-item',
  component: MyReviewListItem,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
} satisfies Meta<typeof MyReviewListItem>;

export default meta;
type Story = StoryObj<typeof meta>;

export const CounselReview: Story = {
  args: {
    applicationId: 'app-001',
    breederId: 'breeder-001',
    breederName: '김브리더',
    applicationDate: '2025-01-15',
    profileImage: '',
    animalType: 'cat',
    reviewType: '상담 후기',
    reviewContent: '정말 친절하게 상담해주셨어요. 고양이에 대한 지식이 풍부하시고 꼼꼼하게 설명해주셨습니다.',
    reviewDate: '2025-01-20',
  },
};

export const AdoptionReview: Story = {
  args: {
    applicationId: 'app-002',
    breederId: 'breeder-002',
    breederName: '박브리더',
    applicationDate: '2025-01-10',
    profileImage: '',
    animalType: 'dog',
    reviewType: '입양 후기',
    reviewContent: '건강한 강아지를 만날 수 있어서 감사합니다. 사후 관리도 잘 해주세요.',
    reviewDate: '2025-02-01',
  },
};
