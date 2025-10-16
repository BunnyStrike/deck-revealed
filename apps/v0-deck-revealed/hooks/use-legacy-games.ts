"use client"

import { useState, useEffect, useCallback } from "react"
import type { Emulator, ROM, EmulatorPlatform, PlatformInfo } from "@/types/legacy-games"

// Sample platform data
const platformData: PlatformInfo[] = [
  {
    id: "nes",
    name: "Nintendo Entertainment System",
    shortName: "NES",
    description: "The 8-bit home video game console developed and manufactured by Nintendo.",
    releaseYear: 1985,
    manufacturer: "Nintendo",
    icon: "/platforms/nes-icon.png",
    coverImage: "/platforms/nes-cover.png",
    color: "#E30012",
  },
  {
    id: "snes",
    name: "Super Nintendo Entertainment System",
    shortName: "SNES",
    description: "The 16-bit home video game console developed by Nintendo.",
    releaseYear: 1990,
    manufacturer: "Nintendo",
    icon: "/platforms/snes-icon.png",
    coverImage: "/platforms/snes-cover.png",
    color: "#8C6BC7",
  },
  {
    id: "n64",
    name: "Nintendo 64",
    shortName: "N64",
    description: "The 64-bit home video game console developed and manufactured by Nintendo.",
    releaseYear: 1996,
    manufacturer: "Nintendo",
    icon: "/platforms/n64-icon.png",
    coverImage: "/platforms/n64-cover.png",
    color: "#00B800",
  },
  {
    id: "genesis",
    name: "Sega Genesis",
    shortName: "Genesis",
    description: "The 16-bit home video game console developed and manufactured by Sega.",
    releaseYear: 1989,
    manufacturer: "Sega",
    icon: "/platforms/genesis-icon.png",
    coverImage: "/platforms/genesis-cover.png",
    color: "#E60012",
  },
  {
    id: "gb",
    name: "Game Boy",
    shortName: "GB",
    description: "The 8-bit handheld game console developed and manufactured by Nintendo.",
    releaseYear: 1989,
    manufacturer: "Nintendo",
    icon: "/platforms/gb-icon.png",
    coverImage: "/platforms/gb-cover.png",
    color: "#8B8B8B",
  },
  {
    id: "gbc",
    name: "Game Boy Color",
    shortName: "GBC",
    description: "The successor to the Game Boy handheld console.",
    releaseYear: 1998,
    manufacturer: "Nintendo",
    icon: "/platforms/gbc-icon.png",
    coverImage: "/platforms/gbc-cover.png",
    color: "#00A2E8",
  },
  {
    id: "gba",
    name: "Game Boy Advance",
    shortName: "GBA",
    description: "The 32-bit handheld game console developed, manufactured and marketed by Nintendo.",
    releaseYear: 2001,
    manufacturer: "Nintendo",
    icon: "/platforms/gba-icon.png",
    coverImage: "/platforms/gba-cover.png",
    color: "#6A5FBB",
  },
  {
    id: "ps1",
    name: "PlayStation",
    shortName: "PS1",
    description: "The home video game console developed and marketed by Sony Computer Entertainment.",
    releaseYear: 1994,
    manufacturer: "Sony",
    icon: "/platforms/ps1-icon.png",
    coverImage: "/platforms/ps1-cover.png",
    color: "#CECECE",
  },
  {
    id: "arcade",
    name: "Arcade",
    shortName: "Arcade",
    description: "Classic arcade games from various manufacturers.",
    releaseYear: 1970,
    manufacturer: "Various",
    icon: "/platforms/arcade-icon.png",
    coverImage: "/platforms/arcade-cover.png",
    color: "#FF5722",
  },
]

// Sample emulator data
const sampleEmulators: Emulator[] = [
  {
    id: "nestopia",
    name: "Nestopia",
    platform: "nes",
    version: "1.50",
    path: "/emulators/nestopia",
    executable: "nestopia.exe",
    supportedFileExtensions: [".nes"],
    configurable: true,
    icon: "/emulators/nestopia-icon.png",
    website: "http://nestopia.sourceforge.net/",
    isInstalled: true,
    lastUpdated: "2023-01-15",
  },
  {
    id: "project64",
    name: "Project64",
    platform: "n64",
    version: "3.0.1",
    path: "/emulators/project64",
    executable: "project64.exe",
    supportedFileExtensions: [".n64", ".v64", ".z64"],
    configurable: true,
    icon: "/emulators/project64-icon.png",
    website: "https://www.pj64-emu.com/",
    isInstalled: true,
    lastUpdated: "2023-03-22",
  },
  {
    id: "genesis-plus-gx",
    name: "Genesis Plus GX",
    platform: "genesis",
    version: "1.7.5",
    path: "/emulators/genesis-plus-gx",
    executable: "genesis_plus_gx.exe",
    supportedFileExtensions: [".md", ".smd", ".gen"],
    configurable: true,
    icon: "/emulators/genesis-plus-gx-icon.png",
    website: "https://github.com/ekeeke/Genesis-Plus-GX",
    isInstalled: false,
    lastUpdated: "2022-11-10",
  },
  {
    id: "snes9x",
    name: "Snes9x",
    platform: "snes",
    version: "1.60",
    path: "/emulators/snes9x",
    executable: "snes9x.exe",
    supportedFileExtensions: [".sfc", ".smc"],
    configurable: true,
    icon: "/emulators/snes9x-icon.png",
    website: "http://www.snes9x.com/",
    isInstalled: true,
    lastUpdated: "2023-02-05",
  },
  {
    id: "mgba",
    name: "mGBA",
    platform: "gba",
    version: "0.10.0",
    path: "/emulators/mgba",
    executable: "mgba.exe",
    supportedFileExtensions: [".gba", ".gb", ".gbc"],
    configurable: true,
    icon: "/emulators/mgba-icon.png",
    website: "https://mgba.io/",
    isInstalled: true,
    lastUpdated: "2023-04-10",
  },
]

// Sample ROM data
const sampleROMs: ROM[] = [
  {
    id: "rom1",
    fileName: "Super Mario Bros.nes",
    filePath: "/roms/nes/Super Mario Bros.nes",
    fileSize: 40960,
    platform: "nes",
    title: "Super Mario Bros.",
    coverImage: "/roms/covers/super-mario-bros.png",
    description:
      "Super Mario Bros. is a platform game developed and published by Nintendo for the Nintendo Entertainment System (NES).",
    releaseYear: 1985,
    publisher: "Nintendo",
    developer: "Nintendo",
    genre: ["Platform"],
    tags: ["Classic", "Platformer"],
    favorite: true,
    lastPlayed: "2023-05-10T14:30:00Z",
    playTime: 3600,
    emulatorId: "nestopia",
    dateAdded: "2023-01-01T10:00:00Z",
    verified: true,
    region: "USA",
    language: ["English"],
  },
  {
    id: "rom2",
    fileName: "The Legend of Zelda.nes",
    filePath: "/roms/nes/The Legend of Zelda.nes",
    fileSize: 131072,
    platform: "nes",
    title: "The Legend of Zelda",
    coverImage: "/roms/covers/legend-of-zelda.png",
    description:
      "The Legend of Zelda is an action-adventure video game developed and published by Nintendo for the Nintendo Entertainment System (NES).",
    releaseYear: 1986,
    publisher: "Nintendo",
    developer: "Nintendo",
    genre: ["Action", "Adventure"],
    tags: ["Classic", "RPG"],
    favorite: true,
    lastPlayed: "2023-05-08T20:15:00Z",
    playTime: 7200,
    emulatorId: "nestopia",
    dateAdded: "2023-01-02T11:30:00Z",
    verified: true,
    region: "USA",
    language: ["English"],
  },
  {
    id: "rom3",
    fileName: "Super Mario 64.z64",
    filePath: "/roms/n64/Super Mario 64.z64",
    fileSize: 8388608,
    platform: "n64",
    title: "Super Mario 64",
    coverImage: "/roms/covers/super-mario-64.png",
    description:
      "Super Mario 64 is a 1996 platform game for the Nintendo 64 and the first in the Super Mario series to feature 3D gameplay.",
    releaseYear: 1996,
    publisher: "Nintendo",
    developer: "Nintendo",
    genre: ["Platform", "3D"],
    tags: ["Classic", "3D Platformer"],
    favorite: true,
    lastPlayed: "2023-05-12T18:45:00Z",
    playTime: 10800,
    emulatorId: "project64",
    dateAdded: "2023-01-03T14:20:00Z",
    verified: true,
    region: "USA",
    language: ["English"],
  },
  {
    id: "rom4",
    fileName: "Sonic the Hedgehog.md",
    filePath: "/roms/genesis/Sonic the Hedgehog.md",
    fileSize: 524288,
    platform: "genesis",
    title: "Sonic the Hedgehog",
    coverImage: "/roms/covers/sonic-the-hedgehog.png",
    description:
      "Sonic the Hedgehog is a platform game developed by Sonic Team and published by Sega for the Sega Genesis.",
    releaseYear: 1991,
    publisher: "Sega",
    developer: "Sonic Team",
    genre: ["Platform"],
    tags: ["Classic", "Fast-paced"],
    favorite: false,
    lastPlayed: "2023-05-05T12:10:00Z",
    playTime: 5400,
    emulatorId: "genesis-plus-gx",
    dateAdded: "2023-01-04T09:15:00Z",
    verified: true,
    region: "USA",
    language: ["English"],
  },
  {
    id: "rom5",
    fileName: "Super Metroid.sfc",
    filePath: "/roms/snes/Super Metroid.sfc",
    fileSize: 3145728,
    platform: "snes",
    title: "Super Metroid",
    coverImage: "/roms/covers/super-metroid.png",
    description:
      "Super Metroid is an action-adventure game developed and published by Nintendo for the Super Nintendo Entertainment System.",
    releaseYear: 1994,
    publisher: "Nintendo",
    developer: "Nintendo R&D1",
    genre: ["Action", "Adventure", "Metroidvania"],
    tags: ["Classic", "Exploration"],
    favorite: true,
    lastPlayed: "2023-05-11T21:30:00Z",
    playTime: 9000,
    emulatorId: "snes9x",
    dateAdded: "2023-01-05T16:45:00Z",
    verified: true,
    region: "USA",
    language: ["English"],
  },
  {
    id: "rom6",
    fileName: "Pokemon Emerald.gba",
    filePath: "/roms/gba/Pokemon Emerald.gba",
    fileSize: 16777216,
    platform: "gba",
    title: "Pokémon Emerald",
    coverImage: "/roms/covers/pokemon-emerald.png",
    description:
      "Pokémon Emerald is a role-playing video game developed by Game Freak and published by Nintendo for the Game Boy Advance.",
    releaseYear: 2004,
    publisher: "Nintendo",
    developer: "Game Freak",
    genre: ["RPG"],
    tags: ["Pokémon", "Turn-based"],
    favorite: false,
    lastPlayed: "2023-05-09T15:20:00Z",
    playTime: 14400,
    emulatorId: "mgba",
    dateAdded: "2023-01-06T13:10:00Z",
    verified: true,
    region: "USA",
    language: ["English"],
  },
]

export function useLegacyGames() {
  const [emulators, setEmulators] = useState<Emulator[]>(sampleEmulators)
  const [roms, setROMs] = useState<ROM[]>(sampleROMs)
  const [platforms, setPlatforms] = useState<PlatformInfo[]>(platformData)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  // Load platforms with ROM counts
  useEffect(() => {
    const platformsWithCounts = platforms.map((platform) => {
      const count = roms.filter((rom) => rom.platform === platform.id).length
      return { ...platform, romCount: count }
    })
    setPlatforms(platformsWithCounts)
  }, [roms])

  // Add a new emulator
  const addEmulator = useCallback((emulator: Omit<Emulator, "id" | "lastUpdated">) => {
    setLoading(true)
    setError(null)

    try {
      // In a real app, this would involve file system operations
      // and possibly downloading/installing the emulator
      const newEmulator: Emulator = {
        ...emulator,
        id: `emulator-${Date.now()}`,
        lastUpdated: new Date().toISOString(),
      }

      setEmulators((prev) => [...prev, newEmulator])
      setLoading(false)
      return newEmulator
    } catch (err) {
      setError("Failed to add emulator")
      setLoading(false)
      throw err
    }
  }, [])

  // Remove an emulator
  const removeEmulator = useCallback((emulatorId: string) => {
    setLoading(true)
    setError(null)

    try {
      // In a real app, this would involve file system operations
      setEmulators((prev) => prev.filter((e) => e.id !== emulatorId))

      // Update ROMs that were using this emulator
      setROMs((prev) => prev.map((rom) => (rom.emulatorId === emulatorId ? { ...rom, emulatorId: undefined } : rom)))

      setLoading(false)
      return true
    } catch (err) {
      setError("Failed to remove emulator")
      setLoading(false)
      throw err
    }
  }, [])

  // Update an emulator
  const updateEmulator = useCallback((emulatorId: string, updates: Partial<Emulator>) => {
    setLoading(true)
    setError(null)

    try {
      setEmulators((prev) =>
        prev.map((emulator) =>
          emulator.id === emulatorId ? { ...emulator, ...updates, lastUpdated: new Date().toISOString() } : emulator,
        ),
      )

      setLoading(false)
      return true
    } catch (err) {
      setError("Failed to update emulator")
      setLoading(false)
      throw err
    }
  }, [])

  // Add a new ROM
  const addROM = useCallback(
    (romData: Partial<ROM> & { fileName: string; filePath: string; fileSize: number }) => {
      setLoading(true)
      setError(null)

      try {
        // In a real app, this would involve file system operations
        // and possibly scanning the ROM for metadata

        // Detect platform from file extension
        const fileExt = romData.fileName.split(".").pop()?.toLowerCase()
        let detectedPlatform: EmulatorPlatform | undefined

        // Find a compatible emulator based on file extension
        for (const emulator of emulators) {
          if (emulator.supportedFileExtensions.some((ext) => ext.includes(fileExt || ""))) {
            detectedPlatform = emulator.platform
            break
          }
        }

        if (!detectedPlatform && !romData.platform) {
          throw new Error("Could not detect platform for ROM")
        }

        const newROM: ROM = {
          id: `rom-${Date.now()}`,
          fileName: romData.fileName,
          filePath: romData.filePath,
          fileSize: romData.fileSize,
          platform: romData.platform || detectedPlatform || "other",
          title: romData.title || romData.fileName.split(".")[0],
          favorite: romData.favorite || false,
          playTime: romData.playTime || 0,
          dateAdded: new Date().toISOString(),
          verified: romData.verified || false,
          ...romData,
        }

        setROMs((prev) => [...prev, newROM])
        setLoading(false)
        return newROM
      } catch (err) {
        setError("Failed to add ROM")
        setLoading(false)
        throw err
      }
    },
    [emulators],
  )

  // Remove a ROM
  const removeROM = useCallback((romId: string) => {
    setLoading(true)
    setError(null)

    try {
      // In a real app, this would involve file system operations
      setROMs((prev) => prev.filter((rom) => rom.id !== romId))
      setLoading(false)
      return true
    } catch (err) {
      setError("Failed to remove ROM")
      setLoading(false)
      throw err
    }
  }, [])

  // Update a ROM
  const updateROM = useCallback((romId: string, updates: Partial<ROM>) => {
    setLoading(true)
    setError(null)

    try {
      setROMs((prev) => prev.map((rom) => (rom.id === romId ? { ...rom, ...updates } : rom)))

      setLoading(false)
      return true
    } catch (err) {
      setError("Failed to update ROM")
      setLoading(false)
      throw err
    }
  }, [])

  // Launch a ROM with its associated emulator
  const launchROM = useCallback(
    (romId: string) => {
      setError(null)

      try {
        const rom = roms.find((r) => r.id === romId)
        if (!rom) {
          throw new Error("ROM not found")
        }

        if (!rom.emulatorId) {
          throw new Error("No emulator associated with this ROM")
        }

        const emulator = emulators.find((e) => e.id === rom.emulatorId)
        if (!emulator) {
          throw new Error("Emulator not found")
        }

        if (!emulator.isInstalled) {
          throw new Error("Emulator is not installed")
        }

        // In a real app, this would launch the emulator with the ROM
        console.log(`Launching ${rom.title} with ${emulator.name}`)

        // Update last played time and play time
        const now = new Date().toISOString()
        updateROM(romId, {
          lastPlayed: now,
          // In a real app, we would track actual play time
          playTime: rom.playTime + 60, // Add a minute for demonstration
        })

        return true
      } catch (err) {
        setError("Failed to launch ROM")
        throw err
      }
    },
    [roms, emulators, updateROM],
  )

  // Get ROMs for a specific platform
  const getROMsByPlatform = useCallback(
    (platformId: EmulatorPlatform) => {
      return roms.filter((rom) => rom.platform === platformId)
    },
    [roms],
  )

  // Get emulators for a specific platform
  const getEmulatorsByPlatform = useCallback(
    (platformId: EmulatorPlatform) => {
      return emulators.filter((emulator) => emulator.platform === platformId)
    },
    [emulators],
  )

  // Get platform info
  const getPlatformInfo = useCallback(
    (platformId: EmulatorPlatform) => {
      return platforms.find((platform) => platform.id === platformId)
    },
    [platforms],
  )

  return {
    emulators,
    roms,
    platforms,
    loading,
    error,
    addEmulator,
    removeEmulator,
    updateEmulator,
    addROM,
    removeROM,
    updateROM,
    launchROM,
    getROMsByPlatform,
    getEmulatorsByPlatform,
    getPlatformInfo,
  }
}
