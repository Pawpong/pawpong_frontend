import React from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import EmptyPetState from './empty-pet-state';

const meta = {
  title: 'app/main/explore/breeder/[id]/components/empty-pet-state',
  component: EmptyPetState,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
} satisfies Meta<typeof EmptyPetState>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
