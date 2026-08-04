"use client";

import * as React from "react";

import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { cn } from "@/utils/shadcn";

interface FloatingSelectProps extends Omit<
  React.ComponentProps<typeof Select>,
  "onValueChange"
> {
  label: string;
  placeholder?: string;
  displayValue?: React.ReactNode;
  children: React.ReactNode;
  className?: string;
  onValueChange?: (value: string) => void;
}

export function FloatingSelect({
  label,
  placeholder,
  displayValue,
  children,
  className,
  value,
  onValueChange,
  ...props
}: FloatingSelectProps) {
  const safeValue = value ?? "";
  const hasValue = Boolean(safeValue);

  const handleValueChange = (val: unknown) => {
    if (typeof val === "string") {
      onValueChange?.(val);
    }
  };

  return (
    <div className="relative w-full border-none bg-transparent group/select">
      <Select value={safeValue} onValueChange={handleValueChange} {...props}>
        <SelectTrigger
          className={cn(
            "peer h-16 text-lg font-normal px-4 pt-3 text-foreground flex items-center [&>span]:!text-lg [&>span]:!font-normal",
            className,
          )}
        >
          <SelectValue placeholder={placeholder}>
            {displayValue || undefined}
          </SelectValue>
        </SelectTrigger>

        <SelectContent
          side="bottom"
          sideOffset={6}
          alignItemWithTrigger={false}
        >
          {children}
        </SelectContent>
      </Select>

      <Label
        className={cn(
          "absolute left-3 z-10 pointer-events-none transition-all duration-200 bg-background px-1 text-muted-foreground",
          hasValue
            ? "-top-2.5 text-sm text-primary"
            : "top-4.5 text-lg peer-focus:-top-2.5 peer-focus:text-sm peer-focus:text-primary peer-data-popup-open:-top-2.5 peer-data-popup-open:text-sm",
        )}
      >
        {label}
      </Label>
    </div>
  );
}
