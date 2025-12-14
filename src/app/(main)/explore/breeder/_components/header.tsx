'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import ArrowRight from '@/assets/icons/arrow-right';
import Paw from '@/assets/icons/paw';
import Siren from '@/assets/icons/siren';
import { Button } from '@/components/ui/button';
import ReportDialog from '@/components/report-dialog/report-dialog';
import { useAuthStore } from '@/stores/auth-store';

interface HeaderProps {
  breederNickname: string;
  breederId: string;
}

export default function Header({ breederNickname, breederId }: HeaderProps) {
  const router = useRouter();
  const [isReportDialogOpen, setIsReportDialogOpen] = useState(false);

  const handleBack = () => {
    router.back();
  };

  const { user } = useAuthStore();
  const isOwnProfile = user?.role === 'breeder' && user?.userId === breederId;

  return (
    <>
      <div className="flex items-center justify-between text-grayscale-gray6 py-6">
        <Button variant="secondary" size="icon" className="size-9" onClick={handleBack}>
          <ArrowRight className="size-7" />
        </Button>
        {!isOwnProfile && (
          <div className="flex gap-3">
            <Button variant="secondary" size="icon" className="size-9" onClick={() => setIsReportDialogOpen(true)}>
              <Siren className="size-7" />
            </Button>
            <Button variant="secondary" size="icon" className="size-9">
              <Paw className="size-7" />
            </Button>
          </div>
        )}
      </div>
      <ReportDialog
        open={isReportDialogOpen}
        onOpenChange={setIsReportDialogOpen}
        type="breeder"
        breederNickname={breederNickname}
        breederId={breederId}
      />
    </>
  );
}
