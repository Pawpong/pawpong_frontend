import Close from "@/assets/icons/close";
import React from "react";
import { Button } from "../ui/button";
import {
  LargeDialog,
  LargeDialogClose,
  LargeDialogContent,
  LargeDialogFooter,
  LargeDialogHeader,
  LargeDialogTitle,
  LargeDialogTrigger,
} from "../ui/large-dialog";
import { useOath } from "./oath-provider";

export function OathDialog({
  title,
  content,
  children,
  ...props
}: {
  title: React.ReactNode;
  content: React.ReactNode;
  children: React.ReactNode;
} & React.ComponentProps<typeof LargeDialog>) {
  const { setChecked } = useOath();
  return (
    <LargeDialog>
      <LargeDialogTrigger asChild {...props}>
        {children}
      </LargeDialogTrigger>
      <LargeDialogContent className="flex flex-col">
        <LargeDialogHeader>
          <LargeDialogTitle>
            <div className="flex justify-between items-center">
              {title}
              <LargeDialogClose asChild>
                <Button variant="secondary" className="size-9">
                  <Close className="size-5 text-grayscale-gray7" />
                </Button>
              </LargeDialogClose>
            </div>
          </LargeDialogTitle>
        </LargeDialogHeader>

        <div className="sm:py-5 sm:px-6 space-y-2 text-body-xs text-grayscale-gray5 overflow-auto px-padding py-4 flex-1">
          {content}
        </div>

        <LargeDialogFooter>
          <LargeDialogClose asChild>
            <Button
              className="py-2 px-4 text-sm leading-[140%] tracking-[-2%] w-18 text-white! rounded-[--spacing(1)]"
              onClick={() => {
                setChecked(true);
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
