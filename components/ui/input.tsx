import * as React from "react";
import { cn } from "@/lib/utils";

export interface InputProps
  extends React.InputHTMLAttributes<HTMLInputElement> {}

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, type, ...props }, ref) => {
    return (
      <input
        type={type}
        className={cn(
          "flex h-10 w-full rounded-md border bg-[#1a1a1a] px-3 py-2 text-sm text-[#e5e5e5] placeholder:text-[#666666] focus:outline-none focus:border-[#4a4a4a] disabled:cursor-not-allowed disabled:opacity-50 border-[#2a2a2a]",
          className
        )}
        ref={ref}
        {...props}
      />
    );
  }
);
Input.displayName = "Input";

export { Input };
