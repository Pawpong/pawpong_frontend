'use client';

import { useState } from 'react';
import Pencil from '@/assets/icons/pencil.svg';
import { Button } from '@/components/ui/button';
import NicknameEditDialog from './nickname-edit-dialog';

interface NicknameSectionProps {
  nickname: string;
  onEdit?: (newNickname: string) => void;
}

export default function NicknameSection({ nickname, onEdit }: NicknameSectionProps) {
  const [dialogOpen, setDialogOpen] = useState(false);

  const handleSave = (newNickname: string) => {
    onEdit?.(newNickname);
  };

  return (
    <>
      <div className="flex flex-col gap-5 w-full">
        <h3 className="text-body-s font-medium text-grayscale-gray5">닉네임</h3>
        <div className="flex items-center justify-between gap-2 w-full">
          <span className="text-body-s font-medium text-grayscale-gray6">{nickname}</span>
          <Button
            variant="ghost"
            onClick={() => setDialogOpen(true)}
            className="group gap-1 h-auto p-0 text-body-xs font-medium text-grayscale-gray5 hover:text-primary"
          >
            <span>수정하기</span>
            <Pencil className="text-grayscale-gray5 group-hover:text-primary" />
          </Button>
        </div>
      </div>

      <NicknameEditDialog
        open={dialogOpen}
        onOpenChange={setDialogOpen}
        currentNickname={nickname}
        onSave={handleSave}
      />
    </>
  );
}
