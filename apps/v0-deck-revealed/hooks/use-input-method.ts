"use client"

import { useState, useEffect } from "react"
import type { InputMethod } from "@/types/input-method"

export function useInputMethod() {
  const [inputMethod, setInputMethod] = useState<InputMethod>("mouse")

  useEffect(() => {
    // Detect initial input method
    const detectInitialInputMethod = () => {
      // Check if gamepad is connected
      if (navigator.getGamepads && navigator.getGamepads()[0]) {
        setInputMethod("gamepad")
        return
      }

      // Default to mouse
      setInputMethod("mouse")
    }

    // Listen for input method changes
    const handleKeyDown = () => {
      if (inputMethod !== "keyboard") {
        setInputMethod("keyboard")
      }
    }

    const handleMouseMove = () => {
      if (inputMethod !== "mouse") {
        setInputMethod("mouse")
      }
    }

    const handleGamepadConnected = () => {
      setInputMethod("gamepad")
    }

    const handleTouchStart = () => {
      setInputMethod("touch")
    }

    // Check for gamepad input periodically
    const checkGamepad = setInterval(() => {
      const gamepads = navigator.getGamepads ? navigator.getGamepads() : []
      if (gamepads[0] && inputMethod !== "gamepad") {
        setInputMethod("gamepad")
      }
    }, 1000)

    detectInitialInputMethod()

    window.addEventListener("keydown", handleKeyDown)
    window.addEventListener("mousemove", handleMouseMove)
    window.addEventListener("gamepadconnected", handleGamepadConnected)
    window.addEventListener("touchstart", handleTouchStart)

    return () => {
      window.removeEventListener("keydown", handleKeyDown)
      window.removeEventListener("mousemove", handleMouseMove)
      window.removeEventListener("gamepadconnected", handleGamepadConnected)
      window.removeEventListener("touchstart", handleTouchStart)
      clearInterval(checkGamepad)
    }
  }, [inputMethod])

  return { inputMethod }
}
