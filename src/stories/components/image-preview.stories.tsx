import React from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import ImagePreview from './image-preview';

const meta = {
  title: 'components/image-preview',
  component: ImagePreview,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
} satisfies Meta<typeof ImagePreview>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    images: [
      { id: '1', file: null, preview: '/images/cat.png', isUrl: true },
      { id: '2', file: null, preview: '/images/dog.png', isUrl: true },
    ],
    onRemove: (id: string) => console.log('Remove:', id),
    maxImages: 3,
    showRemoveButton: true,
    imageSize: 'medium',
    layout: 'grid',
  },
};

export const Small: Story = {
  args: {
    images: [{ id: '1', file: null, preview: '/images/cat.png', isUrl: true }],
    onRemove: (id: string) => console.log('Remove:', id),
    imageSize: 'small',
  },
};

export const Large: Story = {
  args: {
    images: [
      { id: '1', file: null, preview: '/images/cat.png', isUrl: true },
      { id: '2', file: null, preview: '/images/dog.png', isUrl: true },
      { id: '3', file: null, preview: '/images/cat.png', isUrl: true },
    ],
    onRemove: (id: string) => console.log('Remove:', id),
    imageSize: 'large',
    layout: 'horizontal',
  },
};

export const NoRemoveButton: Story = {
  args: {
    images: [{ id: '1', file: null, preview: '/images/cat.png', isUrl: true }],
    onRemove: (id: string) => console.log('Remove:', id),
    showRemoveButton: false,
  },
};
