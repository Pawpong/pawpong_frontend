import React from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import { Popover, PopoverTrigger, PopoverContent } from './popover';
import { Button } from '../button/button';

const meta = {
  title: 'UI/Popover',
  component: Popover,
  parameters: { layout: 'centered' },
  tags: ['autodocs'],
} satisfies Meta<typeof Popover>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  render: () => (
    <Popover>
      <PopoverTrigger asChild>
        <Button variant="outline">팝오버 열기</Button>
      </PopoverTrigger>
      <PopoverContent>
        <div className="space-y-2">
          <h4 className="font-medium text-sm">팝오버 제목</h4>
          <p className="text-sm text-muted-foreground">팝오버 내용입니다.</p>
        </div>
      </PopoverContent>
    </Popover>
  ),
};
