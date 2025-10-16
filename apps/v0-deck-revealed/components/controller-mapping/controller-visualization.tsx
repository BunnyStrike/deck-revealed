"use client"

import type React from "react"

import { useEffect, useRef } from "react"
import { Card } from "@/components/ui/card"
import type { ControllerType, ControllerButton, GameAction } from "@/types/controller-mapping"

interface ControllerVisualizationProps {
  controllerType: ControllerType
  mappings: Record<ControllerButton, GameAction>
  highlightedButton: ControllerButton | null
  onSelectButton?: (button: ControllerButton) => void
}

export function ControllerVisualization({
  controllerType,
  mappings,
  highlightedButton,
  onSelectButton,
}: ControllerVisualizationProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  // Format action name for display
  const formatActionName = (action: GameAction): string => {
    return action
      .split("_")
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(" ")
  }

  // Draw the controller on the canvas
  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext("2d")
    if (!ctx) return

    // Clear the canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height)

    // Set up dimensions
    const width = canvas.width
    const height = canvas.height
    const centerX = width / 2
    const centerY = height / 2

    // Draw based on controller type
    if (controllerType === "xbox") {
      // Draw controller body
      ctx.fillStyle = "#1e1e1e"
      ctx.beginPath()
      ctx.ellipse(centerX, centerY, width * 0.4, height * 0.25, 0, 0, Math.PI * 2)
      ctx.fill()

      // Draw grips
      ctx.beginPath()
      ctx.ellipse(
        centerX - width * 0.3,
        centerY + height * 0.15,
        width * 0.1,
        height * 0.2,
        Math.PI / 4,
        0,
        Math.PI * 2,
      )
      ctx.fill()

      ctx.beginPath()
      ctx.ellipse(
        centerX + width * 0.3,
        centerY + height * 0.15,
        width * 0.1,
        height * 0.2,
        -Math.PI / 4,
        0,
        Math.PI * 2,
      )
      ctx.fill()

      // Draw left analog stick
      const leftStickX = centerX - width * 0.2
      const leftStickY = centerY

      ctx.fillStyle = highlightedButton?.includes("ls_") ? "#7c3aed" : "#333"
      ctx.beginPath()
      ctx.arc(leftStickX, leftStickY, width * 0.06, 0, Math.PI * 2)
      ctx.fill()

      // Draw right analog stick
      const rightStickX = centerX + width * 0.15
      const rightStickY = centerY + height * 0.1

      ctx.fillStyle = highlightedButton?.includes("rs_") ? "#7c3aed" : "#333"
      ctx.beginPath()
      ctx.arc(rightStickX, rightStickY, width * 0.06, 0, Math.PI * 2)
      ctx.fill()

      // Draw D-pad
      const dpadX = centerX - width * 0.15
      const dpadY = centerY + height * 0.1
      const dpadSize = width * 0.04

      // D-pad up
      ctx.fillStyle = highlightedButton === "dpad_up" ? "#7c3aed" : "#333"
      ctx.fillRect(dpadX - dpadSize / 2, dpadY - dpadSize * 2, dpadSize, dpadSize)

      // D-pad right
      ctx.fillStyle = highlightedButton === "dpad_right" ? "#7c3aed" : "#333"
      ctx.fillRect(dpadX + dpadSize / 2, dpadY - dpadSize / 2, dpadSize, dpadSize)

      // D-pad down
      ctx.fillStyle = highlightedButton === "dpad_down" ? "#7c3aed" : "#333"
      ctx.fillRect(dpadX - dpadSize / 2, dpadY + dpadSize, dpadSize, dpadSize)

      // D-pad left
      ctx.fillStyle = highlightedButton === "dpad_left" ? "#7c3aed" : "#333"
      ctx.fillRect(dpadX - dpadSize * 2, dpadY - dpadSize / 2, dpadSize, dpadSize)

      // Draw face buttons
      const faceButtonRadius = width * 0.025

      // A button
      ctx.fillStyle = highlightedButton === "a" ? "#7c3aed" : "#0f0"
      ctx.beginPath()
      ctx.arc(centerX + width * 0.25, centerY, faceButtonRadius, 0, Math.PI * 2)
      ctx.fill()

      // B button
      ctx.fillStyle = highlightedButton === "b" ? "#7c3aed" : "#f00"
      ctx.beginPath()
      ctx.arc(centerX + width * 0.3, centerY - height * 0.05, faceButtonRadius, 0, Math.PI * 2)
      ctx.fill()

      // X button
      ctx.fillStyle = highlightedButton === "x" ? "#7c3aed" : "#00f"
      ctx.beginPath()
      ctx.arc(centerX + width * 0.2, centerY - height * 0.05, faceButtonRadius, 0, Math.PI * 2)
      ctx.fill()

      // Y button
      ctx.fillStyle = highlightedButton === "y" ? "#7c3aed" : "#ff0"
      ctx.beginPath()
      ctx.arc(centerX + width * 0.25, centerY - height * 0.1, faceButtonRadius, 0, Math.PI * 2)
      ctx.fill()

      // Draw shoulder buttons
      const shoulderWidth = width * 0.1
      const shoulderHeight = height * 0.04

      // LB
      ctx.fillStyle = highlightedButton === "lb" ? "#7c3aed" : "#444"
      ctx.fillRect(centerX - width * 0.3, centerY - height * 0.2, shoulderWidth, shoulderHeight)

      // RB
      ctx.fillStyle = highlightedButton === "rb" ? "#7c3aed" : "#444"
      ctx.fillRect(centerX + width * 0.2, centerY - height * 0.2, shoulderWidth, shoulderHeight)

      // LT
      ctx.fillStyle = highlightedButton === "lt" ? "#7c3aed" : "#555"
      ctx.fillRect(centerX - width * 0.3, centerY - height * 0.25, shoulderWidth, shoulderHeight)

      // RT
      ctx.fillStyle = highlightedButton === "rt" ? "#7c3aed" : "#555"
      ctx.fillRect(centerX + width * 0.2, centerY - height * 0.25, shoulderWidth, shoulderHeight)

      // Draw center buttons
      const centerButtonRadius = width * 0.02

      // Start button
      ctx.fillStyle = highlightedButton === "start" ? "#7c3aed" : "#666"
      ctx.beginPath()
      ctx.arc(centerX + width * 0.05, centerY - height * 0.05, centerButtonRadius, 0, Math.PI * 2)
      ctx.fill()

      // Select button
      ctx.fillStyle = highlightedButton === "select" ? "#7c3aed" : "#666"
      ctx.beginPath()
      ctx.arc(centerX - width * 0.05, centerY - height * 0.05, centerButtonRadius, 0, Math.PI * 2)
      ctx.fill()

      // Guide button
      ctx.fillStyle = highlightedButton === "guide" ? "#7c3aed" : "#0f0"
      ctx.beginPath()
      ctx.arc(centerX, centerY - height * 0.05, centerButtonRadius * 1.5, 0, Math.PI * 2)
      ctx.fill()

      // Add labels for highlighted button
      if (highlightedButton) {
        ctx.fillStyle = "#fff"
        ctx.font = "14px Arial"
        ctx.textAlign = "center"
        ctx.fillText(formatActionName(mappings[highlightedButton] || "Unassigned"), centerX, height - 20)
      }
    } else if (controllerType === "playstation") {
      // Similar implementation for PlayStation controller
      // (Simplified for brevity)
      ctx.fillStyle = "#222"
      ctx.beginPath()
      ctx.ellipse(centerX, centerY, width * 0.4, height * 0.25, 0, 0, Math.PI * 2)
      ctx.fill()

      // Add text to indicate this is a placeholder
      ctx.fillStyle = "#fff"
      ctx.font = "16px Arial"
      ctx.textAlign = "center"
      ctx.fillText("PlayStation Controller", centerX, centerY)

      if (highlightedButton) {
        ctx.fillText(formatActionName(mappings[highlightedButton] || "Unassigned"), centerX, height - 20)
      }
    } else {
      // Generic controller placeholder
      ctx.fillStyle = "#333"
      ctx.beginPath()
      ctx.ellipse(centerX, centerY, width * 0.4, height * 0.25, 0, 0, Math.PI * 2)
      ctx.fill()

      // Add text to indicate this is a placeholder
      ctx.fillStyle = "#fff"
      ctx.font = "16px Arial"
      ctx.textAlign = "center"
      ctx.fillText(`${controllerType.charAt(0).toUpperCase() + controllerType.slice(1)} Controller`, centerX, centerY)

      if (highlightedButton) {
        ctx.fillText(formatActionName(mappings[highlightedButton] || "Unassigned"), centerX, height - 20)
      }
    }
  }, [controllerType, mappings, highlightedButton])

  // Handle canvas click to select a button
  const handleCanvasClick = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (!onSelectButton) return

    const canvas = canvasRef.current
    if (!canvas) return

    const rect = canvas.getBoundingClientRect()
    const x = e.clientX - rect.left
    const y = e.clientY - rect.top

    // Convert to canvas coordinates
    const canvasX = (x / rect.width) * canvas.width
    const canvasY = (y / rect.height) * canvas.height

    // Calculate center and dimensions
    const centerX = canvas.width / 2
    const centerY = canvas.height / 2

    // Check which button was clicked based on controller type
    if (controllerType === "xbox") {
      // Check face buttons
      const faceButtonRadius = canvas.width * 0.025

      // A button
      if (Math.hypot(canvasX - (centerX + canvas.width * 0.25), canvasY - centerY) < faceButtonRadius) {
        onSelectButton("a")
        return
      }

      // B button
      if (
        Math.hypot(canvasX - (centerX + canvas.width * 0.3), canvasY - (centerY - canvas.height * 0.05)) <
        faceButtonRadius
      ) {
        onSelectButton("b")
        return
      }

      // X button
      if (
        Math.hypot(canvasX - (centerX + canvas.width * 0.2), canvasY - (centerY - canvas.height * 0.05)) <
        faceButtonRadius
      ) {
        onSelectButton("x")
        return
      }

      // Y button
      if (
        Math.hypot(canvasX - (centerX + canvas.width * 0.25), canvasY - (centerY - canvas.height * 0.1)) <
        faceButtonRadius
      ) {
        onSelectButton("y")
        return
      }

      // Check analog sticks
      const stickRadius = canvas.width * 0.06

      // Left stick
      if (Math.hypot(canvasX - (centerX - canvas.width * 0.2), canvasY - centerY) < stickRadius) {
        onSelectButton("l3")
        return
      }

      // Right stick
      if (
        Math.hypot(canvasX - (centerX + canvas.width * 0.15), canvasY - (centerY + canvas.height * 0.1)) < stickRadius
      ) {
        onSelectButton("r3")
        return
      }

      // Check D-pad
      const dpadX = centerX - canvas.width * 0.15
      const dpadY = centerY + canvas.height * 0.1
      const dpadSize = canvas.width * 0.04

      // D-pad up
      if (
        canvasX >= dpadX - dpadSize / 2 &&
        canvasX <= dpadX + dpadSize / 2 &&
        canvasY >= dpadY - dpadSize * 2 &&
        canvasY <= dpadY - dpadSize
      ) {
        onSelectButton("dpad_up")
        return
      }

      // D-pad right
      if (
        canvasX >= dpadX + dpadSize / 2 &&
        canvasX <= dpadX + dpadSize * 1.5 &&
        canvasY >= dpadY - dpadSize / 2 &&
        canvasY <= dpadY + dpadSize / 2
      ) {
        onSelectButton("dpad_right")
        return
      }

      // D-pad down
      if (
        canvasX >= dpadX - dpadSize / 2 &&
        canvasX <= dpadX + dpadSize / 2 &&
        canvasY >= dpadY + dpadSize &&
        canvasY <= dpadY + dpadSize * 2
      ) {
        onSelectButton("dpad_down")
        return
      }

      // D-pad left
      if (
        canvasX >= dpadX - dpadSize * 2 &&
        canvasX <= dpadX - dpadSize / 2 &&
        canvasY >= dpadY - dpadSize / 2 &&
        canvasY <= dpadY + dpadSize / 2
      ) {
        onSelectButton("dpad_left")
        return
      }

      // Check shoulder buttons
      const shoulderWidth = canvas.width * 0.1
      const shoulderHeight = canvas.height * 0.04

      // LB
      if (
        canvasX >= centerX - canvas.width * 0.3 &&
        canvasX <= centerX - canvas.width * 0.3 + shoulderWidth &&
        canvasY >= centerY - canvas.height * 0.2 &&
        canvasY <= centerY - canvas.height * 0.2 + shoulderHeight
      ) {
        onSelectButton("lb")
        return
      }

      // RB
      if (
        canvasX >= centerX + canvas.width * 0.2 &&
        canvasX <= centerX + canvas.width * 0.2 + shoulderWidth &&
        canvasY >= centerY - canvas.height * 0.2 &&
        canvasY <= centerY - canvas.height * 0.2 + shoulderHeight
      ) {
        onSelectButton("rb")
        return
      }

      // LT
      if (
        canvasX >= centerX - canvas.width * 0.3 &&
        canvasX <= centerX - canvas.width * 0.3 + shoulderWidth &&
        canvasY >= centerY - canvas.height * 0.25 &&
        canvasY <= centerY - canvas.height * 0.25 + shoulderHeight
      ) {
        onSelectButton("lt")
        return
      }

      // RT
      if (
        canvasX >= centerX + canvas.width * 0.2 &&
        canvasX <= centerX + canvas.width * 0.2 + shoulderWidth &&
        canvasY >= centerY - canvas.height * 0.25 &&
        canvasY <= centerY - canvas.height * 0.25 + shoulderHeight
      ) {
        onSelectButton("rt")
        return
      }

      // Check center buttons
      const centerButtonRadius = canvas.width * 0.02

      // Start button
      if (
        Math.hypot(canvasX - (centerX + canvas.width * 0.05), canvasY - (centerY - canvas.height * 0.05)) <
        centerButtonRadius
      ) {
        onSelectButton("start")
        return
      }

      // Select button
      if (
        Math.hypot(canvasX - (centerX - canvas.width * 0.05), canvasY - (centerY - canvas.height * 0.05)) <
        centerButtonRadius
      ) {
        onSelectButton("select")
        return
      }

      // Guide button
      if (Math.hypot(canvasX - centerX, canvasY - (centerY - canvas.height * 0.05)) < centerButtonRadius * 1.5) {
        onSelectButton("guide")
        return
      }
    }
    // For other controller types, we would add similar hit detection
  }

  return (
    <Card className="p-4 bg-card border-border">
      <h3 className="font-medium mb-3 text-center">Controller Layout</h3>
      <canvas
        ref={canvasRef}
        width={500}
        height={300}
        className="w-full h-auto cursor-pointer"
        onClick={handleCanvasClick}
      />
      {highlightedButton && (
        <p className="text-center mt-2 text-sm">
          <span className="font-medium">{highlightedButton}</span> is mapped to{" "}
          <span className="text-primary font-medium">
            {formatActionName(mappings[highlightedButton] || "Unassigned")}
          </span>
        </p>
      )}
    </Card>
  )
}
