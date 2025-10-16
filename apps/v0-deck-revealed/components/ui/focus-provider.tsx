"use client"

import { createContext, useContext, useState, type ReactNode, useEffect } from "react"
import type { InputMethod } from "@/types/input-method"

interface FocusContextType {
  focusedKey: string | null
  setFocus: (key: string) => void
  navigateUp: () => void
  navigateDown: () => void
  navigateLeft: () => void
  navigateRight: () => void
}

const FocusContext = createContext<FocusContextType>({
  focusedKey: null,
  setFocus: () => {},
  navigateUp: () => {},
  navigateDown: () => {},
  navigateLeft: () => {},
  navigateRight: () => {},
})

export const useFocusContext = () => useContext(FocusContext)

interface FocusProviderProps {
  children: ReactNode
  inputMethod: InputMethod
}

export function FocusProvider({ children, inputMethod }: FocusProviderProps) {
  const [focusedKey, setFocusedKey] = useState<string | null>("nav-dashboard")

  // Navigation map - this would be more complex in a real app
  const navigationMap: Record<string, { up?: string; down?: string; left?: string; right?: string }> = {
    "nav-dashboard": { down: "nav-library", right: "search" },
    "nav-library": { up: "nav-dashboard", down: "nav-store" },
    "nav-store": { up: "nav-library", down: "nav-friends" },
    "nav-friends": { up: "nav-store", down: "nav-settings" },
    "nav-settings": { up: "nav-friends" },
    search: { left: "nav-dashboard", right: "wifi" },
    wifi: { left: "search", right: "volume" },
    volume: { left: "wifi", right: "battery" },
    battery: { left: "volume" },
  }

  const setFocus = (key: string) => {
    setFocusedKey(key)
  }

  const navigateDirection = (direction: "up" | "down" | "left" | "right") => {
    if (!focusedKey) return

    const nextKey = navigationMap[focusedKey]?.[direction]
    if (nextKey) {
      setFocusedKey(nextKey)
    }
  }

  const navigateUp = () => navigateDirection("up")
  const navigateDown = () => navigateDirection("down")
  const navigateLeft = () => navigateDirection("left")
  const navigateRight = () => navigateDirection("right")

  // Handle gamepad input
  useEffect(() => {
    if (inputMethod !== "gamepad") return

    const handleGamepadInput = () => {
      // This would connect to the gamepad API in a real implementation
      // For now, we'll just use keyboard arrows to simulate gamepad
      const handleKeyDown = (e: KeyboardEvent) => {
        switch (e.key) {
          case "ArrowUp":
            navigateUp()
            break
          case "ArrowDown":
            navigateDown()
            break
          case "ArrowLeft":
            navigateLeft()
            break
          case "ArrowRight":
            navigateRight()
            break
        }
      }

      window.addEventListener("keydown", handleKeyDown)
      return () => window.removeEventListener("keydown", handleKeyDown)
    }

    const cleanup = handleGamepadInput()
    return cleanup
  }, [inputMethod, focusedKey])

  return (
    <FocusContext.Provider
      value={{
        focusedKey,
        setFocus,
        navigateUp,
        navigateDown,
        navigateLeft,
        navigateRight,
      }}
    >
      {children}
    </FocusContext.Provider>
  )
}
