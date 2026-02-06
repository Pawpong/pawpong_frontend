import React from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
  DialogClose,
} from './dialog';
import { Button } from '../button/button';

const meta = {
  title: 'UI/Dialog',
  component: Dialog,
  parameters: { layout: 'centered' },
  tags: ['autodocs'],
} satisfies Meta<typeof Dialog>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  render: () => (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="outline">다이얼로그 열기</Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>다이얼로그 제목</DialogTitle>
          <DialogDescription>여기에 설명이 들어갑니다.</DialogDescription>
        </DialogHeader>
        <div className="py-4">
          <p className="text-sm">다이얼로그 본문 내용입니다.</p>
        </div>
        <DialogFooter>
          <DialogClose asChild>
            <Button variant="outline">취소</Button>
          </DialogClose>
          <Button variant="tertiary">확인</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  ),
};
