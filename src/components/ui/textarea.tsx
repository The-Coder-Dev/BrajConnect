import * as React from "react"

import { cn } from "@/lib/utils"

function Textarea({ className, ...props }: React.ComponentProps<"textarea">) {
  return (
    <textarea
      data-slot="textarea"
      className={cn(
        "flex min-h-[80px] w-full rounded-md border border-slate-200 bg-white px-3 py-2 text-base text-slate-900 shadow-sm transition-[color,box-shadow,background-color,border-color] duration-200 outline-none placeholder:text-slate-400 focus-visible:border-blue-500 focus-visible:ring-[3px] focus-visible:ring-blue-500/20 disabled:cursor-not-allowed disabled:opacity-50 aria-invalid:border-red-500 aria-invalid:bg-red-50/50 aria-invalid:ring-[3px] aria-invalid:ring-red-500/20 md:text-sm",
        className
      )}
      {...props}
    />
  )
}

export { Textarea }
