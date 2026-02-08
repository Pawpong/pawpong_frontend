import React from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import ProfileImageWithBadge from './profile-image-with-badge';

const meta = {
  title: 'components/breeder/profile-image-with-badge',
  component: ProfileImageWithBadge,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
} satisfies Meta<typeof ProfileImageWithBadge>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    alt: '프로필 이미지',
    size: 68,
    animalType: 'profile',
  },
};

export const CatType: Story = {
  args: {
    alt: '고양이 프로필',
    size: 68,
    animalType: 'cat',
  },
};

export const DogType: Story = {
  args: {
    alt: '강아지 프로필',
    size: 68,
    animalType: 'dog',
  },
};

export const LargeSize: Story = {
  args: {
    alt: '프로필 이미지',
    size: 120,
    animalType: 'profile',
  },
};
