import React from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import { Button } from './button';

const meta = {
  title: 'UI/Button',
  component: Button,
  parameters: { layout: 'centered' },
  tags: ['autodocs'],
  argTypes: {
    variant: {
      control: 'select',
      options: [
        'default',
        'primary',
        'outline',
        'secondary',
        'tertiary',
        'ghost',
        'link',
        'filter',
        'text',
        'category',
      ],
    },
    size: {
      control: 'select',
      options: ['default', 'sm', 'lg', 'icon'],
    },
    disabled: { control: 'boolean' },
  },
} satisfies Meta<typeof Button>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: { children: '버튼', variant: 'default', size: 'default' },
};

export const Primary: Story = {
  args: { children: '회원가입', variant: 'primary', size: 'lg' },
};

export const Outline: Story = {
  args: { children: '취소', variant: 'outline', size: 'default' },
};

export const Secondary: Story = {
  args: { children: '보조 버튼', variant: 'secondary', size: 'default' },
};

export const Tertiary: Story = {
  args: { children: '중복검사', variant: 'tertiary', size: 'default' },
};

export const Ghost: Story = {
  args: { children: '더보기', variant: 'ghost', size: 'default' },
};

export const Disabled: Story = {
  args: { children: '비활성화', variant: 'tertiary', size: 'lg', disabled: true },
};

export const AllVariants: Story = {
  render: () => (
    <div className="flex flex-wrap gap-3 items-center">
      <Button variant="default">Default</Button>
      <Button variant="primary">Primary</Button>
      <Button variant="outline">Outline</Button>
      <Button variant="secondary">Secondary</Button>
      <Button variant="tertiary">Tertiary</Button>
      <Button variant="ghost">Ghost</Button>
      <Button variant="link">Link</Button>
      <Button variant="filter">Filter</Button>
      <Button variant="text">Text</Button>
    </div>
  ),
};

export const AllSizes: Story = {
  render: () => (
    <div className="flex flex-wrap gap-3 items-center">
      <Button variant="tertiary" size="sm">
        Small
      </Button>
      <Button variant="tertiary" size="default">
        Default
      </Button>
      <Button variant="tertiary" size="lg">
        Large
      </Button>
    </div>
  ),
};
