import React from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import ReportSuccessDialog from './report-success-dialog';

const meta = {
  title: 'components/report-dialog/report-success-dialog',
  component: ReportSuccessDialog,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
} satisfies Meta<typeof ReportSuccessDialog>;

export default meta;
type Story = StoryObj<typeof meta>;

export const ReviewReport: Story = {
  args: {
    open: true,
    onOpenChange: () => {},
    onConfirm: () => console.log('Confirmed'),
    type: 'review',
  },
};

export const BreederReport: Story = {
  args: {
    open: true,
    onOpenChange: () => {},
    onConfirm: () => console.log('Confirmed'),
    type: 'breeder',
    breederNickname: '김브리더',
  },
};
