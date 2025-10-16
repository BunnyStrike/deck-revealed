"use client"

import { useState } from "react"
import { FocusableItem } from "@/components/ui/focusable-item"
import { Card } from "@/components/ui/card"
import { Info, Search, X } from "lucide-react"
import type { GameActionDescription } from "@/types/controller-mapping"

interface GameActionDescriptionsProps {
  gameId: string
  actionDescriptions: GameActionDescription[]
}

export function GameActionDescriptions({ gameId, actionDescriptions }: GameActionDescriptionsProps) {
  const [searchTerm, setSearchTerm] = useState("")
  const [activeContext, setActiveContext] = useState<string | null>(null)

  // Get unique contexts
  const contexts = Array.from(new Set(actionDescriptions.map((desc) => desc.context)))

  // Filter action descriptions based on search term and active context
  const filteredDescriptions = actionDescriptions.filter((desc) => {
    const matchesSearch =
      searchTerm === "" ||
      desc.action.toLowerCase().includes(searchTerm.toLowerCase()) ||
      desc.description.toLowerCase().includes(searchTerm.toLowerCase())

    const matchesContext = activeContext === null || desc.context === activeContext

    return matchesSearch && matchesContext
  })

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-semibold flex items-center">
          <Info className="mr-2" size={20} />
          Game Actions
        </h2>
      </div>

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

      <div className="flex space-x-2 mb-4 overflow-x-auto pb-2">
        <FocusableItem
          focusKey="context-all"
          className={`px-3 py-1.5 rounded-lg transition-colors whitespace-nowrap ${
            activeContext === null ? "bg-primary/20 text-primary" : "bg-muted/30 hover:bg-muted/50"
          }`}
          onClick={() => setActiveContext(null)}
        >
          All Contexts
        </FocusableItem>
        {contexts.map((context) => (
          <FocusableItem
            key={context}
            focusKey={`context-${context}`}
            className={`px-3 py-1.5 rounded-lg transition-colors whitespace-nowrap ${
              activeContext === context ? "bg-primary/20 text-primary" : "bg-muted/30 hover:bg-muted/50"
            }`}
            onClick={() => setActiveContext(context)}
          >
            {context}
          </FocusableItem>
        ))}
      </div>

      <div className="space-y-2 max-h-[400px] overflow-y-auto pr-2">
        {filteredDescriptions.length === 0 ? (
          <div className="text-center py-8 text-muted-foreground">
            <Info className="mx-auto mb-2" size={24} />
            <p>No actions found</p>
            {searchTerm && <p className="text-sm mt-1">Try a different search term</p>}
          </div>
        ) : (
          filteredDescriptions.map((desc) => (
            <Card key={desc.action} className="p-3 bg-muted/30">
              <div className="flex items-start justify-between">
                <div>
                  <div className="flex items-center">
                    <span className="font-medium">
                      {desc.action
                        .split("_")
                        .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
                        .join(" ")}
                    </span>
                    <span className="ml-2 px-1.5 py-0.5 text-xs rounded bg-muted/50 text-muted-foreground">
                      {desc.context}
                    </span>
                    {desc.importance === "primary" && (
                      <span className="ml-2 px-1.5 py-0.5 text-xs rounded bg-primary/20 text-primary">Primary</span>
                    )}
                  </div>
                  <p className="text-sm text-muted-foreground mt-1">{desc.description}</p>
                </div>
              </div>
            </Card>
          ))
        )}
      </div>
    </div>
  )
}
