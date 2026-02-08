import React from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import SubmitSuccessDialog from './submit-success-dialog';

const meta = {
  title: 'components/document-form/submit-success-dialog',
  component: SubmitSuccessDialog,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
} satisfies Meta<typeof SubmitSuccessDialog>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    open: true,
    onOpenChange: () => {},
    onGoHome: () => console.log('Go home'),
  },
};
