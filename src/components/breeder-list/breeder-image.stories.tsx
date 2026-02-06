import React from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import BreederImage from './breeder-image';

const meta = {
  title: 'components/breeder-list/breeder-image',
  component: BreederImage,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
} satisfies Meta<typeof BreederImage>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    src: '/profile-empty.svg',
    alt: '브리더 프로필 이미지',
  },
};
