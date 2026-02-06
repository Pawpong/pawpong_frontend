import React from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import BreederList from './breeder-list';

const meta = {
  title: 'components/breeder-list/breeder-list',
  component: BreederList,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
} satisfies Meta<typeof BreederList>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    children: React.createElement('div', null,
      React.createElement('div', { style: { padding: '16px', borderBottom: '1px solid #eee' } }, '브리더 1'),
      React.createElement('div', { style: { padding: '16px', borderBottom: '1px solid #eee' } }, '브리더 2'),
      React.createElement('div', { style: { padding: '16px' } }, '브리더 3')
    ),
  },
};
