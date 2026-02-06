import React from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import BreederProfileSectionMore from './breeder-profile-section-more';

const meta = {
  title: 'components/breeder-profile/breeder-profile-section-more',
  component: BreederProfileSectionMore,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
} satisfies Meta<typeof BreederProfileSectionMore>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
};
