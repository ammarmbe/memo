"use client";
import * as Toast from "@radix-ui/react-toast";
import { useToast } from "@/components/primitives/toast/use-toast";
import {
  Wand2,
  X,
  Info,
  CheckCircle2,
  AlertOctagon,
  AlertCircle,
} from "lucide-react";

const styles = {
  size: {
    sm: "p-2 rounded-8 flex gap-2",
    md: "p-3.5 rounded-12 flex gap-3",
  },
  color: {
    red: {
      high: "bg-[#DF1C41] text-white",
      medium: "bg-[#F8C9D2] text-[#710E21]",
      low: "bg-[#FDEDF0]",
      white: "bg-bg-0 border shadow-md",
    },
    orange: {
      high: "bg-[#F17B2B] text-white",
      medium: "bg-[#FFDAC2] text-[#6E330C]",
      low: "bg-[#FEF3EB]",
      white: "bg-bg-0 border shadow-md",
    },
    green: {
      high: "bg-[#38C793] text-white",
      medium: "bg-[#CBF5E5] text-[#176448]",
      low: "bg-[#EFFAF6]",
      white: "bg-bg-0 border shadow-md",
    },
    blue: {
      high: "bg-[#375DFB] text-white",
      medium: "bg-[#C2D6FF] text-[#162664]",
      low: "bg-[#EBF1FF]",
      white: "bg-bg-0 border shadow-md",
    },
    black: {
      high: "bg-[#20232D] text-white",
      medium: "bg-[#E2E4E9] text-[#0A0D14]",
      low: "bg-[#F6F8FA]",
      white: "bg-bg-0 border shadow-md",
    },
  },
  icon: {
    red: {
      icon: <AlertCircle size={20} />,
      high: "text-white",
      medium: "text-[#710E21]",
      low: "text-[#DF1C41]",
      white: "text-[#DF1C41]",
    },
    orange: {
      icon: <AlertOctagon size={20} />,
      high: "text-white",
      medium: "text-[#6E330C]",
      low: "text-[#F17B2C]",
      white: "text-[#F17B2C]",
    },
    green: {
      icon: <CheckCircle2 size={20} />,
      high: "text-white",
      medium: "text-[#176448]",
      low: "text-[#38C793]",
      white: "text-[#38C793]",
    },
    blue: {
      icon: <Info size={20} />,
      high: "text-white",
      medium: "text-[#162664]",
      low: "text-[#375DFB]",
      white: "text-[#375DFB]",
    },
    black: {
      icon: <Wand2 size={20} />,
      high: "text-white",
      medium: "text-[#0A0D14]",
      low: "text-[#868C98]",
      white: "text-[#868C98]",
    },
  },
};

export function Toaster() {
  const { toasts } = useToast();

  return (
    <Toast.ToastProvider>
      <Toast.ToastViewport className="pointer-events-none fixed inset-0 z-[100] flex items-end p-5 has-[>[data-position='right']]:justify-end has-[>[data-position='center']]:justify-center">
        {toasts.map(function ({
          id,
          size,
          color,
          saturation,
          position,
          noIcon,
          title,
          body,
          ...props
        }) {
          return (
            <Toast.Root data-position={position} key={id} {...props} asChild>
              <div
                className={`pointer-events-auto min-w-[300px] transition-all data-[swipe=move]:transition-none data-[state=open]:animate-in data-[state=closed]:animate-out data-[swipe=end]:animate-out data-[state=closed]:fade-out-80 data-[state=open]:slide-in-from-top-full data-[state=open]:sm:slide-in-from-bottom-full ${position === "center" ? "data-[swipe=cancel]:translate-y-0 data-[swipe=end]:translate-y-[var(--radix-toast-swipe-end-x)] data-[swipe=move]:translate-y-[var(--radix-toast-swipe-move-x)] data-[state=closed]:slide-out-to-bottom-full" : "data-[swipe=cancel]:translate-x-0 data-[swipe=end]:translate-x-[var(--radix-toast-swipe-end-x)] data-[swipe=move]:translate-x-[var(--radix-toast-swipe-move-x)] data-[state=closed]:slide-out-to-right-full"} ${styles.size[size]} ${styles.color[color][saturation]}`}
              >
                {noIcon ? null : (
                  <div className={styles.icon[color][saturation]}>
                    {styles.icon[color].icon}
                  </div>
                )}
                <p className="pg-sm flex-grow">{title}</p>
                <Toast.Close>
                  <X size={20} />
                </Toast.Close>
              </div>
            </Toast.Root>
          );
        })}
      </Toast.ToastViewport>
    </Toast.ToastProvider>
  );
}
