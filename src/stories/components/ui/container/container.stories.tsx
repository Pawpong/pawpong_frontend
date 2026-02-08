import React from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import Container from './container';

const meta = {
  title: 'UI/Container',
  component: Container,
  parameters: { layout: 'fullscreen' },
  tags: ['autodocs'],
} satisfies Meta<typeof Container>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    children: '컨테이너 내용입니다. 최대 너비가 제한되고 가운데 정렬됩니다.',
  },
};

export const Tertiary: Story = {
  args: {
    children: '터셔리 배경의 컨테이너입니다.',
    variant: 'tertiary',
  },
};
