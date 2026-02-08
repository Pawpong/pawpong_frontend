import React from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import BreederInfo from './breeder-info';

const meta = {
  title: 'components/breeder/breeder-info',
  component: BreederInfo,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
} satisfies Meta<typeof BreederInfo>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    breederName: '김브리더',
    applicationDate: '2025-01-15',
  },
};

export const WithoutDate: Story = {
  args: {
    breederName: '포퐁 브리더',
    hideDate: true,
  },
};
