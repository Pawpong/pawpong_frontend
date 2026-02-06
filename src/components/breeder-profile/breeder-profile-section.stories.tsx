import React from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import BreederProfileSection from './breeder-profile-section';

const meta = {
  title: 'components/breeder-profile/breeder-profile-section',
  component: BreederProfileSection,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
} satisfies Meta<typeof BreederProfileSection>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    children: (
      <>
        <h3 style={{ fontWeight: 'bold', fontSize: '18px' }}>섹션 제목</h3>
        <p>섹션 내용이 여기에 표시됩니다.</p>
      </>
    ),
    id: 'section-1',
  },
};
