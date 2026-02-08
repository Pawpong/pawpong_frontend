import React from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import BreederProfileSectionHeader from './breeder-profile-section-header';

const meta = {
  title: 'components/breeder-profile/breeder-profile-section-header',
  component: BreederProfileSectionHeader,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
} satisfies Meta<typeof BreederProfileSectionHeader>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    children: React.createElement(React.Fragment, null,
      React.createElement('span', { style: { fontWeight: 'bold' } }, '브리더 소개'),
      React.createElement('button', { style: { fontSize: '12px', color: '#999' } }, '더보기 >')
    ),
  },
};
