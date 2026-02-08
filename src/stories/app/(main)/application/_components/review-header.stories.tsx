import React from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import ReviewHeader from './review-header';
import { Dialog } from '@/components/ui/dialog';

const meta = {
  title: 'app/main/application/components/review-header',
  component: ReviewHeader,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
  decorators: [
    (Story) => (
      <Dialog open={true}>
        <Story />
      </Dialog>
    ),
  ],
} satisfies Meta<typeof ReviewHeader>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    onClose: () => console.log('Close clicked'),
  },
};
