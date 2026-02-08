import React from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import BreederContent from './breeder-content';

const meta = {
  title: 'components/breeder-list/breeder-content',
  component: BreederContent,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
} satisfies Meta<typeof BreederContent>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    children: React.createElement('div', null, '브리더 상세 내용 영역'),
  },
};
