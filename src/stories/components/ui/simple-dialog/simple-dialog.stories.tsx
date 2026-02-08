import React from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import {
  SimpleDialog,
  SimpleDialogTrigger,
  SimpleDialogContent,
  SimpleDialogHeader,
  SimpleDialogTitle,
  SimpleDialogDescription,
  SimpleDialogFooter,
  SimpleDialogClose,
} from './simple-dialog';
import { Button } from '../button/button';

const meta = {
  title: 'UI/SimpleDialog',
  component: SimpleDialog,
  parameters: { layout: 'centered' },
  tags: ['autodocs'],
} satisfies Meta<typeof SimpleDialog>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  render: () => (
    <SimpleDialog>
      <SimpleDialogTrigger asChild>
        <Button variant="outline">심플 다이얼로그 열기</Button>
      </SimpleDialogTrigger>
      <SimpleDialogContent>
        <SimpleDialogHeader>
          <SimpleDialogTitle>알림</SimpleDialogTitle>
          <SimpleDialogDescription>정말 삭제하시겠습니까?</SimpleDialogDescription>
        </SimpleDialogHeader>
        <SimpleDialogFooter>
          <SimpleDialogClose asChild>
            <Button variant="outline">취소</Button>
          </SimpleDialogClose>
          <Button variant="tertiary">확인</Button>
        </SimpleDialogFooter>
      </SimpleDialogContent>
    </SimpleDialog>
  ),
};
