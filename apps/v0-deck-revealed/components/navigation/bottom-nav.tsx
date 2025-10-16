"use client"

import { Home, Library, ShoppingBag, Users, Settings } from "lucide-react"
import { FocusableItem } from "@/components/ui/focusable-item"
import type { InputMethod } from "@/types/input-method"

interface BottomNavProps {
  activeView: string
  setActiveView: (view: string) => void
  inputMethod: InputMethod
}

export function BottomNav({ activeView, setActiveView, inputMethod }: BottomNavProps) {
  const navItems = [
    { id: "dashboard", label: "Home", icon: Home },
    { id: "library", label: "Library", icon: Library },
    { id: "store", label: "Store", icon: ShoppingBag },
    { id: "friends", label: "Friends", icon: Users },
    { id: "settings", label: "Settings", icon: Settings },
  ]

  return (
    <div className="bg-card/80 backdrop-blur-sm border-t border-border p-2 flex justify-around">
      {navItems.map((item) => {
        const Icon = item.icon
        const isActive = activeView === item.id
        return (
          <FocusableItem
            key={item.id}
            active={isActive}
            onClick={() => setActiveView(item.id)}
            className={`flex flex-col items-center p-2 rounded-lg transition-all duration-200 ${
              isActive ? "text-primary" : "text-muted-foreground hover:text-foreground"
            }`}
            focusKey={`bottom-nav-${item.id}`}
            gamepadHint={getGamepadHint(item.id)}
          >
            <div
              className={`relative ${isActive ? "after:absolute after:inset-0 after:animate-ping after:rounded-full after:bg-primary/30 after:opacity-75" : ""}`}
            >
              <Icon className={`w-6 h-6 ${isActive ? "text-primary" : ""}`} />
            </div>
            <span className={`text-xs mt-1 font-medium ${isActive ? "text-foreground" : ""}`}>{item.label}</span>
            {isActive && <div className="h-1 w-10 bg-primary rounded-full mt-1"></div>}
          </FocusableItem>
        )
      })}
    </div>
  )
}

function getGamepadHint(id: string): string {
  switch (id) {
    case "dashboard":
      return "Y"
    case "library":
      return "X"
    case "store":
      return "A"
    case "friends":
      return "B"
    case "settings":
      return "⚙️"
    default:
      return ""
  }
}
