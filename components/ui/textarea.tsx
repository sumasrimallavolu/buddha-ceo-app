import * as React from "react"

import { cn } from "@/lib/utils"

function Textarea({ className, ...props }: React.ComponentProps<"textarea">) {
  return (
    <textarea
      data-slot="textarea"
      className={cn(
        "border-input placeholder:text-slate-500 focus-visible:border-blue-500/50 focus-visible:ring-blue-500/20 aria-invalid:ring-red-500/20 aria-invalid:border-red-500/50 flex min-h-[80px] field-sizing-content w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-base text-white shadow-sm transition-[color,box-shadow] outline-none focus-visible:ring-[3px] focus-visible:bg-white/10 disabled:cursor-not-allowed disabled:opacity-50 resize-none md:text-sm",
        className
      )}
      {...props}
    />
  )
}

export { Textarea }
