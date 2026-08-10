"use client"

import * as React from "react"
import { Select, SelectContent, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Label } from "@/components/ui/label"
import { cn } from "@/utils/shadcn"

interface FloatingSelectProps extends React.ComponentProps<typeof Select> {
  label: string
  id?: string;
  placeholder?: string
  children?: React.ReactNode
  className?: string
}

export function FloatingSelect({
  label,
  placeholder = " ",
  id,
  children,
  className,
  value,
  ...props
}: FloatingSelectProps) {
  const selectId = id ?? React.useId();
  const safeValue = value ?? ""
  return (
    <div className="relative w-full border-none bg-transparent group/select">
      <Select  value={safeValue} {...props} id={selectId}>
        <SelectTrigger
          className={cn(
            "peer",
            className
          )}
        >
          <SelectValue placeholder={placeholder} />
        </SelectTrigger>
        <SelectContent>{children}</SelectContent>
      </Select>

      <Label
        htmlFor={selectId}
        className="
          absolute left-2 -top-2.5 z-10
            pointer-events-none transition-all duration-200 will-change-transform
          
          peer-data-placeholder:translate-y-5.5
          peer-data-placeholder:text-[16px]

          peer-data-placeholder:peer-focus:translate-y-0
          peer-data-placeholder:peer-focus:text-xs
          
          peer-data-popup-open:translate-y-0
          peer-data-popup-open:text-xs
          
          peer-focus:translate-y-0
          peer-focus:text-xs
          peer-focus:text-primary
        "
      >
        {label}
      </Label>
    </div>
  )
}
