import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "@/lib/utils";

const badgeVariants = cva(
  "inline-flex items-center rounded-none border px-2 py-0.5 text-[10px] font-mono uppercase tracking-widest transition-colors focus:outline-none focus:ring-1 focus:ring-[#00F0FF]",
  {
    variants: {
      variant: {
        default: "border-[#00F0FF]/40 bg-[#00F0FF]/10 text-[#00F0FF]",
        secondary:
          "border-[#FFC857]/40 bg-[#FFC857]/10 text-[#FFC857]",
        destructive:
          "border-red-500/45 bg-red-500/10 text-red-400",
        outline: "text-[#E0E0E0] border-cafe-border",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  },
);

export interface BadgeProps
  extends React.HTMLAttributes<HTMLDivElement>, VariantProps<typeof badgeVariants> {}

function Badge({ className, variant, ...props }: BadgeProps) {
  return <div className={cn(badgeVariants({ variant }), className)} {...props} />;
}

export { Badge, badgeVariants };
