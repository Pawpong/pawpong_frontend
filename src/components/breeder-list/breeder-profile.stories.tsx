import React from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import BreederProfile from './breeder-profile';

const meta = {
  title: 'components/breeder-list/breeder-profile',
  component: BreederProfile,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
} satisfies Meta<typeof BreederProfile>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    children: React.createElement('div', null,
      React.createElement('div', { style: { fontWeight: 'bold', fontSize: '16px' } }, '해피독 브리더'),
      React.createElement('div', { style: { color: '#999', fontSize: '14px' } }, '서울특별시 강남구')
    ),
  },
};
