"use client"

import { useFocusContext } from "@/components/ui/focus-provider"

export function useFocus(focusKey: string) {
  const { focusedKey, setFocus } = useFocusContext()

  const isFocused = focusedKey === focusKey

  return {
    isFocused,
    setFocus,
  }
}
