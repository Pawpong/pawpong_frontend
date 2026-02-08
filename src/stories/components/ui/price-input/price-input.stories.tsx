import React from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import { PriceInput } from './price-input';

const meta = {
  title: 'UI/PriceInput',
  component: PriceInput,
  parameters: { layout: 'centered' },
  tags: ['autodocs'],
  decorators: [(Story) => <div style={{ width: 300 }}><Story /></div>],
} satisfies Meta<typeof PriceInput>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: { placeholder: '0' },
};

export const WithValue: Story = {
  args: { defaultValue: '1,500,000' },
};

export const Disabled: Story = {
  args: { placeholder: '0', disabled: true },
};
