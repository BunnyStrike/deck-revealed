"use client"

import { useState, useEffect } from "react"
import { useInputMethod } from "@/hooks/use-input-method"
import { MainLayout } from "@/components/layouts/main-layout"
import { Dashboard } from "@/components/dashboard"
import Library from "@/components/library"
import { Settings } from "@/components/settings"
import { Store } from "@/components/store"
import { Friends } from "@/components/friends"
import { ThemeProvider } from "@/components/theme/theme-provider"

export default function App() {
  const [activeView, setActiveView] = useState("dashboard")
  const { inputMethod } = useInputMethod()

  // Handle keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "F1") setActiveView("dashboard")
      if (e.key === "F2") setActiveView("library")
      if (e.key === "F3") setActiveView("store")
      if (e.key === "F4") setActiveView("friends")
      if (e.key === "F5") setActiveView("settings")
    }

    window.addEventListener("keydown", handleKeyDown)
    return () => window.removeEventListener("keydown", handleKeyDown)
  }, [])

  return (
    <ThemeProvider>
      <MainLayout activeView={activeView} setActiveView={setActiveView} inputMethod={inputMethod}>
        {activeView === "dashboard" && <Dashboard />}
        {activeView === "library" && <Library />}
        {activeView === "store" && <Store />}
        {activeView === "friends" && <Friends />}
        {activeView === "settings" && <Settings />}
      </MainLayout>
    </ThemeProvider>
  )
}
