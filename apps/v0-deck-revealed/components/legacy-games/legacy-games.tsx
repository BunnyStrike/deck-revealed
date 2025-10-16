"use client"

import { useState } from "react"
import { PlatformBrowser } from "./platform-browser"
import { ROMLibrary } from "./rom-library"

interface LegacyGamesProps {
  onBack: () => void
}

export function LegacyGames({ onBack }: LegacyGamesProps) {
  const [view, setView] = useState<"platforms" | "all-roms">("platforms")

  if (view === "all-roms") {
    return <ROMLibrary onBack={() => setView("platforms")} />
  }

  return <PlatformBrowser onBack={onBack} />
}
