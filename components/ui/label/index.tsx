"use client"

import * as React from "react"

import { cn } from "@/utils/shadcn"

function Label({ className, ...props }: React.ComponentProps<"label">) {
  return (
    <label
      data-slot="label"
      className={cn(
        "flex items-center bg-background p-1 gap-2 text-xs text-muted-foreground leading-none group-data-[disabled=true]:pointer-events-none group-data-[disabled=true]:bg-background peer-disabled:cursor-not-allowed",
        className
      )}
      {...props}
    />
  )
}

export { Label }
