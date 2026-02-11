import React from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import FooterCompanyInfo from './footer-company-info';

const meta = {
  title: 'components/footer/footer-company-info',
  component: FooterCompanyInfo,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
} satisfies Meta<typeof FooterCompanyInfo>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
