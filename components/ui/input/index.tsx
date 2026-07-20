import * as React from "react"
import { Input as InputPrimitive } from "@base-ui/react/input"

import { cn } from "@/utils/shadcn"
import { cva, type VariantProps } from "class-variance-authority";

export const inputVariants = cva(
  "h-12 w-full dark:text-foreground rounded-none border text-sm border-input/23 px-3 py-3 transition-colors outline-none file:inline-flex file:h-6 file:border-0 file:bg-transparent file:text-xs file:font-medium file:text-foreground placeholder:text-input/60 focus-visible:border-ring focus-visible:ring-1 focus-visible:ring-ring/50 disabled:pointer-events-none disabled:cursor-not-allowed disabled:bg-input/16 disabled:opacity-50 aria-invalid:border-destructive aria-invalid:ring-1 aria-invalid:ring-destructive/20 md:text-xs dark:disabled:bg-muted/80 dark:aria-invalid:border-destructive/50 dark:aria-invalid:ring-destructive/40",
  {
    variants: {
      variant: {
        default: "",
        search: "rounded-full pl-3 h-10",
      }
    },
    defaultVariants: {
      variant: "default",
    },
  },
);

function Input({ className, type, variant, ...props }: React.ComponentProps<"input"> & VariantProps<typeof inputVariants>) {
  return (
    <InputPrimitive
      type={type}
      data-slot="input"
      className={cn(
        inputVariants({ variant, className})
      )}
      {...props}
    />
  )
}

export { Input }
