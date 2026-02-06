import React from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import { Collapsible, CollapsibleTrigger, CollapsibleContent } from './collapsible';
import { Button } from '../button/button';

const meta = {
  title: 'UI/Collapsible',
  component: Collapsible,
  parameters: { layout: 'centered' },
  tags: ['autodocs'],
} satisfies Meta<typeof Collapsible>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  render: () => (
    <Collapsible className="w-[350px] space-y-2">
      <CollapsibleTrigger asChild>
        <Button variant="outline" className="w-full justify-between">
          클릭하여 펼치기/접기
        </Button>
      </CollapsibleTrigger>
      <CollapsibleContent className="space-y-2">
        <div className="rounded-md border px-4 py-2 text-sm">숨겨진 내용 1</div>
        <div className="rounded-md border px-4 py-2 text-sm">숨겨진 내용 2</div>
        <div className="rounded-md border px-4 py-2 text-sm">숨겨진 내용 3</div>
      </CollapsibleContent>
    </Collapsible>
  ),
};
