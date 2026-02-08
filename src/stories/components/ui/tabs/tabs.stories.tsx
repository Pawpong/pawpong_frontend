import React from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import { Tabs, TabsList, TabsTrigger, TabsContent } from './tabs';

const meta = {
  title: 'UI/Tabs',
  component: Tabs,
  parameters: { layout: 'centered' },
  tags: ['autodocs'],
} satisfies Meta<typeof Tabs>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  render: () => (
    <Tabs defaultValue="tab1" className="w-[400px]">
      <TabsList>
        <TabsTrigger value="tab1">탭 1</TabsTrigger>
        <TabsTrigger value="tab2">탭 2</TabsTrigger>
        <TabsTrigger value="tab3">탭 3</TabsTrigger>
      </TabsList>
      <TabsContent value="tab1">
        <p className="text-sm p-4">첫 번째 탭 내용입니다.</p>
      </TabsContent>
      <TabsContent value="tab2">
        <p className="text-sm p-4">두 번째 탭 내용입니다.</p>
      </TabsContent>
      <TabsContent value="tab3">
        <p className="text-sm p-4">세 번째 탭 내용입니다.</p>
      </TabsContent>
    </Tabs>
  ),
};
