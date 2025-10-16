"use client"

import { useState } from "react"
import { FocusableItem } from "@/components/ui/focusable-item"
import { Check, X } from "lucide-react"
import type { NewsPreferences } from "@/types/news"

interface NewsPreferencesPanelProps {
  onClose: () => void
}

export function NewsPreferencesPanel({ onClose }: NewsPreferencesPanelProps) {
  const [preferences, setPreferences] = useState<NewsPreferences>({
    autoMarkAsRead: true,
    notifyForGames: [],
    notifyForTypes: ["update", "announcement", "release"],
    notifyForImportance: ["high", "critical"],
    refreshInterval: 15,
    maxItems: 50,
  })

  const handleToggleAutoMarkAsRead = () => {
    setPreferences((prev) => ({
      ...prev,
      autoMarkAsRead: !prev.autoMarkAsRead,
    }))
  }

  const handleToggleNotifyType = (type: NewsPreferences["notifyForTypes"][0]) => {
    const types = [...preferences.notifyForTypes]
    const index = types.indexOf(type)

    if (index === -1) {
      types.push(type)
    } else {
      types.splice(index, 1)
    }

    setPreferences((prev) => ({
      ...prev,
      notifyForTypes: types,
    }))
  }

  const handleToggleNotifyImportance = (importance: NewsPreferences["notifyForImportance"][0]) => {
    const importanceValues = [...preferences.notifyForImportance]
    const index = importanceValues.indexOf(importance)

    if (index === -1) {
      importanceValues.push(importance)
    } else {
      importanceValues.splice(index, 1)
    }

    setPreferences((prev) => ({
      ...prev,
      notifyForImportance: importanceValues,
    }))
  }

  const handleChangeRefreshInterval = (interval: number) => {
    setPreferences((prev) => ({
      ...prev,
      refreshInterval: interval,
    }))
  }

  const handleSavePreferences = () => {
    // In a real app, this would save the preferences to storage
    console.log("Saving preferences:", preferences)
    onClose()
  }

  return (
    <div className="bg-card border border-border rounded-xl p-4 space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-bold">News Preferences</h3>
        <FocusableItem
          focusKey="close-preferences"
          className="p-1 hover:bg-muted/30 rounded-lg transition-all"
          onClick={onClose}
        >
          <X className="w-5 h-5" />
        </FocusableItem>
      </div>

      <div className="space-y-4">
        <div>
          <h4 className="text-sm font-medium mb-2">General Settings</h4>
          <FocusableItem
            focusKey="auto-mark-read"
            className="flex items-center gap-2 p-2 hover:bg-muted/30 rounded-lg transition-all"
            onClick={handleToggleAutoMarkAsRead}
          >
            <div
              className={`w-4 h-4 rounded border ${preferences.autoMarkAsRead ? "bg-primary border-primary" : "border-muted-foreground"} flex items-center justify-center`}
            >
              {preferences.autoMarkAsRead && <Check className="w-3 h-3 text-white" />}
            </div>
            <span>Automatically mark news as read when viewed</span>
          </FocusableItem>
        </div>

        <div>
          <h4 className="text-sm font-medium mb-2">Notification Settings</h4>
          <p className="text-xs text-muted-foreground mb-2">Notify me about:</p>

          <div className="space-y-1 mb-3">
            <p className="text-xs font-medium">News Types</p>
            <div className="grid grid-cols-2 gap-1">
              {(["article", "update", "announcement", "event", "release"] as const).map((type) => (
                <FocusableItem
                  key={type}
                  focusKey={`notify-type-${type}`}
                  className="flex items-center gap-2 p-2 hover:bg-muted/30 rounded-lg transition-all"
                  onClick={() => handleToggleNotifyType(type)}
                >
                  <div
                    className={`w-4 h-4 rounded border ${preferences.notifyForTypes.includes(type) ? "bg-primary border-primary" : "border-muted-foreground"} flex items-center justify-center`}
                  >
                    {preferences.notifyForTypes.includes(type) && <Check className="w-3 h-3 text-white" />}
                  </div>
                  <span className="capitalize">{type}s</span>
                </FocusableItem>
              ))}
            </div>
          </div>

          <div className="space-y-1">
            <p className="text-xs font-medium">Importance Levels</p>
            <div className="grid grid-cols-2 gap-1">
              {(["low", "medium", "high", "critical"] as const).map((importance) => (
                <FocusableItem
                  key={importance}
                  focusKey={`notify-importance-${importance}`}
                  className="flex items-center gap-2 p-2 hover:bg-muted/30 rounded-lg transition-all"
                  onClick={() => handleToggleNotifyImportance(importance)}
                >
                  <div
                    className={`w-4 h-4 rounded border ${preferences.notifyForImportance.includes(importance) ? "bg-primary border-primary" : "border-muted-foreground"} flex items-center justify-center`}
                  >
                    {preferences.notifyForImportance.includes(importance) && <Check className="w-3 h-3 text-white" />}
                  </div>
                  <span className="capitalize">{importance}</span>
                </FocusableItem>
              ))}
            </div>
          </div>
        </div>

        <div>
          <h4 className="text-sm font-medium mb-2">Refresh Interval</h4>
          <div className="flex flex-wrap gap-2">
            {[5, 15, 30, 60].map((interval) => (
              <FocusableItem
                key={interval}
                focusKey={`refresh-${interval}`}
                className={`px-3 py-1 rounded-lg text-sm ${preferences.refreshInterval === interval ? "bg-primary text-white" : "bg-muted text-muted-foreground hover:bg-muted/80"}`}
                onClick={() => handleChangeRefreshInterval(interval)}
              >
                {interval} min
              </FocusableItem>
            ))}
          </div>
        </div>
      </div>

      <div className="flex justify-end gap-2 pt-2">
        <FocusableItem
          focusKey="cancel-preferences"
          className="px-4 py-2 text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
          onClick={onClose}
        >
          Cancel
        </FocusableItem>
        <FocusableItem
          focusKey="save-preferences"
          className="px-4 py-2 text-sm font-medium bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors"
          onClick={handleSavePreferences}
        >
          Save Preferences
        </FocusableItem>
      </div>
    </div>
  )
}
