import React from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import BreederHeader from './breeder-header';

const meta = {
  title: 'components/breeder-list/breeder-header',
  component: BreederHeader,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
} satisfies Meta<typeof BreederHeader>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    children: React.createElement('span', { style: { fontWeight: 'bold', fontSize: '16px' } }, '브리더 이름'),
  },
};
