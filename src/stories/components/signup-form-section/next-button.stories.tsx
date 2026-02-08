import React from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import NextButton from './next-button';

const meta = {
  title: 'components/signup-form-section/next-button',
  component: NextButton,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
} satisfies Meta<typeof NextButton>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    children: '다음',
  },
};
