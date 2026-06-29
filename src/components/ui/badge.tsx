import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "@/lib/utils";

const badgeVariants = cva(
  "inline-flex items-center rounded-none border-2 px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-[#1A1715] focus:ring-offset-2",
  {
    variants: {
      variant: {
        default:
          "border-[#1A1715] bg-[#1A1715] text-white hover:bg-transparent hover:text-[#1A1715]",
        secondary:
          "border-[#1A1715] bg-[#E5E2DA] text-[#1A1715] hover:bg-[#1A1715] hover:text-white",
        destructive:
          "border-destructive bg-destructive text-destructive-foreground hover:bg-destructive/80",
        outline: "border-[#1A1715] text-[#1A1715] bg-transparent",
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
