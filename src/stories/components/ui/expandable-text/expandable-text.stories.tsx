import React from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import { ExpandableText } from './expandable-text';

const meta = {
  title: 'UI/ExpandableText',
  component: ExpandableText,
  parameters: { layout: 'centered' },
  tags: ['autodocs'],
  decorators: [
    (Story) => (
      <div style={{ width: 400 }}>
        <Story />
      </div>
    ),
  ],
} satisfies Meta<typeof ExpandableText>;

export default meta;
type Story = StoryObj<typeof meta>;

const longText = `안녕하세요! 저는 10년 경력의 전문 브리더입니다.

건강하고 사회성 좋은 반려동물을 키우기 위해 최선을 다하고 있습니다. 모든 아이들은 정기적인 건강검진과 예방접종을 받고 있으며, 넓은 공간에서 자유롭게 뛰어놀 수 있는 환경을 제공하고 있습니다.

입양 후에도 언제든 상담이 가능하며, 아이들의 건강과 행복을 위해 지속적으로 소통하고 있습니다. 처음 반려동물을 키우시는 분들도 안심하고 입양하실 수 있도록 사육 가이드를 제공해 드립니다.

문의 사항이 있으시면 언제든 편하게 연락해 주세요. 좋은 인연이 되었으면 합니다.

감사합니다.`;

export const ShortText: Story = {
  args: { data: '짧은 텍스트는 더보기 버튼이 나타나지 않습니다.' },
};

export const LongText: Story = {
  args: { data: longText },
};
