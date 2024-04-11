import * as D from "@radix-ui/react-dialog";
import { Dispatch, SetStateAction } from "react";

export default function Dialog({
  open,
  onOpenChange,
  trigger,
  children,
}: {
  open?: boolean;
  onOpenChange?: Dispatch<SetStateAction<boolean>>;
  trigger: React.ReactNode;
  children?: React.ReactNode;
}) {
  return (
    <D.Root open={open} onOpenChange={onOpenChange}>
      <D.Trigger asChild>{trigger}</D.Trigger>
      <D.Portal>
        <D.Overlay className="fixed inset-0 z-50 bg-[hsla(209,84%,5%,0.19)] data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0" />
        <D.Content className="!pointer-events-none fixed inset-0 z-50 flex max-h-screen items-center justify-center transition ease-in-out data-[state=closed]:duration-300 data-[state=open]:duration-500 data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:slide-out-to-right data-[state=open]:slide-in-from-right sm:data-[state=closed]:duration-200 sm:data-[state=open]:duration-200 sm:data-[state=closed]:fade-out-0 sm:data-[state=open]:fade-in-0 sm:data-[state=closed]:zoom-out-95 sm:data-[state=open]:zoom-in-95 sm:data-[state=closed]:slide-out-to-right-0 sm:data-[state=closed]:slide-out-to-top-[2%] sm:data-[state=open]:slide-in-from-right-0 sm:data-[state=open]:slide-in-from-top-[2%]">
          <div className="pointer-events-auto absolute inset-0 flex flex-col overflow-hidden bg-bg-0 shadow-md sm:static sm:h-fit sm:min-w-[350px] sm:max-w-md sm:rounded-20">
            {children}
          </div>
        </D.Content>
      </D.Portal>
    </D.Root>
  );
}
