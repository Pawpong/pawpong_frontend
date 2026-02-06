import React from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import BreederAvatar from './breeder-avatar';

const meta = {
  title: 'components/breeder-list/breeder-avatar',
  component: BreederAvatar,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
} satisfies Meta<typeof BreederAvatar>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    src: "/images/placeholder.png",
  },
};
