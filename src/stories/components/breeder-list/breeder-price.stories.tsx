import React from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import BreederPrice from './breeder-price';

const meta = {
  title: 'components/breeder-list/breeder-price',
  component: BreederPrice,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
} satisfies Meta<typeof BreederPrice>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    children: '150만원 ~ 300만원',
  },
};
