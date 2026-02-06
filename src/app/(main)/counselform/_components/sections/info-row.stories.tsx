import React from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import { InfoRow } from './info-row';

const meta = {
  title: 'app/main/counselform/components/sections/info-row',
  component: InfoRow,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
} satisfies Meta<typeof InfoRow>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    text: "텍스트",
  },
};
