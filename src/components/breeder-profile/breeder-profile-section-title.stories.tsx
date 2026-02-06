import React from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import BreederProfileSectionTitle from './breeder-profile-section-title';

const meta = {
  title: 'components/breeder-profile/breeder-profile-section-title',
  component: BreederProfileSectionTitle,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
} satisfies Meta<typeof BreederProfileSectionTitle>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    children: '브리더 프로필 섹션 제목',
  },
};
