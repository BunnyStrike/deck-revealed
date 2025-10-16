"use client"

import { useState } from "react"
import { useTheme } from "@/components/theme/theme-provider"
import { FocusableItem } from "@/components/ui/focusable-item"
import { Card } from "@/components/ui/card"
import { Check, ChevronLeft, Palette } from "lucide-react"

interface ThemeManagerProps {
  onBack: () => void
}

export function ThemeManager({ onBack }: ThemeManagerProps) {
  const { currentTheme, setTheme, availableThemes } = useTheme()
  const [previewTheme, setPreviewTheme] = useState<string | null>(null)

  const handleThemeSelect = (themeId: string) => {
    setTheme(themeId)
  }

  const handleThemePreview = (themeId: string) => {
    setPreviewTheme(themeId)
  }

  const handleThemePreviewEnd = () => {
    setPreviewTheme(null)
  }

  return (
    <div className="h-full overflow-y-auto pb-8">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center">
          <FocusableItem
            focusKey="back-button"
            className="inline-flex items-center text-muted-foreground hover:text-foreground mr-4 transition-colors"
            onClick={onBack}
          >
            <ChevronLeft className="mr-1" size={18} />
            <span>Back</span>
          </FocusableItem>
          <h1 className="text-2xl font-bold gradient-text">Theme Manager</h1>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 p-2">
        {availableThemes.map((theme) => (
          <FocusableItem
            key={theme.id}
            focusKey={`theme-${theme.id}`}
            className={`rounded-xl overflow-hidden transition-all p-1 ${
              currentTheme.id === theme.id ? "ring-2 ring-primary ring-offset-4 ring-offset-background" : ""
            }`}
            onClick={() => handleThemeSelect(theme.id)}
            onMouseEnter={() => handleThemePreview(theme.id)}
            onMouseLeave={handleThemePreviewEnd}
          >
            <Card className="overflow-hidden h-full border-border">
              <div
                className="h-32 relative"
                style={{
                  background: `hsl(${theme.background})`,
                  color: `hsl(${theme.foreground})`,
                }}
              >
                {currentTheme.id === theme.id && (
                  <div className="absolute top-2 right-2 bg-primary rounded-full p-1">
                    <Check className="w-4 h-4 text-white" />
                  </div>
                )}
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="flex gap-2">
                    <div className="w-8 h-8 rounded-full" style={{ background: `hsl(${theme.primary})` }}></div>
                    <div className="w-8 h-8 rounded-full" style={{ background: `hsl(${theme.secondary})` }}></div>
                    <div className="w-8 h-8 rounded-full" style={{ background: `hsl(${theme.accent})` }}></div>
                  </div>
                </div>
                <div
                  className="absolute bottom-0 left-0 right-0 p-3"
                  style={{
                    background: `hsl(${theme.card})`,
                    color: `hsl(${theme.cardForeground})`,
                    borderTop: `1px solid hsl(${theme.border})`,
                  }}
                >
                  <div className="flex justify-between items-center">
                    <h3 className="font-medium">{theme.name}</h3>
                    <Palette size={16} />
                  </div>
                </div>
              </div>
              <div className="p-4">
                <div className="flex flex-wrap gap-2 mb-2">
                  <div className="h-2 w-full rounded-full" style={{ background: `hsl(${theme.primary})` }}></div>
                  <div className="h-2 w-1/2 rounded-full" style={{ background: `hsl(${theme.secondary})` }}></div>
                  <div className="h-2 w-1/3 rounded-full" style={{ background: `hsl(${theme.accent})` }}></div>
                </div>
                <p className="text-sm" style={{ color: `hsl(${theme.mutedForeground})` }}>
                  {theme.name} theme with primary, secondary, and accent colors.
                </p>
              </div>
            </Card>
          </FocusableItem>
        ))}
      </div>
    </div>
  )
}
