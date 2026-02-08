import React from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import NicknameSection from './nickname-section';

const meta = {
  title: 'app/main/settings/components/nickname-section',
  component: NicknameSection,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
} satisfies Meta<typeof NicknameSection>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    nickname: '포퐁유저',
    onEdit: (newNickname: string) => console.log('Nickname edited:', newNickname),
    editable: true,
  },
};

export const ReadOnly: Story = {
  args: {
    nickname: '포퐁유저',
    editable: false,
  },
};
