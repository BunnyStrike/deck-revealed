"use client"

import { createContext, useContext, useState, useEffect, type ReactNode } from "react"
import type { Theme } from "@/types/game-data"

// Default themes
export const themes: Theme[] = [
  {
    id: "default",
    name: "Default",
    primary: "267 100% 61%",
    secondary: "333 100% 50%",
    accent: "170 100% 45%",
    background: "240 10% 4%",
    foreground: "0 0% 100%",
    card: "240 10% 8%",
    cardForeground: "0 0% 100%",
    border: "240 10% 14%",
    muted: "240 10% 16%",
    mutedForeground: "240 5% 65%",
  },
  {
    id: "cyberpunk",
    name: "Cyberpunk",
    primary: "326 100% 60%",
    secondary: "196 100% 50%",
    accent: "60 100% 50%",
    background: "235 80% 8%",
    foreground: "0 0% 100%",
    card: "235 70% 12%",
    cardForeground: "0 0% 100%",
    border: "235 60% 20%",
    muted: "235 50% 20%",
    mutedForeground: "235 30% 70%",
  },
  {
    id: "retro",
    name: "Retro",
    primary: "35 100% 50%",
    secondary: "10 100% 60%",
    accent: "200 100% 40%",
    background: "220 20% 10%",
    foreground: "40 30% 90%",
    card: "220 15% 15%",
    cardForeground: "40 30% 90%",
    border: "220 10% 20%",
    muted: "220 10% 25%",
    mutedForeground: "40 15% 70%",
  },
  {
    id: "forest",
    name: "Forest",
    primary: "120 60% 50%",
    secondary: "40 100% 50%",
    accent: "200 100% 40%",
    background: "120 20% 10%",
    foreground: "120 10% 95%",
    card: "120 15% 15%",
    cardForeground: "120 10% 95%",
    border: "120 20% 20%",
    muted: "120 15% 25%",
    mutedForeground: "120 5% 70%",
  },
  {
    id: "light",
    name: "Light Mode",
    primary: "267 100% 61%",
    secondary: "333 100% 50%",
    accent: "170 100% 45%",
    background: "0 0% 98%",
    foreground: "240 10% 4%",
    card: "0 0% 100%",
    cardForeground: "240 10% 4%",
    border: "240 5% 84%",
    muted: "240 5% 90%",
    mutedForeground: "240 3% 45%",
  },
]

type ThemeContextType = {
  currentTheme: Theme
  setTheme: (themeId: string) => void
  availableThemes: Theme[]
}

const ThemeContext = createContext<ThemeContextType>({
  currentTheme: themes[0],
  setTheme: () => {},
  availableThemes: themes,
})

export const useTheme = () => useContext(ThemeContext)

interface ThemeProviderProps {
  children: ReactNode
}

export function ThemeProvider({ children }: ThemeProviderProps) {
  const [currentTheme, setCurrentTheme] = useState<Theme>(themes[0])

  const setTheme = (themeId: string) => {
    const theme = themes.find((t) => t.id === themeId) || themes[0]
    setCurrentTheme(theme)
    localStorage.setItem("theme", themeId)
    applyTheme(theme)
  }

  const applyTheme = (theme: Theme) => {
    document.documentElement.style.setProperty("--primary", theme.primary)
    document.documentElement.style.setProperty("--secondary", theme.secondary)
    document.documentElement.style.setProperty("--accent", theme.accent)
    document.documentElement.style.setProperty("--background", theme.background)
    document.documentElement.style.setProperty("--foreground", theme.foreground)
    document.documentElement.style.setProperty("--card", theme.card)
    document.documentElement.style.setProperty("--card-foreground", theme.cardForeground)
    document.documentElement.style.setProperty("--border", theme.border)
    document.documentElement.style.setProperty("--muted", theme.muted)
    document.documentElement.style.setProperty("--muted-foreground", theme.mutedForeground)
  }

  useEffect(() => {
    const savedTheme = localStorage.getItem("theme")
    if (savedTheme) {
      setTheme(savedTheme)
    }
  }, [])

  return (
    <ThemeContext.Provider value={{ currentTheme, setTheme, availableThemes: themes }}>
      {children}
    </ThemeContext.Provider>
  )
}
