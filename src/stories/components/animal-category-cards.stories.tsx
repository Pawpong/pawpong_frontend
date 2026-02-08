import React from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import AnimalCategoryCards from './animal-category-cards';

const meta = {
  title: 'components/animal-category-cards',
  component: AnimalCategoryCards,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
} satisfies Meta<typeof AnimalCategoryCards>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    size: 'default',
    layout: 'horizontal',
  },
};

export const Compact: Story = {
  args: {
    size: 'compact',
    layout: 'horizontal',
  },
};

export const Vertical: Story = {
  args: {
    size: 'default',
    layout: 'vertical',
  },
};

export const WithCustomLabels: Story = {
  args: {
    size: 'default',
    layout: 'horizontal',
    showLabels: ['고양이 분양', '강아지 분양'],
  },
};
