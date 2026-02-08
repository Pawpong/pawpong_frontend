import React from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import { Toast, ToastProvider, ToastViewport, ToastTitle, ToastClose } from './toast';

const meta = {
  title: 'UI/Toast',
  component: Toast,
  parameters: { layout: 'centered' },
  tags: ['autodocs'],
} satisfies Meta<typeof Toast>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  render: () => (
    <ToastProvider>
      <Toast open>
        <ToastTitle>저장되었습니다!</ToastTitle>
        <ToastClose />
      </Toast>
      <ToastViewport />
    </ToastProvider>
  ),
};
