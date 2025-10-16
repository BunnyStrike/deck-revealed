"use client"

import { type ReactNode, useRef, useEffect } from "react"
import { useFocus } from "@/hooks/use-focus"
import { cn } from "@/lib/utils"

interface FocusableItemProps {
  children: ReactNode
  className?: string
  active?: boolean
  onClick?: () => void
  focusKey: string
  gamepadHint?: string
}

export function FocusableItem({
  children,
  className,
  active = false,
  onClick,
  focusKey,
  gamepadHint,
}: FocusableItemProps) {
  const ref = useRef<HTMLDivElement>(null)
  const { isFocused, setFocus } = useFocus(focusKey)

  // Handle focus when active changes
  useEffect(() => {
    if (active && !isFocused) {
      setFocus(focusKey)
    }
  }, [active, isFocused, setFocus, focusKey])

  return (
    <div
      ref={ref}
      className={cn("relative transition-all duration-200", isFocused && "neon-border", className)}
      onClick={() => {
        setFocus(focusKey)
        onClick?.()
      }}
      tabIndex={0}
      onKeyDown={(e) => {
        if (e.key === "Enter" || e.key === " ") {
          onClick?.()
        }
      }}
    >
      {children}

      {gamepadHint && (
        <div className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-muted text-foreground text-xs font-bold w-5 h-5 flex items-center justify-center rounded-full">
          {gamepadHint}
        </div>
      )}
    </div>
  )
}
