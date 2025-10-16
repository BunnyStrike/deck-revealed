"use client"

import { useState, useEffect } from "react"
import { FocusableItem } from "@/components/ui/focusable-item"
import { Card } from "@/components/ui/card"
import { Gamepad, RotateCcw, Play, AlertCircle, ArrowRight, Search, X } from "lucide-react"
import type { ControllerProfile, ControllerButton, GameAction } from "@/types/controller-mapping"

interface MappingEditorProps {
  profile: ControllerProfile
  isListening: boolean
  lastButtonPressed: ControllerButton | null
  onUpdateMapping: (profileId: string, action: GameAction, button: ControllerButton) => void
  onListenForButton: (action: GameAction, callback: (button: ControllerButton) => void) => void
  onStopListening: () => void
  onTestMapping: (profileId: string) => void
}

export function MappingEditor({
  profile,
  isListening,
  lastButtonPressed,
  onUpdateMapping,
  onListenForButton,
  onStopListening,
  onTestMapping,
}: MappingEditorProps) {
  const [searchTerm, setSearchTerm] = useState("")
  const [activeTab, setActiveTab] = useState<"all" | "movement" | "actions" | "menu">("all")
  const [listeningAction, setListeningAction] = useState<GameAction | null>(null)
  const [showTestMode, setShowTestMode] = useState(false)

  // Get the default mapping from the profile
  const mapping = profile.mappings[0]?.mappings || {}

  // Create a reverse mapping (button -> action)
  const reverseMapping: Record<ControllerButton, GameAction> = {}
  Object.entries(mapping).forEach(([button, action]) => {
    reverseMapping[button as ControllerButton] = action
  })

  // Group actions by category
  const actionGroups = {
    movement: [
      "move_up",
      "move_down",
      "move_left",
      "move_right",
      "camera_up",
      "camera_down",
      "camera_left",
      "camera_right",
      "sprint",
      "crouch",
      "jump",
    ],
    actions: [
      "attack",
      "defend",
      "interact",
      "aim",
      "shoot",
      "reload",
      "switch_weapon",
      "use_item",
      "inventory",
      "map",
    ],
    menu: ["menu_up", "menu_down", "menu_left", "menu_right", "menu_select", "menu_back", "menu_start", "pause"],
  }

  // Filter actions based on search term and active tab
  const getFilteredActions = () => {
    let actions = Object.keys(mapping) as GameAction[]

    // Filter by tab
    if (activeTab !== "all") {
      actions = actions.filter((action) => actionGroups[activeTab].includes(action))
    }

    // Filter by search term
    if (searchTerm) {
      actions = actions.filter((action) => action.toLowerCase().includes(searchTerm.toLowerCase()))
    }

    return actions
  }

  const filteredActions = getFilteredActions()

  // Handle button assignment
  const handleAssignButton = (action: GameAction) => {
    setListeningAction(action)
    onListenForButton(action, (button) => {
      onUpdateMapping(profile.id, action, button)
      setListeningAction(null)
    })
  }

  // Get the button assigned to an action
  const getAssignedButton = (action: GameAction): ControllerButton | null => {
    for (const [button, mappedAction] of Object.entries(mapping)) {
      if (mappedAction === action) {
        return button as ControllerButton
      }
    }
    return null
  }

  // Format button name for display
  const formatButtonName = (button: ControllerButton | null): string => {
    if (!button) return "Unassigned"

    // Replace underscores with spaces and capitalize
    return button
      .split("_")
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(" ")
  }

  // Format action name for display
  const formatActionName = (action: GameAction): string => {
    // Replace underscores with spaces and capitalize
    return action
      .split("_")
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(" ")
  }

  // Cancel listening if component unmounts
  useEffect(() => {
    return () => {
      if (isListening) {
        onStopListening()
      }
    }
  }, [isListening, onStopListening])

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-semibold flex items-center">
          <Gamepad className="mr-2" size={20} />
          Button Mapping
        </h2>
        <div className="flex space-x-2">
          <FocusableItem
            focusKey="test-mapping"
            className={`p-2 rounded-lg transition-colors ${
              showTestMode ? "bg-primary/20 text-primary" : "bg-muted/30 hover:bg-muted/50"
            }`}
            onClick={() => {
              setShowTestMode(!showTestMode)
              if (!showTestMode) {
                onTestMapping(profile.id)
              }
            }}
          >
            <Play size={18} />
          </FocusableItem>
          <FocusableItem
            focusKey="reset-mapping"
            className="p-2 rounded-lg bg-muted/30 hover:bg-muted/50 transition-colors"
            onClick={() => {
              // This would reset to default in a real implementation
              alert("Reset to default mappings")
            }}
          >
            <RotateCcw size={18} />
          </FocusableItem>
        </div>
      </div>

      {showTestMode ? (
        <Card className="p-4 bg-card border-border">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-medium">Test Mode</h3>
            <FocusableItem
              focusKey="close-test-mode"
              className="p-1.5 rounded-lg bg-muted/30 hover:bg-muted/50 transition-colors"
              onClick={() => setShowTestMode(false)}
            >
              <X size={16} />
            </FocusableItem>
          </div>

          <div className="bg-muted/30 p-4 rounded-lg text-center">
            <p className="mb-2">Press any button on your controller to test</p>
            {lastButtonPressed ? (
              <div className="mt-4">
                <p className="text-lg font-medium">{formatButtonName(lastButtonPressed)}</p>
                <p className="text-sm text-muted-foreground mt-1">
                  Mapped to: {formatActionName(reverseMapping[lastButtonPressed] || "None")}
                </p>
              </div>
            ) : (
              <p className="text-muted-foreground">No button pressed yet</p>
            )}
          </div>
        </Card>
      ) : (
        <>
          <div className="flex items-center space-x-2 mb-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground" size={16} />
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-9 pr-3 py-2 rounded-lg bg-muted/30 border border-border focus:outline-none focus:ring-1 focus:ring-primary"
                placeholder="Search actions..."
              />
              {searchTerm && (
                <FocusableItem
                  focusKey="clear-search"
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 p-1 rounded-full hover:bg-muted/50"
                  onClick={() => setSearchTerm("")}
                >
                  <X size={14} />
                </FocusableItem>
              )}
            </div>
          </div>

          <div className="flex space-x-2 mb-4">
            <FocusableItem
              focusKey="tab-all"
              className={`px-3 py-1.5 rounded-lg transition-colors ${
                activeTab === "all" ? "bg-primary/20 text-primary" : "bg-muted/30 hover:bg-muted/50"
              }`}
              onClick={() => setActiveTab("all")}
            >
              All
            </FocusableItem>
            <FocusableItem
              focusKey="tab-movement"
              className={`px-3 py-1.5 rounded-lg transition-colors ${
                activeTab === "movement" ? "bg-primary/20 text-primary" : "bg-muted/30 hover:bg-muted/50"
              }`}
              onClick={() => setActiveTab("movement")}
            >
              Movement
            </FocusableItem>
            <FocusableItem
              focusKey="tab-actions"
              className={`px-3 py-1.5 rounded-lg transition-colors ${
                activeTab === "actions" ? "bg-primary/20 text-primary" : "bg-muted/30 hover:bg-muted/50"
              }`}
              onClick={() => setActiveTab("actions")}
            >
              Actions
            </FocusableItem>
            <FocusableItem
              focusKey="tab-menu"
              className={`px-3 py-1.5 rounded-lg transition-colors ${
                activeTab === "menu" ? "bg-primary/20 text-primary" : "bg-muted/30 hover:bg-muted/50"
              }`}
              onClick={() => setActiveTab("menu")}
            >
              Menu
            </FocusableItem>
          </div>

          <div className="space-y-2 max-h-[400px] overflow-y-auto pr-2">
            {filteredActions.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground">
                <AlertCircle className="mx-auto mb-2" size={24} />
                <p>No actions found</p>
                {searchTerm && <p className="text-sm mt-1">Try a different search term</p>}
              </div>
            ) : (
              filteredActions.map((action) => (
                <FocusableItem
                  key={action}
                  focusKey={`action-${action}`}
                  className={`p-3 rounded-lg transition-all ${
                    listeningAction === action ? "neon-border bg-primary/10" : "bg-muted/30 hover:bg-muted/50"
                  }`}
                  onClick={() => {
                    if (listeningAction === action) {
                      onStopListening()
                      setListeningAction(null)
                    } else {
                      handleAssignButton(action)
                    }
                  }}
                >
                  <div className="flex items-center justify-between">
                    <span className="font-medium">{formatActionName(action)}</span>
                    <div className="flex items-center">
                      {listeningAction === action ? (
                        <span className="text-sm text-primary animate-pulse">Press a button...</span>
                      ) : (
                        <>
                          <span className="text-sm text-muted-foreground mr-2">
                            {formatButtonName(getAssignedButton(action))}
                          </span>
                          <ArrowRight size={16} className="text-muted-foreground" />
                        </>
                      )}
                    </div>
                  </div>
                </FocusableItem>
              ))
            )}
          </div>
        </>
      )}
    </div>
  )
}
