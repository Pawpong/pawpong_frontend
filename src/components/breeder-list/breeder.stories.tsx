import React from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import Breeder from './breeder';

const meta = {
  title: 'components/breeder-list/breeder',
  component: Breeder,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
} satisfies Meta<typeof Breeder>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    children: React.createElement(React.Fragment, null,
      React.createElement('div', { style: { flex: 1 } }, '브리더 프로필 영역'),
      React.createElement('div', { style: { width: 200, height: 200, background: '#f0f0f0', borderRadius: 8, display: 'flex', alignItems: 'center', justifyContent: 'center' } }, '이미지')
    ),
  },
};
