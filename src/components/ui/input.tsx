import * as React from "react";

import { cn } from "@/lib/utils";

const Input = React.forwardRef<HTMLInputElement, React.ComponentProps<"input">>(
  ({ className, type, ...props }, ref) => {
    return (
      <input
        type={type}
        className={cn(
          "flex h-9 w-full rounded-none border border-cafe-border bg-transparent px-3 py-1 text-sm font-mono text-[#E0E0E0] placeholder:text-cafe-muted transition-all focus-visible:outline-none focus-visible:border-[#00F0FF] focus-visible:shadow-[inset_0_0_8px_rgba(0,240,255,0.2)] disabled:cursor-not-allowed disabled:opacity-50",
          className,
        )}
        ref={ref}
        {...props}
      />
    );
  },
);
Input.displayName = "Input";

export { Input };
