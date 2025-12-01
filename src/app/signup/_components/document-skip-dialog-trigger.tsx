import { Button } from "@/components/ui/button";
import { DialogDescription } from "@/components/ui/dialog";
import {
  SimpleDialog,
  SimpleDialogClose,
  SimpleDialogContent,
  SimpleDialogFooter,
  SimpleDialogHeader,
  SimpleDialogTitle,
  SimpleDialogTrigger,
} from "@/components/ui/simple-dialog";
import useSignupFormStore from "@/stores/signup-form-store";
import * as DialogPrimitive from "@radix-ui/react-dialog";
import React from "react";
export default function DocumentSkipDialogTrigger(
  props: React.ComponentProps<typeof DialogPrimitive.Trigger>
) {
  const nextFlowIndex = useSignupFormStore((e) => e.nextFlowIndex);
  return (
    <SimpleDialog>
      <SimpleDialogTrigger {...props} />
      <SimpleDialogContent className="px-4 pt-8 pb-5">
        <SimpleDialogHeader>
          <SimpleDialogTitle>
            아직 서류가 준비되지 않으셨나요?
          </SimpleDialogTitle>
          <DialogDescription className="text-balance break-keep">
            서류는 나중에 제출해도 괜찮아요. 브리더 입점 심사는 제출 후
            진행됩니다.
          </DialogDescription>
        </SimpleDialogHeader>

        <SimpleDialogFooter>
          <SimpleDialogClose asChild>
            <Button className="px-4 py-3 text-body-s font-semibold bg-secondary-500 text-primary-500 hover:bg-secondary-500 hover:text-primary-500">
              이어서 작성
            </Button>
          </SimpleDialogClose>
          <SimpleDialogClose asChild>
            <Button
              className="px-4 py-3 text-body-s font-semibold bg-primary-500 text-secondary-500 hover:bg-primary-500 hover:text-secondary-500"
              onClick={() => {
                nextFlowIndex();
              }}
            >
              나중에 제출
            </Button>
          </SimpleDialogClose>
        </SimpleDialogFooter>
      </SimpleDialogContent>
    </SimpleDialog>
  );
}
