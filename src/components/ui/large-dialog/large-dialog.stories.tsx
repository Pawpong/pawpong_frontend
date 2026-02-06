import React from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import {
  LargeDialog,
  LargeDialogTrigger,
  LargeDialogContent,
  LargeDialogHeader,
  LargeDialogTitle,
  LargeDialogDescription,
  LargeDialogFooter,
  LargeDialogClose,
} from './large-dialog';
import { Button } from '../button/button';

const meta = {
  title: 'UI/LargeDialog',
  component: LargeDialog,
  parameters: { layout: 'centered' },
  tags: ['autodocs'],
} satisfies Meta<typeof LargeDialog>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  render: () => (
    <LargeDialog>
      <LargeDialogTrigger asChild>
        <Button variant="outline">대형 다이얼로그 열기</Button>
      </LargeDialogTrigger>
      <LargeDialogContent>
        <LargeDialogHeader>
          <LargeDialogTitle>상담 내용</LargeDialogTitle>
          <LargeDialogDescription>상담 신청 내용을 확인하세요.</LargeDialogDescription>
        </LargeDialogHeader>
        <div className="flex-1 overflow-y-auto px-5 md:px-6 py-4">
          <p className="text-sm">여기에 긴 내용이 들어갑니다.</p>
        </div>
        <LargeDialogFooter>
          <LargeDialogClose asChild>
            <Button variant="outline" className="flex-1">취소</Button>
          </LargeDialogClose>
          <Button variant="tertiary" className="flex-1">확인</Button>
        </LargeDialogFooter>
      </LargeDialogContent>
    </LargeDialog>
  ),
};
