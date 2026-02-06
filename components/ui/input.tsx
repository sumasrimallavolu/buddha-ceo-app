import * as React from "react"

import { cn } from "@/lib/utils"

function Input({ className, type, ...props }: React.ComponentProps<"input">) {
  return (
    <input
      type={type}
      data-slot="input"
      className={cn(
        "file:text-foreground placeholder:text-slate-500 selection:bg-blue-500/30 selection:text-blue-400 border-input h-10 w-full min-w-0 rounded-xl border border-white/10 bg-white/5 px-4 py-2 text-base text-white shadow-sm transition-[color,box-shadow,box-shadow] outline-none file:inline-flex file:h-7 file:border-0 file:bg-transparent file:text-sm file:font-medium disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50 md:text-sm",
        "focus-visible:border-blue-500/50 focus-visible:ring-blue-500/20 focus-visible:ring-[3px] focus-visible:bg-white/10",
        "aria-invalid:ring-red-500/20 aria-invalid:border-red-500/50 hover:border-white/20 hover:bg-white/10",
        className
      )}
      {...props}
    />
  )
}

export { Input }
