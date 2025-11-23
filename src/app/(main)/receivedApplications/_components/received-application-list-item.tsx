import RequestStatusBadge from "./request-status-badge";
import ReceivedApplicationDialog from "./received-application-dialog";
import { cn } from "@/lib/utils";
import type { CounselFormData } from "@/stores/counsel-form-store";

interface ReceivedApplicationListItemProps {
  applicantNickname: string;
  animalInfo: string;
  status: "before" | "done";
  applicationDate: string;
  formData?: CounselFormData | null;
  className?: string;
}

export default function ReceivedApplicationListItem({
  applicantNickname,
  animalInfo,
  status,
  applicationDate,
  formData,
  className,
}: ReceivedApplicationListItemProps) {
  return (
    <ReceivedApplicationDialog
      applicantNickname={applicantNickname}
      animalInfo={animalInfo}
      status={status}
      applicationDate={applicationDate}
      formData={formData}
    >
      <div
        className={cn(
          "bg-[#f8f8ee] flex flex-col gap-3 p-5 rounded-lg w-full cursor-pointer hover:opacity-80 transition-opacity",
          className
        )}
      >
        <div className="flex flex-col gap-1 items-start w-full">
          <p className="text-body-m font-medium text-primary-500 w-full">
            {applicantNickname}
          </p>
          <p className="text-body-s font-normal text-grayscale-gray5 truncate w-full">
            {animalInfo}
          </p>
        </div>
        <div className="flex gap-3 items-center w-full">
          <RequestStatusBadge status={status} />
          <p className="text-body-s font-normal text-grayscale-gray5 whitespace-nowrap">
            {applicationDate}
          </p>
        </div>
      </div>
    </ReceivedApplicationDialog>
  );
}
