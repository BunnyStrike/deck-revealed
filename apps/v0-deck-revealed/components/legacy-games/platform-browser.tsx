"use client"

import { useState } from "react"
import { ArrowLeft } from "lucide-react"
import { Card } from "@/components/ui/card"
import { FocusableItem } from "@/components/ui/focusable-item"
import { useLegacyGames } from "@/hooks/use-legacy-games"
import type { EmulatorPlatform } from "@/types/legacy-games"
import { ROMLibrary } from "./rom-library"

interface PlatformBrowserProps {
  onBack: () => void
}

export function PlatformBrowser({ onBack }: PlatformBrowserProps) {
  const { platforms } = useLegacyGames()
  const [selectedPlatform, setSelectedPlatform] = useState<EmulatorPlatform | null>(null)

  // If a platform is selected, show the ROM library for that platform
  if (selectedPlatform) {
    return <ROMLibrary onBack={() => setSelectedPlatform(null)} platformFilter={selectedPlatform} />
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center">
        <FocusableItem
          focusKey="back-button"
          className="mr-4 p-2 hover:bg-muted rounded-full transition-colors"
          onClick={onBack}
        >
          <ArrowLeft className="w-5 h-5" />
        </FocusableItem>
        <h1 className="text-2xl font-bold">Platforms</h1>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {platforms.map((platform) => (
          <FocusableItem
            key={platform.id}
            focusKey={`platform-${platform.id}`}
            className="platform-card"
            onClick={() => setSelectedPlatform(platform.id)}
          >
            <Card className="overflow-hidden bg-card border-border h-full hover:shadow-md transition-shadow">
              <div className="relative">
                <img
                  src={platform.coverImage || `/placeholder.svg?height=150&width=300&query=${platform.name} console`}
                  alt={platform.name}
                  className="w-full h-32 object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent flex items-end p-3">
                  <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center mr-3">
                    <img
                      src={platform.icon || `/placeholder.svg?height=40&width=40&query=${platform.shortName} icon`}
                      alt={platform.shortName}
                      className="w-6 h-6 object-contain"
                    />
                  </div>
                  <div>
                    <h3 className="font-bold text-white">{platform.name}</h3>
                    <p className="text-xs text-white/80">
                      {platform.manufacturer} • {platform.releaseYear}
                    </p>
                  </div>
                </div>
              </div>
              <div className="p-4">
                <p className="text-sm text-muted-foreground mb-2">{platform.description}</p>
                <div className="flex justify-between items-center">
                  <span className="text-xs bg-muted px-2 py-0.5 rounded-full text-muted-foreground">
                    {platform.romCount || 0} ROMs
                  </span>
                  <span
                    className="text-xs px-2 py-0.5 rounded-full font-medium"
                    style={{ backgroundColor: `${platform.color}30`, color: platform.color }}
                  >
                    {platform.shortName}
                  </span>
                </div>
              </div>
            </Card>
          </FocusableItem>
        ))}
      </div>
    </div>
  )
}
