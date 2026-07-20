import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"
import { cn } from "@/utils/shadcn"

export type IconVariants =
    | "add"
    | "arrow-back"
    | "arrow-breadcrumb"
    | "arrow-select"
    | "arrow-sort"
    | "cvs"
    | "delete"
    | "dots"
    | "employees"
    | "eye"
    | "languages"
    | "search"
    | "skills"
    | "upload"

const iconVariants = cva(
    "inline-block shrink-0 select-none fill-current text-current",
    {
        variants: {
            size: {
                xs: "size-3.5",
                sm: "size-4",
                md: "size-5",
                default: "size-6",
                xl: "size-8",
            },
        },
        defaultVariants: {
            size: "default",
        },
    }
)

export interface IconProps extends React.ComponentPropsWithRef<"svg"> {
    variant: IconVariants
    label?: string
}

function Icon({
    className,
    ref,
    variant,
    label,
    size = "default",
    ...props
}: IconProps & VariantProps<typeof iconVariants>) {
    return (
        <>
            <svg
                ref={ref}
                aria-hidden="true"
                className={cn(iconVariants({ size: size }), className)}
                {...props}
            >
                <use href={`/sprite.svg#${variant}`} />
            </svg>

            {
                label &&
                <span className="sr-only">
                    {label}
                </span>
            }
        </>
    )
}

Icon.displayName = "Icon"

export { Icon }
