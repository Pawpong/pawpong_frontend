import React from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import OathCheckbox from './oath-checkbox';

const meta = {
  title: 'components/document-form/oath-checkbox',
  component: OathCheckbox,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
} satisfies Meta<typeof OathCheckbox>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Unchecked: Story = {
  args: {
    level: 'elite',
    checked: false,
    onCheckedChange: (checked: boolean) => console.log('Checked:', checked),
  },
};

export const Checked: Story = {
  args: {
    level: 'new',
    checked: true,
    onCheckedChange: (checked: boolean) => console.log('Checked:', checked),
  },
};
