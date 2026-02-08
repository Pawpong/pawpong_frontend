import React from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import BreederName from './breeder-name';

const meta = {
  title: 'components/breeder-list/breeder-name',
  component: BreederName,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
} satisfies Meta<typeof BreederName>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    children: '해피독 브리더',
  },
};
