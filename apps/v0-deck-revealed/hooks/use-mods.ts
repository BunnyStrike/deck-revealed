"use client"

import { useState, useEffect, useCallback } from "react"
import type { Mod, ModFilter } from "@/types/mod"

// Sample mod data
const sampleMods: Mod[] = [
  {
    id: "mod1",
    name: "Enhanced Graphics Overhaul",
    slug: "enhanced-graphics-overhaul",
    gameId: "game1", // Cyberpunk 2077
    description:
      "This mod completely overhauls the graphics of Cyberpunk 2077, enhancing lighting, textures, and visual effects for a more immersive experience. It includes custom shaders, improved reflections, and realistic weather effects.",
    shortDescription: "Complete graphics overhaul with enhanced lighting and textures",
    author: {
      id: "author1",
      name: "NightCityModder",
      avatar: "/mods/authors/nightcitymodder.png",
      website: "https://nightcitymodder.dev",
    },
    thumbnail: "/mods/thumbnails/enhanced-graphics.png",
    banner: "/mods/banners/enhanced-graphics-banner.png",
    rating: 4.8,
    ratingCount: 1253,
    downloadCount: 125000,
    createdAt: "2021-02-15T12:00:00Z",
    updatedAt: "2023-05-20T15:30:00Z",
    latestVersion: {
      version: "2.3.1",
      releaseDate: "2023-05-20T15:30:00Z",
      changelog: "Fixed compatibility issues with Phantom Liberty DLC. Improved performance on AMD GPUs.",
      downloadUrl: "https://example.com/mods/enhanced-graphics/2.3.1",
      fileSize: "2.4 GB",
      gameVersion: "2.0+",
    },
    versions: [
      {
        version: "2.3.1",
        releaseDate: "2023-05-20T15:30:00Z",
        changelog: "Fixed compatibility issues with Phantom Liberty DLC. Improved performance on AMD GPUs.",
        downloadUrl: "https://example.com/mods/enhanced-graphics/2.3.1",
        fileSize: "2.4 GB",
        gameVersion: "2.0+",
      },
      {
        version: "2.2.0",
        releaseDate: "2022-12-10T10:15:00Z",
        changelog: "Added ray-traced global illumination. New weather system.",
        downloadUrl: "https://example.com/mods/enhanced-graphics/2.2.0",
        fileSize: "2.2 GB",
        gameVersion: "1.6+",
      },
    ],
    categories: [
      { id: "cat1", name: "Visual", slug: "visual" },
      { id: "cat2", name: "Immersion", slug: "immersion" },
    ],
    tags: ["graphics", "lighting", "textures", "weather", "performance"],
    screenshots: [
      { id: "ss1", url: "/mods/screenshots/enhanced-graphics-1.png", caption: "Enhanced night lighting in Night City" },
      { id: "ss2", url: "/mods/screenshots/enhanced-graphics-2.png", caption: "Improved textures and reflections" },
      { id: "ss3", url: "/mods/screenshots/enhanced-graphics-3.png", caption: "Realistic weather effects" },
    ],
    requirements: [
      { type: "game", name: "Cyberpunk 2077", version: "1.6+", optional: false },
      { type: "system", name: "NVIDIA RTX GPU", optional: true },
    ],
    installed: true,
    enabled: true,
    installPath: "C:/Games/Cyberpunk2077/mods/enhanced-graphics",
    loadOrder: 1,
  },
  {
    id: "mod2",
    name: "Vehicle Handling Overhaul",
    slug: "vehicle-handling-overhaul",
    gameId: "game1", // Cyberpunk 2077
    description:
      "This mod completely revamps the vehicle handling in Cyberpunk 2077, making driving more realistic and enjoyable. Each vehicle class has been carefully tuned to provide a unique driving experience, from sports cars to heavy trucks.",
    shortDescription: "Realistic vehicle physics and improved driving experience",
    author: {
      id: "author2",
      name: "V-Drive",
      avatar: "/mods/authors/v-drive.png",
    },
    thumbnail: "/mods/thumbnails/vehicle-handling.png",
    rating: 4.6,
    ratingCount: 876,
    downloadCount: 98500,
    createdAt: "2021-03-22T09:45:00Z",
    updatedAt: "2023-04-12T11:20:00Z",
    latestVersion: {
      version: "3.1.0",
      releaseDate: "2023-04-12T11:20:00Z",
      changelog: "Added support for all new vehicles in Phantom Liberty. Fine-tuned motorcycle handling.",
      downloadUrl: "https://example.com/mods/vehicle-handling/3.1.0",
      fileSize: "45 MB",
      gameVersion: "2.0+",
    },
    versions: [
      {
        version: "3.1.0",
        releaseDate: "2023-04-12T11:20:00Z",
        changelog: "Added support for all new vehicles in Phantom Liberty. Fine-tuned motorcycle handling.",
        downloadUrl: "https://example.com/mods/vehicle-handling/3.1.0",
        fileSize: "45 MB",
        gameVersion: "2.0+",
      },
    ],
    categories: [
      { id: "cat3", name: "Gameplay", slug: "gameplay" },
      { id: "cat4", name: "Vehicles", slug: "vehicles" },
    ],
    tags: ["vehicles", "driving", "physics", "gameplay"],
    screenshots: [
      { id: "ss4", url: "/mods/screenshots/vehicle-handling-1.png", caption: "Sports car handling demonstration" },
      { id: "ss5", url: "/mods/screenshots/vehicle-handling-2.png", caption: "Off-road vehicle improvements" },
    ],
    requirements: [{ type: "game", name: "Cyberpunk 2077", version: "1.5+", optional: false }],
    installed: true,
    enabled: true,
    installPath: "C:/Games/Cyberpunk2077/mods/vehicle-handling",
    loadOrder: 2,
  },
  {
    id: "mod3",
    name: "Elden Rebalanced",
    slug: "elden-rebalanced",
    gameId: "game2", // Elden Ring
    description:
      "A comprehensive balance overhaul for Elden Ring that adjusts enemy stats, weapon damage, and player progression to create a more balanced and challenging experience. This mod aims to make underused weapons and spells more viable while toning down overpowered options.",
    shortDescription: "Complete game balance overhaul for a fresh experience",
    author: {
      id: "author3",
      name: "SoulsMaster",
      avatar: "/mods/authors/soulsmaster.png",
      website: "https://soulsmaster.net",
    },
    thumbnail: "/mods/thumbnails/elden-rebalanced.png",
    banner: "/mods/banners/elden-rebalanced-banner.png",
    rating: 4.9,
    ratingCount: 2105,
    downloadCount: 215000,
    createdAt: "2022-03-15T14:30:00Z",
    updatedAt: "2023-06-10T08:45:00Z",
    latestVersion: {
      version: "1.8.2",
      releaseDate: "2023-06-10T08:45:00Z",
      changelog:
        "Updated for compatibility with latest game patch. Rebalanced Colossal Weapons and adjusted boss HP scaling.",
      downloadUrl: "https://example.com/mods/elden-rebalanced/1.8.2",
      fileSize: "120 MB",
      gameVersion: "1.09+",
    },
    versions: [
      {
        version: "1.8.2",
        releaseDate: "2023-06-10T08:45:00Z",
        changelog:
          "Updated for compatibility with latest game patch. Rebalanced Colossal Weapons and adjusted boss HP scaling.",
        downloadUrl: "https://example.com/mods/elden-rebalanced/1.8.2",
        fileSize: "120 MB",
        gameVersion: "1.09+",
      },
      {
        version: "1.7.0",
        releaseDate: "2023-01-25T16:20:00Z",
        changelog: "Complete rework of spell balance. Adjusted enemy placement in legacy dungeons.",
        downloadUrl: "https://example.com/mods/elden-rebalanced/1.7.0",
        fileSize: "115 MB",
        gameVersion: "1.07+",
      },
    ],
    categories: [
      { id: "cat3", name: "Gameplay", slug: "gameplay" },
      { id: "cat5", name: "Balance", slug: "balance" },
    ],
    tags: ["balance", "difficulty", "weapons", "spells", "enemies"],
    screenshots: [
      { id: "ss6", url: "/mods/screenshots/elden-rebalanced-1.png", caption: "Rebalanced weapon stats" },
      { id: "ss7", url: "/mods/screenshots/elden-rebalanced-2.png", caption: "New enemy placements" },
      { id: "ss8", url: "/mods/screenshots/elden-rebalanced-3.png", caption: "Adjusted boss difficulty" },
    ],
    requirements: [
      { type: "game", name: "Elden Ring", version: "1.07+", optional: false },
      { type: "mod", name: "ModEngine2", optional: false },
    ],
    installed: false,
    enabled: false,
  },
]

export function useMods(initialFilter: ModFilter = {}) {
  const [mods, setMods] = useState<Mod[]>(sampleMods)
  const [filteredMods, setFilteredMods] = useState<Mod[]>(sampleMods)
  const [filter, setFilter] = useState<ModFilter>(initialFilter)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  // Apply filters to mods
  useEffect(() => {
    setLoading(true)
    try {
      let result = [...mods]

      // Filter by game ID
      if (filter.gameId) {
        result = result.filter((mod) => mod.gameId === filter.gameId)
      }

      // Filter by search term
      if (filter.search) {
        const searchLower = filter.search.toLowerCase()
        result = result.filter(
          (mod) =>
            mod.name.toLowerCase().includes(searchLower) ||
            mod.description.toLowerCase().includes(searchLower) ||
            mod.tags.some((tag) => tag.toLowerCase().includes(searchLower)),
        )
      }

      // Filter by categories
      if (filter.categories && filter.categories.length > 0) {
        result = result.filter((mod) => mod.categories.some((category) => filter.categories?.includes(category.id)))
      }

      // Filter by tags
      if (filter.tags && filter.tags.length > 0) {
        result = result.filter((mod) => filter.tags?.some((tag) => mod.tags.includes(tag)))
      }

      // Sort results
      if (filter.sortBy) {
        switch (filter.sortBy) {
          case "popular":
            result.sort((a, b) => b.downloadCount - a.downloadCount)
            break
          case "recent":
            result.sort((a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime())
            break
          case "rating":
            result.sort((a, b) => b.rating - a.rating)
            break
          case "downloads":
            result.sort((a, b) => b.downloadCount - a.downloadCount)
            break
          case "name":
            result.sort((a, b) => a.name.localeCompare(b.name))
            break
        }
      }

      setFilteredMods(result)
      setError(null)
    } catch (err) {
      setError("Failed to filter mods")
      console.error(err)
    } finally {
      setLoading(false)
    }
  }, [mods, filter])

  // Install a mod
  const installMod = useCallback((modId: string) => {
    setMods((prevMods) =>
      prevMods.map((mod) =>
        mod.id === modId
          ? { ...mod, installed: true, enabled: true, installPath: `C:/Games/${mod.gameId}/mods/${mod.slug}` }
          : mod,
      ),
    )
  }, [])

  // Uninstall a mod
  const uninstallMod = useCallback((modId: string) => {
    setMods((prevMods) =>
      prevMods.map((mod) =>
        mod.id === modId ? { ...mod, installed: false, enabled: false, installPath: undefined } : mod,
      ),
    )
  }, [])

  // Enable/disable a mod
  const toggleModEnabled = useCallback((modId: string) => {
    setMods((prevMods) =>
      prevMods.map((mod) => (mod.id === modId && mod.installed ? { ...mod, enabled: !mod.enabled } : mod)),
    )
  }, [])

  // Update mod load order
  const updateModLoadOrder = useCallback((modId: string, newOrder: number) => {
    setMods((prevMods) => prevMods.map((mod) => (mod.id === modId ? { ...mod, loadOrder: newOrder } : mod)))
  }, [])

  // Update filter
  const updateFilter = useCallback((newFilter: Partial<ModFilter>) => {
    setFilter((prev) => ({ ...prev, ...newFilter }))
  }, [])

  return {
    mods: filteredMods,
    loading,
    error,
    filter,
    updateFilter,
    installMod,
    uninstallMod,
    toggleModEnabled,
    updateModLoadOrder,
  }
}
