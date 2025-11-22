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
import { termsContents } from "@/constants/terms";
import * as DialogPrimitive from "@radix-ui/react-dialog";
import React from "react";

export default function TermDialogTrigger({
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
              서비스 이용약관
              <LargeDialogClose asChild>
                <Button variant="secondary" className="size-9">
                  <Close className="size-5 text-grayscale-gray7" />
                </Button>
              </LargeDialogClose>
            </div>
          </LargeDialogTitle>
        </LargeDialogHeader>

        <div className="md:py-5 md:px-6 space-y-[20px] text-body-xs text-grayscale-gray6 overflow-auto px-padding py-4 flex-1">
          {termsContents}
        </div>

        <LargeDialogFooter className="justify-end">
          <LargeDialogClose asChild>
            <Button
              variant="tertiary"
              className="py-2 px-4 text-sm leading-[140%] tracking-[-2%] w-18  rounded-[--spacing(1)]"
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
