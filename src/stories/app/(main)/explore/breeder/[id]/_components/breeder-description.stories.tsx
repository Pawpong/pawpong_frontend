import React from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import BreederDescription from './breeder-description';

const meta = {
  title: 'app/main/explore/breeder/[id]/components/breeder-description',
  component: BreederDescription,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
} satisfies Meta<typeof BreederDescription>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    data: '브리더 소개 내용입니다. 여기에 브리더에 대한 상세한 설명이 들어갑니다. 이 컴포넌트는 긴 텍스트를 자동으로 접고 펼칠 수 있는 기능을 제공합니다.',
  },
};

export const LongText: Story = {
  args: {
    data: '브리더 소개 내용입니다. 여기에 브리더에 대한 상세한 설명이 들어갑니다. 이 컴포넌트는 긴 텍스트를 자동으로 접고 펼칠 수 있는 기능을 제공합니다. 더 많은 내용이 있을 때는 자동으로 접히고, 더보기 버튼을 클릭하면 전체 내용을 볼 수 있습니다. 이렇게 긴 텍스트를 효율적으로 표시할 수 있습니다.',
  },
};
