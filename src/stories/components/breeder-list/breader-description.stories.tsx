import React from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import BreederDescription from './breader-description';

const meta = {
  title: 'components/breeder-list/breader-description',
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
    children: React.createElement(React.Fragment, null, 
      React.createElement('span', null, '골든 리트리버'),
      React.createElement('span', null, ' · 서울 강남구')
    ),
  },
};
