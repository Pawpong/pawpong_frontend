import React from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import AdBadge from './ad-badge';

const meta = {
  title: 'components/ad-badge',
  component: AdBadge,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
} satisfies Meta<typeof AdBadge>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    text: '광고',
    popoverText: '포퐁 광고 상품을 구매한 제휴 업체의 판매 상품입니다.',
  },
};
