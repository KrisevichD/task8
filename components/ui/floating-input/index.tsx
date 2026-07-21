"use client"

import * as React from "react"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { cn } from "@/utils/shadcn"

export interface FloatingInputProps extends React.ComponentProps<typeof Input> {
  label: string
}

const FloatingInput = React.forwardRef<HTMLInputElement, FloatingInputProps>(
  ({ className, label, id, value, defaultValue, onChange, ...props }, ref) => {
    const [hasValue, setHasValue] = React.useState(
      Boolean(value) || Boolean(defaultValue)
    )

    React.useEffect(() => {
      setHasValue(Boolean(value) || Boolean(defaultValue))
    }, [value, defaultValue])

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      setHasValue(e.target.value.length > 0)
      if (onChange) onChange(e) 
    }

    return (
      <div className="relative w-full border-none bg-transparent">
        <Input
          id={id}
          ref={ref}
          value={value}
          defaultValue={defaultValue}
          onChange={handleInputChange}
          placeholder=" " 
          className={cn(
            "peer w-full",
            className
          )}
          {...props}
        />
        <Label
          htmlFor={id}
          className={cn(
            `absolute left-2 -top-2.5 z-10 
            pointer-events-none transition-all duration-200 will-change-transform
            
            peer-focus:translate-y-0
            peer-focus:text-xs
            peer-focus:pointer-events-auto
            px-1 bg-[#444444]
            
            peer-placeholder-shown:translate-y-5.5
            peer-placeholder-shown:text-[16px]`,
            
            hasValue && "translate-y-0 pointer-events-auto"
          )}
        >
          {label}
        </Label>
      </div>
    )
  }
)
FloatingInput.displayName = "FloatingInput"

export { FloatingInput }
