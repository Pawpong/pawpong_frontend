import React from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import SubmitButton from './submit-button';

const meta = {
  title: 'app/main/counselform/components/shared/submit-button',
  component: SubmitButton,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
} satisfies Meta<typeof SubmitButton>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    isDisabled: false,
    isSubmitting: false,
    onSubmit: () => console.log('Submit clicked'),
  },
};

export const Disabled: Story = {
  args: {
    isDisabled: true,
    isSubmitting: false,
    onSubmit: () => console.log('Submit clicked'),
  },
};

export const Submitting: Story = {
  args: {
    isDisabled: false,
    isSubmitting: true,
    onSubmit: () => console.log('Submit clicked'),
  },
};
