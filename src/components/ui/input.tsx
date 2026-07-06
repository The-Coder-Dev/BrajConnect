import * as React from "react"
import { Input as InputPrimitive } from "@base-ui/react/input"

import { cn } from "@/lib/utils"

function Input({ className, type, ...props }: React.ComponentProps<"input">) {
  return (
    <InputPrimitive
      type={type}
      data-slot="input"
      className={cn(
        "h-9 w-full min-w-0 rounded-md border border-slate-200 bg-white px-3 py-1.5 text-base text-slate-900 shadow-sm transition-[color,box-shadow,background-color,border-color] duration-200 outline-none placeholder:text-slate-400 focus-visible:border-blue-500 focus-visible:ring-[3px] focus-visible:ring-blue-500/20 disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50 aria-invalid:border-red-500 aria-invalid:bg-red-50/50 aria-invalid:ring-[3px] aria-invalid:ring-red-500/20 md:text-sm",
        className
      )}
      {...props}
    />
  )
}

export { Input }
