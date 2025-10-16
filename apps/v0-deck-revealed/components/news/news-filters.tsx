"use client"

import { useState } from "react"
import { FocusableItem } from "@/components/ui/focusable-item"
import type { NewsFilter } from "@/types/news"
import { Check, X } from "lucide-react"

interface NewsFiltersProps {
  currentFilter: NewsFilter
  onUpdateFilter: (filter: Partial<NewsFilter>) => void
  onClose: () => void
}

export function NewsFilters({ currentFilter, onUpdateFilter, onClose }: NewsFiltersProps) {
  const [localFilter, setLocalFilter] = useState<NewsFilter>({ ...currentFilter })

  const handleUpdateFilter = (key: keyof NewsFilter, value: any) => {
    setLocalFilter((prev) => ({ ...prev, [key]: value }))
  }

  const handleToggleType = (type: NewsFilter["types"][0]) => {
    const types = [...localFilter.types]
    const index = types.indexOf(type)

    if (index === -1) {
      types.push(type)
    } else {
      types.splice(index, 1)
    }

    handleUpdateFilter("types", types)
  }

  const handleToggleImportance = (importance: NewsFilter["importance"][0]) => {
    const importanceValues = [...localFilter.importance]
    const index = importanceValues.indexOf(importance)

    if (index === -1) {
      importanceValues.push(importance)
    } else {
      importanceValues.splice(index, 1)
    }

    handleUpdateFilter("importance", importanceValues)
  }

  const handleApplyFilters = () => {
    onUpdateFilter(localFilter)
    onClose()
  }

  const handleResetFilters = () => {
    const resetFilter: NewsFilter = {
      games: [],
      sources: [],
      types: [],
      importance: [],
      onlyUnread: false,
      onlySaved: false,
    }

    setLocalFilter(resetFilter)
    onUpdateFilter(resetFilter)
  }

  return (
    <div className="bg-card border border-border rounded-xl p-4 space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-bold">Filters</h3>
        <FocusableItem
          focusKey="close-filters"
          className="p-1 hover:bg-muted/30 rounded-lg transition-all"
          onClick={onClose}
        >
          <X className="w-5 h-5" />
        </FocusableItem>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <h4 className="text-sm font-medium mb-2">News Type</h4>
          <div className="space-y-1">
            {(["article", "update", "announcement", "event", "release"] as const).map((type) => (
              <FocusableItem
                key={type}
                focusKey={`filter-type-${type}`}
                className="flex items-center gap-2 p-2 hover:bg-muted/30 rounded-lg transition-all"
                onClick={() => handleToggleType(type)}
              >
                <div
                  className={`w-4 h-4 rounded border ${localFilter.types.includes(type) ? "bg-primary border-primary" : "border-muted-foreground"} flex items-center justify-center`}
                >
                  {localFilter.types.includes(type) && <Check className="w-3 h-3 text-white" />}
                </div>
                <span className="capitalize">{type}</span>
              </FocusableItem>
            ))}
          </div>
        </div>

        <div>
          <h4 className="text-sm font-medium mb-2">Importance</h4>
          <div className="space-y-1">
            {(["low", "medium", "high", "critical"] as const).map((importance) => (
              <FocusableItem
                key={importance}
                focusKey={`filter-importance-${importance}`}
                className="flex items-center gap-2 p-2 hover:bg-muted/30 rounded-lg transition-all"
                onClick={() => handleToggleImportance(importance)}
              >
                <div
                  className={`w-4 h-4 rounded border ${localFilter.importance.includes(importance) ? "bg-primary border-primary" : "border-muted-foreground"} flex items-center justify-center`}
                >
                  {localFilter.importance.includes(importance) && <Check className="w-3 h-3 text-white" />}
                </div>
                <span className="capitalize">{importance}</span>
              </FocusableItem>
            ))}
          </div>
        </div>
      </div>

      <div className="space-y-2">
        <h4 className="text-sm font-medium mb-2">Other Filters</h4>
        <FocusableItem
          focusKey="filter-unread"
          className="flex items-center gap-2 p-2 hover:bg-muted/30 rounded-lg transition-all"
          onClick={() => handleUpdateFilter("onlyUnread", !localFilter.onlyUnread)}
        >
          <div
            className={`w-4 h-4 rounded border ${localFilter.onlyUnread ? "bg-primary border-primary" : "border-muted-foreground"} flex items-center justify-center`}
          >
            {localFilter.onlyUnread && <Check className="w-3 h-3 text-white" />}
          </div>
          <span>Show only unread</span>
        </FocusableItem>
      </div>

      <div className="flex justify-end gap-2 pt-2">
        <FocusableItem
          focusKey="reset-filters"
          className="px-4 py-2 text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
          onClick={handleResetFilters}
        >
          Reset
        </FocusableItem>
        <FocusableItem
          focusKey="apply-filters"
          className="px-4 py-2 text-sm font-medium bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors"
          onClick={handleApplyFilters}
        >
          Apply Filters
        </FocusableItem>
      </div>
    </div>
  )
}
