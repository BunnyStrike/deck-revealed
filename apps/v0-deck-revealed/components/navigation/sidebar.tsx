"use client"

import { Home, Library, ShoppingBag, Users, Settings } from "lucide-react"
import { FocusableItem } from "@/components/ui/focusable-item"
import type { InputMethod } from "@/types/input-method"

interface SidebarProps {
  activeView: string
  setActiveView: (view: string) => void
  inputMethod: InputMethod
}

export function Sidebar({ activeView, setActiveView, inputMethod }: SidebarProps) {
  const navItems = [
    { id: "dashboard", label: "Dashboard", icon: Home },
    { id: "library", label: "Library", icon: Library },
    { id: "store", label: "Store", icon: ShoppingBag },
    { id: "friends", label: "Friends", icon: Users },
    { id: "settings", label: "Settings", icon: Settings },
  ]

  return (
    <div className="w-64 bg-card/80 backdrop-blur-sm border-r border-border p-4 flex flex-col">
      <div className="mb-8">
        <h1 className="text-xl font-bold gradient-text">Game Hub</h1>
      </div>

      <nav className="space-y-2">
        {navItems.map((item) => {
          const Icon = item.icon
          const isActive = activeView === item.id
          return (
            <FocusableItem
              key={item.id}
              active={isActive}
              onClick={() => setActiveView(item.id)}
              className={`flex items-center gap-3 p-3 rounded-lg transition-all duration-200 ${
                isActive
                  ? "bg-gradient-to-r from-primary/90 to-primary/70 text-white shadow-lg shadow-primary/20"
                  : "text-muted-foreground hover:bg-muted hover:text-foreground"
              }`}
              focusKey={`nav-${item.id}`}
              gamepadHint={getGamepadHint(item.id)}
            >
              <div className={`${isActive ? "animate-pulse-slow" : ""}`}>
                <Icon className="w-5 h-5" />
              </div>
              <span className="font-medium">{item.label}</span>
            </FocusableItem>
          )
        })}
      </nav>

      <div className="mt-auto">
        <div className="glass rounded-lg p-3 text-sm text-muted-foreground">
          {inputMethod === "gamepad" && (
            <p className="flex items-center gap-2">
              <span className="bg-muted rounded-md px-2 py-1 text-xs font-medium">LB/RB</span>
              <span>Navigate sections</span>
            </p>
          )}
        </div>
      </div>
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
