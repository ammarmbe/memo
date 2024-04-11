import * as React from "react";
import { cva } from "class-variance-authority";
import { cn } from "@/lib/utils";
import { LegacyRef, forwardRef } from "react";

const buttonVariants = cva(
  "peer pg-sm flex items-center h-fit justify-center gap-0.5 disabled:bg-bg-50 disabled:text-text-300 transition-all pg-sm bg-white border border-border-200 hover:border-bg-50 focus:border-border-950 hover:bg-bg-50 placeholder:text-text-400 placeholder:transition-all hover:placeholder:text-text-600 focus:placeholder:text-text-600 focus:bg-white focus:shadow-[0px_0px_0px_2px_white,0px_0px_0px_4px_#99A0AE29] shadow-xs hover:shadow-none data-[invalid=true]:border-error-base data-[invalid=true]:focus:shadow-[0px_0px_0px_2px_white,0px_0px_0px_4px_#FB37481A] w-full",
  {
    variants: {
      size: {
        md: "p-2.5 rounded-10",
        sm: "p-2 rounded-8",
        xs: "p-1.5 rounded-8",
      },
      icon_side: {
        left_md: "pl-10",
        left_sm: "pl-[2.375rem]",
        left_xs: "pl-[2.125rem]",
        right_md: "pr-10",
        right_sm: "pr-[2.375rem]",
        right_xs: "pr-[2.125rem]",
      },
    },
    defaultVariants: {
      size: "md",
    },
  },
);

type InputOrTextareaProps = (
  | (Omit<React.InputHTMLAttributes<HTMLInputElement>, "size"> & {
      href?: undefined;
    })
  | (React.TextareaHTMLAttributes<HTMLTextAreaElement> & {
      href: string;
    })
) & {
  size: "md" | "sm" | "xs";
  icon_side?: "left" | "right";
  icon?: React.ReactNode;
  error?: any;
  error_message?: string;
  label?: string;
  grow?: boolean;
};

const Input = forwardRef(function Input(
  props: InputOrTextareaProps,
  ref: LegacyRef<HTMLTextAreaElement> | LegacyRef<HTMLInputElement>,
) {
  const {
    size,
    icon_side,
    icon,
    error,
    error_message,
    className,
    label,
    grow,
    ...rest
  } = props;

  return (
    <div className={`flex flex-col gap-1 ${grow ? "flex-grow" : ""}`}>
      {label ? (
        <label htmlFor={label} className="label-sm">
          {label}
        </label>
      ) : null}
      <div className="relative">
        {typeof rest.href === "string" ? (
          <textarea
            ref={ref as LegacyRef<HTMLTextAreaElement>}
            {...rest}
            id={label}
            data-invalid={error ? "true" : "false"}
            className={cn(
              buttonVariants({
                size: size,
                className: className,
                icon_side: icon
                  ? (((icon_side ?? "left") + "_" + (size ?? "md")) as
                      | "left_md"
                      | "left_sm"
                      | "left_xs"
                      | "right_md"
                      | "right_sm"
                      | "right_xs")
                  : null,
              }),
            )}
          />
        ) : (
          <input
            ref={ref as LegacyRef<HTMLInputElement>}
            {...rest}
            id={label}
            data-invalid={error ? "true" : "false"}
            className={cn(
              buttonVariants({
                size: size,
                className: className,
                icon_side: icon
                  ? (((icon_side ?? "left") + "_" + (size ?? "md")) as
                      | "left_md"
                      | "left_sm"
                      | "left_xs"
                      | "right_md"
                      | "right_sm"
                      | "right_xs")
                  : null,
              }),
            )}
          />
        )}
        <div
          className={`absolute flex text-text-600 transition-all peer-empty:text-text-400 peer-empty:peer-hover:text-text-600 peer-empty:peer-focus:text-text-600
          ${
            icon_side === "right"
              ? size === "md"
                ? "right-3 top-2.5"
                : size === "sm"
                  ? "right-2.5 top-2"
                  : "right-2 top-1.5"
              : size === "md"
                ? "left-3 top-2.5"
                : size === "sm"
                  ? "left-2.5 top-2"
                  : "left-2 top-1.5"
          }`}
        >
          {icon}
        </div>
      </div>
      {error && error_message ? (
        <div className="pg-xs text-error-base">{error_message}</div>
      ) : null}
    </div>
  );
});

export default Input;
