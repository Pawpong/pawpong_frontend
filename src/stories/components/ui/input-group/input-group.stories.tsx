import React from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import { InputGroup, InputGroupAddon, InputGroupInput } from './input-group';

const meta = {
  title: 'UI/InputGroup',
  component: InputGroup,
  parameters: { layout: 'centered' },
  tags: ['autodocs'],
  decorators: [
    (Story) => (
      <div style={{ width: 350 }}>
        <Story />
      </div>
    ),
  ],
} satisfies Meta<typeof InputGroup>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  render: () => (
    <InputGroup>
      <InputGroupAddon align="inline-start">🔍</InputGroupAddon>
      <InputGroupInput placeholder="검색어를 입력하세요" />
    </InputGroup>
  ),
};

export const WithSuffix: Story = {
  render: () => (
    <InputGroup>
      <InputGroupInput placeholder="금액 입력" />
      <InputGroupAddon align="inline-end">원</InputGroupAddon>
    </InputGroup>
  ),
};
