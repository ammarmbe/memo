import * as React from "react";
import { cva } from "class-variance-authority";
import { cn } from "@/lib/utils";
import Link from "next/link";
import { forwardRef } from "react";

const buttonVariants = cva(
  "flex items-center justify-center h-fit gap-0.5 disabled:!bg-bg-50 disabled:!text-text-300 disabled:!shadow-none disabled:!border-border-200 transition-all label-sm",
  {
    variants: {
      size: {
        md: "p-2.5 rounded-10",
        sm: "p-2 rounded-8",
        xs: "p-1.5 rounded-8",
        xxs: "p-1 rounded-8",
      },
      variant: {
        primary_filled:
          "bg-main-base border border-main-base hover:border-main-darker active:border-main-base text-white hover:bg-main-darker active:bg-main-base active:shadow-[0px_0px_0px_2px_white,0px_0px_0px_4px_#476CFF1A]",
        primary_stroke:
          "bg-white border border-main-base hover:border-main-10 active:border-main-base text-main-base hover:bg-main-10 active:bg-white active:shadow-[0px_0px_0px_2px_white,0px_0px_0px_4px_#476CFF1A]",
        neutral_filled:
          "bg-bg-950 border border-border-950 hover:border-bg-800 active:border-border-950 text-white hover:bg-bg-800 active:bg-bg-950 active:shadow-[0px_0px_0px_2px_white,0px_0px_0px_4px_#99A0AE29]",
        neutral_stroke:
          "bg-white border border-border-200 hover:border-bg-50 active:border-border-950 text-text-600 hover:bg-bg-50 hover:text-text-950 active:text-text-950 active:bg-white active:shadow-[0px_0px_0px_2px_white,0px_0px_0px_4px_#99A0AE29] shadow-[0px_1px_2px_0px_#0A0D1408] hover:shadow-none",
        error_filled:
          "bg-error-base border border-error-base hover:border-error-darker active:border-error-base text-white hover:bg-error-darker active:bg-error-base active:shadow-[0px_0px_0px_2px_white,0px_0px_0px_4px_#FB37481A]",
        error_stroke:
          "bg-white border border-error-base hover:border-error-10 active:border-error-base text-error-base hover:bg-error-10 active:bg-white active:shadow-[0px_0px_0px_2px_white,0px_0px_0px_4px_#FB37481A]",
      },
    },
    defaultVariants: {
      variant: "neutral_stroke",
      size: "md",
    },
  },
);

type ButtonOrLinkProps = (
  | (React.ButtonHTMLAttributes<HTMLButtonElement> & {
      href?: undefined;
    })
  | (React.AnchorHTMLAttributes<HTMLAnchorElement> & {
      href: string;
    })
) & {
  size: "md" | "sm" | "xs" | "xxs";
  variant:
    | "primary_filled"
    | "primary_stroke"
    | "neutral_filled"
    | "neutral_stroke"
    | "error_filled"
    | "error_stroke";
  text?: string;
  icon_left?: React.ReactNode;
  icon_right?: React.ReactNode;
};

const Button = forwardRef(function Button(
  props: ButtonOrLinkProps,
  ref: React.LegacyRef<HTMLAnchorElement> | React.LegacyRef<HTMLButtonElement>,
) {
  if (typeof props.href === "string") {
    return (
      <Link
        ref={ref as React.LegacyRef<HTMLAnchorElement>}
        {...props}
        className={cn(
          buttonVariants({
            size: props.size,
            variant: props.variant,
            className: props.className,
          }),
        )}
      >
        {props.icon_left}
        {props.text ? <span className="px-1">{props.text}</span> : null}
        {props.icon_right}
      </Link>
    );
  }

  return (
    <button
      ref={ref as React.LegacyRef<HTMLButtonElement>}
      {...props}
      type={props.type ?? "button"}
      className={cn(
        buttonVariants({
          size: props.size,
          variant: props.variant,
          className: props.className,
        }),
      )}
    >
      {props.icon_left}
      {props.text ? <span className="px-1">{props.text}</span> : null}
      {props.icon_right}
    </button>
  );
});

export default Button;
