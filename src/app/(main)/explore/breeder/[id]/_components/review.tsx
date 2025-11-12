"use client";

import { useState } from "react";
import SirenMuted from "@/assets/icons/siren-muted";
import { Button } from "@/components/ui/button";
import { useBreakpoint } from "@/hooks/use-breakpoint";
import ReportDialog from "./report-dialog";

export default function Review({
  data,
}: {
  data: { nickname: string; date: string; content: string };
}) {
  const isMobile = !useBreakpoint("md");
  const [isReportDialogOpen, setIsReportDialogOpen] = useState(false);

  return (
    <>
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="text-body-s font-semibold text-grayscale-gray5">
              {data.nickname}
            </div>
            {!isMobile && (
              <div className="text-body-s text-grayscale-gray5">
                입양 후기・{data.date}
              </div>
            )}
          </div>
          <Button
            variant="ghost"
            className="p-0 gap-1 text-grayscale-gray5 text-body-xs"
            onClick={() => setIsReportDialogOpen(true)}
          >
            <SirenMuted className="size-5" />
            <div>신고하기</div>
          </Button>
        </div>
        {isMobile && (
          <div className="text-body-s text-grayscale-gray5">
            입양 후기・{data.date}
          </div>
        )}
        <div className="font-medium text-body-m text-primary">
          {data.content}
        </div>
      </div>
      <ReportDialog
        open={isReportDialogOpen}
        onOpenChange={setIsReportDialogOpen}
      />
    </>
  );
}
