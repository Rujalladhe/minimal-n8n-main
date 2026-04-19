import * as React from "react";
import { cn } from "@/lib/utils";

export interface TextareaProps
  extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {}

const Textarea = React.forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ className, ...props }, ref) => {
    return (
      <textarea
        className={cn(
          "flex min-h-[80px] w-full rounded-md border bg-[#1a1a1a] px-3 py-2 text-sm text-[#e5e5e5] placeholder:text-[#666666] focus:outline-none focus:border-[#4a4a4a] disabled:cursor-not-allowed disabled:opacity-50 border-[#2a2a2a]",
          className
        )}
        ref={ref}
        {...props}
      />
    );
  }
);
Textarea.displayName = "Textarea";

export { Textarea };
