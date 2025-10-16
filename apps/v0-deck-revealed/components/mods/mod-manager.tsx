"use client"

import { useState } from "react"
import { ChevronLeft, Upload } from "lucide-react"
import { FocusableItem } from "@/components/ui/focusable-item"
import { Card } from "@/components/ui/card"
import { ModBrowser } from "@/components/mods/mod-browser"
import ModDetail from "@/components/mods/mod-detail"
import { useMods } from "@/hooks/use-mods"

interface ModManagerProps {
  gameId?: string
  onBack: () => void
}

export function ModManager({ gameId, onBack }: ModManagerProps) {
  const [view, setView] = useState<"browser" | "detail">("browser")
  const [selectedModId, setSelectedModId] = useState<string | null>(null)
  const { mods } = useMods({ gameId })

  // Handle mod selection
  const handleSelectMod = (modId: string) => {
    setSelectedModId(modId)
    setView("detail")
  }

  // Handle back to browser
  const handleBackToBrowser = () => {
    setSelectedModId(null)
    setView("browser")
  }

  // Handle upload mod
  const handleUploadMod = () => {
    // In a real app, this would open a file picker
    console.log("Upload mod")
  }

  // If in detail view, show the mod detail
  if (view === "detail" && selectedModId) {
    return <ModDetail modId={selectedModId} onBack={handleBackToBrowser} />
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center">
          <FocusableItem
            focusKey="back-to-library"
            className="mr-4 text-muted-foreground hover:text-foreground transition-colors"
            onClick={onBack}
          >
            <ChevronLeft size={20} />
          </FocusableItem>
          <h1 className="text-3xl font-bold gradient-text">{gameId ? "Game Mods" : "Mod Manager"}</h1>
        </div>

        <FocusableItem
          focusKey="upload-mod"
          className="bg-primary hover:bg-primary/90 text-white px-4 py-2 rounded-lg font-medium transition-all flex items-center gap-2"
          onClick={handleUploadMod}
        >
          <Upload size={16} />
          <span>Upload Mod</span>
        </FocusableItem>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="bg-card border-border p-4 rounded-xl">
          <div className="flex flex-col">
            <span className="text-3xl font-bold">{mods.length}</span>
            <span className="text-muted-foreground">Total Mods</span>
          </div>
        </Card>

        <Card className="bg-card border-border p-4 rounded-xl">
          <div className="flex flex-col">
            <span className="text-3xl font-bold">{mods.filter((m) => m.installed).length}</span>
            <span className="text-muted-foreground">Installed Mods</span>
          </div>
        </Card>

        <Card className="bg-card border-border p-4 rounded-xl">
          <div className="flex flex-col">
            <span className="text-3xl font-bold">{mods.filter((m) => m.installed && m.enabled).length}</span>
            <span className="text-muted-foreground">Active Mods</span>
          </div>
        </Card>
      </div>

      {/* Mod Browser */}
      <ModBrowser gameId={gameId} onSelectMod={handleSelectMod} />
    </div>
  )
}
