import React, { useState } from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import ConfirmDialog from '@/components/confirm-dialog';
import { Button } from '@/components/ui/button';

const meta = {
  title: 'components/confirm-dialog',
  component: ConfirmDialog,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
} satisfies Meta<typeof ConfirmDialog>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    open: true,
    onOpenChange: () => {},
    onConfirm: () => {},
    title: '확인 다이얼로그',
    description: '정말 진행하시겠습니까?',
  },
};

export const WithCustomText: Story = {
  args: {
    open: true,
    onOpenChange: () => {},
    onConfirm: () => {},
    title: '삭제하시겠습니까?',
    description: '삭제된 내용은 복구할 수 없어요.',
    confirmText: '삭제',
    cancelText: '취소',
  },
};

export const WithTrigger = () => {
  const [open, setOpen] = useState(false);

  return (
    <ConfirmDialog
      open={open}
      onOpenChange={setOpen}
      onConfirm={() => {
        alert('확인되었습니다!');
        setOpen(false);
      }}
      title="확인이 필요해요"
      description="정말 진행하시겠습니까?"
    >
      <Button>다이얼로그 열기</Button>
    </ConfirmDialog>
  );
};

export const WithHasData = () => {
  const [hasData, setHasData] = useState(false);

  return (
    <div className="flex flex-col gap-4 items-center">
      <label className="flex items-center gap-2">
        <input type="checkbox" checked={hasData} onChange={(e) => setHasData(e.target.checked)} />
        데이터 있음
      </label>

      <ConfirmDialog
        hasData={hasData}
        onConfirm={() => alert('확인되었습니다!')}
        title="데이터가 있어요"
        description="hasData가 true일 때만 다이얼로그가 표시됩니다."
      >
        <Button>클릭해보세요</Button>
      </ConfirmDialog>
    </div>
  );
};
