import React from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import FooterSNS from './footer-SNS';

const meta = {
  title: 'components/footer/footer-SNS',
  component: FooterSNS,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
} satisfies Meta<typeof FooterSNS>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
};
