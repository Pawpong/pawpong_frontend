import Close from "@/assets/icons/close";
import { Button } from "@/components/ui/button";
import {
  LargeDialog,
  LargeDialogClose,
  LargeDialogContent,
  LargeDialogFooter,
  LargeDialogHeader,
  LargeDialogTitle,
  LargeDialogTrigger,
} from "@/components/ui/large-dialog";
import * as DialogPrimitive from "@radix-ui/react-dialog";
import React from "react";

export default function PrivacyDialogTrigger({
  onAgree,

  ...props
}: { onAgree: () => void } & React.ComponentProps<
  typeof DialogPrimitive.Trigger
>) {
  return (
    <LargeDialog>
      <LargeDialogTrigger {...props} />
      <LargeDialogContent className="flex flex-col">
        <LargeDialogHeader>
          <LargeDialogTitle>
            <div className="flex justify-between items-center">
              개인정보 수집 및 이용
              <LargeDialogClose asChild>
                <Button variant="secondary" className="size-9">
                  <Close className="size-5 text-grayscale-gray7" />
                </Button>
              </LargeDialogClose>
            </div>
          </LargeDialogTitle>
        </LargeDialogHeader>

        <div className="sm:py-5 sm:px-6 space-y-5 text-body-xs text-grayscale-gray6 overflow-auto px-padding py-4 flex-1 ">
          음음음
        </div>

        <LargeDialogFooter>
          <LargeDialogClose asChild>
            <Button
              className="py-2 px-4 text-sm leading-[140%] tracking-[-2%] w-18 text-white! rounded-[--spacing(1)]"
              onClick={() => {
                onAgree();
              }}
            >
              동의
            </Button>
          </LargeDialogClose>
        </LargeDialogFooter>
      </LargeDialogContent>
    </LargeDialog>
  );
}
