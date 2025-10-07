import { Button } from "@/components/ui/button";
import { DialogTrigger } from "@/components/ui/dialog";
import {
  SimpleDialog,
  SimpleDialogClose,
  SimpleDialogContent,
  SimpleDialogDescription,
  SimpleDialogFooter,
  SimpleDialogHeader,
  SimpleDialogTitle,
  SimpleDialogTrigger,
} from "@/components/ui/simple-dialog";
import { ComponentProps } from "react";

export default function SendCodeDialogTrigger(
  props: ComponentProps<typeof DialogTrigger>
) {
  return (
    <SimpleDialog>
      <SimpleDialogTrigger {...props} />
      <SimpleDialogContent>
        <SimpleDialogHeader>
          <SimpleDialogTitle>카카오 계정으로 가입되어 있어요</SimpleDialogTitle>
          <SimpleDialogDescription>
            가입하신 수단으로 다시 로그인해 주세요.
          </SimpleDialogDescription>
        </SimpleDialogHeader>
        <SimpleDialogFooter>
          <SimpleDialogClose asChild>
            <Button className="col-span-2 py-3 px-4">확인</Button>
          </SimpleDialogClose>
        </SimpleDialogFooter>
      </SimpleDialogContent>
    </SimpleDialog>
  );
}
