"use client";

import {
  LargeDialog,
  LargeDialogClose,
  LargeDialogContent,
  LargeDialogHeader,
  LargeDialogTitle,
  LargeDialogTrigger,
} from "@/components/ui/large-dialog";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import Close from "@/assets/icons/close";
import { NoticeItem } from "../_hooks/use-notices";

interface NoticeDialogProps {
  notice: NoticeItem;
  children: React.ReactNode;
}

export default function NoticeDialog({ notice, children }: NoticeDialogProps) {
  return (
    <LargeDialog>
      <LargeDialogTrigger asChild>{children}</LargeDialogTrigger>
      <LargeDialogContent className="w-full md:w-[600px] h-full md:h-[600px] md:max-w-[600px] md:max-h-[600px]">
        <LargeDialogHeader className="pt-6 px-6 pb-[10px]">
          <LargeDialogTitle>
            <div className="flex justify-between items-center w-full">
              <span className="text-body-l font-semibold text-primary">
                공지사항
              </span>
              <LargeDialogClose asChild>
                <Button variant="secondary" size="icon" className="size-9">
                  <Close className="size-5 text-grayscale-gray7" />
                </Button>
              </LargeDialogClose>
            </div>
          </LargeDialogTitle>
        </LargeDialogHeader>

        {/* 스크롤 가능한 콘텐츠 영역 */}
        <div className="flex flex-col gap-4 px-6 py-5 pb-10 flex-1 min-h-0 ">
          {/* 공지사항 제목과 날짜 */}
          <div className="flex flex-col gap-2">
            <p className="text-body-m font-medium text-primary">
              {notice.title}
            </p>
            <p className="text-body-s font-normal text-grayscale-gray5">
              {notice.date}
            </p>
          </div>

          <Separator />

          {/* 본문 내용 */}
          <p className="text-body-s font-normal text-grayscale-gray5 whitespace-pre-line">
            {notice.content}
          </p>
        </div>
      </LargeDialogContent>
    </LargeDialog>
  );
}
