import React from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import FooterLinks from './footer-links';

const meta = {
  title: 'components/footer/footer-links',
  component: FooterLinks,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
} satisfies Meta<typeof FooterLinks>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
