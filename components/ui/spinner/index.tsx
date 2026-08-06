import { cn } from "@/utils/shadcn"
import { Loader2Icon } from "lucide-react"

function Spinner({ className, ...props }: React.ComponentProps<"svg">) {
  return (
    <div className="flex-1 flex justify-center items-center">
      <Loader2Icon data-slot="spinner" role="status" aria-label="Loading" className={cn("size-12 animate-spin", className)} {...props} />
    </div>  
  )
}

export { Spinner }
