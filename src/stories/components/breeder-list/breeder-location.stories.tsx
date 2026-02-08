import React from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import BreederLocation from './breeder-location';

const meta = {
  title: 'components/breeder-list/breeder-location',
  component: BreederLocation,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
} satisfies Meta<typeof BreederLocation>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    children: '서울특별시 강남구',
  },
};
