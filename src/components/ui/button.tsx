import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "@/lib/utils";

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-none text-xs font-mono uppercase tracking-widest cursor-pointer transition-all focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-[#00F0FF] disabled:pointer-events-none disabled:opacity-50 disabled:cursor-not-allowed [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0 border",
  {
    variants: {
      variant: {
        default: "bg-[#00F0FF] text-[#0F1115] border-[#00F0FF] hover:bg-[#00C8D6] hover:border-[#00C8D6] hover:shadow-[0_0_12px_rgba(0,240,255,0.5)]",
        destructive: "bg-[#FF3B3B] text-white border-[#FF3B3B] hover:bg-red-600 hover:border-red-600 hover:shadow-[0_0_12px_rgba(255,59,59,0.5)]",
        outline:
          "border-cafe-border bg-transparent text-[#E0E0E0] hover:border-[#00F0FF] hover:text-[#00F0FF] hover:shadow-[inset_0_0_8px_rgba(0,240,255,0.2)]",
        secondary: "bg-cafe-surface text-cafe-heading border-cafe-border hover:border-[#FFC857] hover:text-[#FFC857]",
        ghost: "border-transparent hover:bg-cafe-surface hover:text-[#00F0FF]",
        link: "border-transparent text-[#00F0FF] underline-offset-4 hover:underline",
      },
      size: {
        default: "h-9 px-4 py-2",
        sm: "h-8 px-3 text-[10px]",
        lg: "h-10 px-8",
        icon: "h-9 w-9",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  },
);

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>, VariantProps<typeof buttonVariants> {
  asChild?: boolean;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : "button";
    return (
      <Comp className={cn(buttonVariants({ variant, size, className }))} ref={ref} {...props} />
    );
  },
);
Button.displayName = "Button";

export { Button, buttonVariants };
