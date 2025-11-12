"use client";

import { useState } from "react";
import ArrowRight from "@/assets/icons/arrow-right";
import Paw from "@/assets/icons/paw";
import Siren from "@/assets/icons/siren";
import { Button } from "@/components/ui/button";
import ReportDialog from "@/components/report-dialog/report-dialog";

interface HeaderProps {
  breederNickname: string;
}

export default function Header({ breederNickname }: HeaderProps) {
  const [isReportDialogOpen, setIsReportDialogOpen] = useState(false);

  return (
    <>
      <div className="flex items-center justify-between text-grayscale-gray6 py-6">
        <Button variant="secondary" size="icon" className="size-9">
          <ArrowRight className="size-7" />
        </Button>
        <div className="flex gap-3">
          <Button
            variant="secondary"
            size="icon"
            className="size-9"
            onClick={() => setIsReportDialogOpen(true)}
          >
            <Siren className="size-7" />
          </Button>
          <Button variant="secondary" size="icon" className="size-9">
            <Paw className="size-7" />
          </Button>
        </div>
      </div>
      <ReportDialog
        open={isReportDialogOpen}
        onOpenChange={setIsReportDialogOpen}
        type="breeder"
        breederNickname={breederNickname}
      />
    </>
  );
}
