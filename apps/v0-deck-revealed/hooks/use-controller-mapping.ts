"use client"

import { useState, useEffect, useCallback } from "react"
import type {
  ControllerMapping,
  ControllerProfile,
  ConnectedController,
  ControllerButton,
  GameAction,
  ControllerType,
  GameControllerConfig,
  GameActionDescription,
  GameControllerSettings,
} from "@/types/controller-mapping"

// Mock data for connected controllers
const mockConnectedControllers: ConnectedController[] = [
  {
    id: "controller1",
    name: "Xbox Controller",
    type: "xbox",
    connected: true,
    batteryLevel: 75,
    vibrationSupported: true,
    axesCount: 4,
    buttonCount: 17,
  },
  {
    id: "controller2",
    name: "DualSense Wireless Controller",
    type: "playstation",
    connected: true,
    batteryLevel: 45,
    vibrationSupported: true,
    axesCount: 6,
    buttonCount: 18,
  },
  {
    id: "controller3",
    name: "Nintendo Pro Controller",
    type: "nintendo",
    connected: false,
    batteryLevel: 0,
    vibrationSupported: true,
    axesCount: 4,
    buttonCount: 16,
  },
]

// Default mappings for different controller types
const defaultXboxMapping: Record<ControllerButton, GameAction> = {
  a: "jump",
  b: "menu_back",
  x: "reload",
  y: "interact",
  lb: "switch_weapon",
  rb: "attack",
  lt: "aim",
  rt: "shoot",
  l3: "sprint",
  r3: "crouch",
  dpad_up: "menu_up",
  dpad_down: "menu_down",
  dpad_left: "menu_left",
  dpad_right: "menu_right",
  start: "menu_start",
  select: "inventory",
  guide: "pause",
  ls_up: "move_up",
  ls_down: "move_down",
  ls_left: "move_left",
  ls_right: "move_right",
  rs_up: "camera_up",
  rs_down: "camera_down",
  rs_left: "camera_left",
  rs_right: "camera_right",
  share: "menu_select",
  options: "menu_select",
  touchpad: "map",
  cross: "jump",
  circle: "menu_back",
  square: "reload",
  triangle: "interact",
  l1: "switch_weapon",
  r1: "attack",
  l2: "aim",
  r2: "shoot",
}

// Mock data for controller profiles
const mockControllerProfiles: ControllerProfile[] = [
  {
    id: "profile1",
    name: "Default Profile",
    description: "Standard controller mapping for most games",
    controllerType: "xbox",
    isDefault: true,
    mappings: [
      {
        id: "mapping1",
        name: "Default Xbox Mapping",
        controllerType: "xbox",
        isDefault: true,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        mappings: defaultXboxMapping,
      },
    ],
  },
  {
    id: "profile2",
    name: "FPS Profile",
    description: "Optimized for first-person shooters",
    controllerType: "xbox",
    isDefault: false,
    mappings: [
      {
        id: "mapping2",
        name: "FPS Xbox Mapping",
        controllerType: "xbox",
        isDefault: false,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        mappings: {
          ...defaultXboxMapping,
          lb: "crouch",
          rb: "jump",
          a: "interact",
          b: "reload",
          x: "switch_weapon",
          y: "use_item",
        },
      },
    ],
  },
  {
    id: "profile3",
    name: "Racing Profile",
    description: "Optimized for racing games",
    controllerType: "xbox",
    isDefault: false,
    mappings: [
      {
        id: "mapping3",
        name: "Racing Xbox Mapping",
        controllerType: "xbox",
        isDefault: false,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        mappings: {
          ...defaultXboxMapping,
          rt: "accelerate",
          lt: "brake",
          a: "boost",
          b: "handbrake",
          x: "look_back",
          y: "change_view",
          lb: "gear_down",
          rb: "gear_up",
        },
      },
    ],
  },
]

// Mock data for game-specific mappings
const mockGameMappings: ControllerMapping[] = [
  {
    id: "game-mapping1",
    name: "Cyberpunk 2077 Mapping",
    controllerType: "xbox",
    gameId: "cyberpunk",
    gameName: "Cyberpunk 2077",
    isDefault: false,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    mappings: {
      ...defaultXboxMapping,
      lb: "scan",
      rb: "quick_hack",
      x: "reload",
      y: "switch_cyberwear",
    },
    deadzone: 0.1,
    sensitivity: 0.8,
    vibrationIntensity: 0.7,
    invertYAxis: false,
    invertXAxis: false,
    triggerThreshold: 0.2,
  },
  {
    id: "game-mapping2",
    name: "Elden Ring Mapping",
    controllerType: "xbox",
    gameId: "elden-ring",
    gameName: "Elden Ring",
    isDefault: false,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    mappings: {
      ...defaultXboxMapping,
      rb: "light_attack",
      rt: "heavy_attack",
      lb: "block",
      lt: "skill",
      y: "use_item",
      x: "interact",
      a: "dodge",
      b: "sprint",
    },
    deadzone: 0.15,
    sensitivity: 0.7,
    vibrationIntensity: 0.8,
    invertYAxis: false,
    invertXAxis: false,
    triggerThreshold: 0.1,
  },
  {
    id: "game-mapping3",
    name: "Hades Mapping",
    controllerType: "xbox",
    gameId: "hades",
    gameName: "Hades",
    isDefault: false,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    mappings: {
      ...defaultXboxMapping,
      x: "special_ability",
      rb: "attack",
      rt: "cast",
      lb: "summon",
      a: "dash",
      b: "interact",
    },
    deadzone: 0.1,
    sensitivity: 0.9,
    vibrationIntensity: 0.6,
    invertYAxis: false,
    invertXAxis: false,
    triggerThreshold: 0.15,
  },
]

// Mock data for game controller configurations
const mockGameControllerConfigs: GameControllerConfig[] = [
  {
    id: "config1",
    gameId: "cyberpunk",
    gameName: "Cyberpunk 2077",
    controllerMappingId: "game-mapping1",
    autoLoad: true,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: "config2",
    gameId: "elden-ring",
    gameName: "Elden Ring",
    controllerMappingId: "game-mapping2",
    autoLoad: true,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: "config3",
    gameId: "hades",
    gameName: "Hades",
    controllerMappingId: "game-mapping3",
    autoLoad: true,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
]

// Mock data for game action descriptions
const mockGameActionDescriptions: Record<string, GameActionDescription[]> = {
  cyberpunk: [
    {
      action: "scan",
      description: "Scan the environment for interactive objects",
      context: "Exploration",
      importance: "primary",
    },
    {
      action: "quick_hack",
      description: "Perform a quick hack on the targeted enemy or device",
      context: "Combat",
      importance: "primary",
    },
    {
      action: "switch_cyberwear",
      description: "Switch between installed cybernetic enhancements",
      context: "Equipment",
      importance: "secondary",
    },
  ],
  "elden-ring": [
    {
      action: "light_attack",
      description: "Perform a quick, low-damage attack",
      context: "Combat",
      importance: "primary",
    },
    {
      action: "heavy_attack",
      description: "Perform a slow, high-damage attack",
      context: "Combat",
      importance: "primary",
    },
    {
      action: "skill",
      description: "Use the equipped weapon's special skill",
      context: "Combat",
      importance: "secondary",
    },
    { action: "dodge", description: "Quickly evade attacks", context: "Combat", importance: "primary" },
  ],
  hades: [
    { action: "attack", description: "Perform your main attack", context: "Combat", importance: "primary" },
    {
      action: "special_ability",
      description: "Use your weapon's special ability",
      context: "Combat",
      importance: "primary",
    },
    { action: "cast", description: "Cast your equipped Cast ability", context: "Combat", importance: "secondary" },
    { action: "dash", description: "Quickly dash to avoid damage", context: "Movement", importance: "primary" },
    { action: "summon", description: "Summon assistance from the gods", context: "Combat", importance: "secondary" },
  ],
}

export function useControllerMapping() {
  const [connectedControllers, setConnectedControllers] = useState<ConnectedController[]>(mockConnectedControllers)
  const [controllerProfiles, setControllerProfiles] = useState<ControllerProfile[]>(mockControllerProfiles)
  const [gameMappings, setGameMappings] = useState<ControllerMapping[]>(mockGameMappings)
  const [gameConfigs, setGameConfigs] = useState<GameControllerConfig[]>(mockGameControllerConfigs)
  const [activeProfile, setActiveProfile] = useState<string>(mockControllerProfiles[0].id)
  const [activeController, setActiveController] = useState<string | null>(
    mockConnectedControllers.find((c) => c.connected)?.id || null,
  )
  const [activeGame, setActiveGame] = useState<string | null>(null)
  const [isListening, setIsListening] = useState(false)
  const [listeningFor, setListeningFor] = useState<{
    action: GameAction
    callback: (button: ControllerButton) => void
  } | null>(null)
  const [lastButtonPressed, setLastButtonPressed] = useState<ControllerButton | null>(null)

  // Get the active profile object
  const currentProfile = controllerProfiles.find((profile) => profile.id === activeProfile) || controllerProfiles[0]

  // Get the active controller object
  const currentController = connectedControllers.find((controller) => controller.id === activeController) || null

  // Get the active game mapping
  const currentGameMapping = activeGame ? gameMappings.find((mapping) => mapping.gameId === activeGame) || null : null

  // Get the default mapping for the current controller type
  const getDefaultMapping = useCallback((controllerType: ControllerType): Record<ControllerButton, GameAction> => {
    // For now, we'll just return the Xbox mapping for all types
    // In a real implementation, we'd have different defaults for different controller types
    return defaultXboxMapping
  }, [])

  // Listen for controller input
  useEffect(() => {
    if (!isListening || !listeningFor) return

    const handleGamepadInput = () => {
      // This would connect to the gamepad API in a real implementation
      // For now, we'll just simulate a button press after a delay
      const simulateButtonPress = setTimeout(() => {
        const buttons: ControllerButton[] = [
          "a",
          "b",
          "x",
          "y",
          "lb",
          "rb",
          "lt",
          "rt",
          "l3",
          "r3",
          "dpad_up",
          "dpad_down",
          "dpad_left",
          "dpad_right",
          "start",
          "select",
        ]
        const randomButton = buttons[Math.floor(Math.random() * buttons.length)]
        setLastButtonPressed(randomButton)

        if (listeningFor) {
          listeningFor.callback(randomButton)
          setIsListening(false)
          setListeningFor(null)
        }
      }, 2000)

      return () => clearTimeout(simulateButtonPress)
    }

    const cleanup = handleGamepadInput()
    return cleanup
  }, [isListening, listeningFor])

  // Start listening for a button press to map to an action
  const listenForButton = useCallback((action: GameAction, callback: (button: ControllerButton) => void) => {
    setIsListening(true)
    setListeningFor({ action, callback })
  }, [])

  // Stop listening for button presses
  const stopListening = useCallback(() => {
    setIsListening(false)
    setListeningFor(null)
  }, [])

  // Create a new profile
  const createProfile = useCallback(
    (name: string, description: string, controllerType: ControllerType) => {
      const newProfile: ControllerProfile = {
        id: `profile-${Date.now()}`,
        name,
        description,
        controllerType,
        isDefault: false,
        mappings: [
          {
            id: `mapping-${Date.now()}`,
            name: `${name} Default Mapping`,
            controllerType,
            isDefault: true,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
            mappings: getDefaultMapping(controllerType),
          },
        ],
      }

      setControllerProfiles((prev) => [...prev, newProfile])
      return newProfile.id
    },
    [getDefaultMapping],
  )

  // Update a profile
  const updateProfile = useCallback(
    (profileId: string, updates: Partial<Omit<ControllerProfile, "id" | "mappings">>) => {
      setControllerProfiles((prev) =>
        prev.map((profile) =>
          profile.id === profileId ? { ...profile, ...updates, updatedAt: new Date().toISOString() } : profile,
        ),
      )
    },
    [],
  )

  // Delete a profile
  const deleteProfile = useCallback(
    (profileId: string) => {
      setControllerProfiles((prev) => prev.filter((profile) => profile.id !== profileId))

      // If the active profile is deleted, switch to the default profile
      if (activeProfile === profileId) {
        const defaultProfile = controllerProfiles.find((p) => p.isDefault)
        if (defaultProfile) {
          setActiveProfile(defaultProfile.id)
        } else if (controllerProfiles.length > 0) {
          setActiveProfile(controllerProfiles[0].id)
        }
      }
    },
    [activeProfile, controllerProfiles],
  )

  // Create a new mapping for a game
  const createGameMapping = useCallback(
    (
      gameId: string,
      gameName: string,
      controllerType: ControllerType,
      basedOn?: string, // Profile ID to base the mapping on
    ) => {
      let baseMappings: Record<ControllerButton, GameAction>

      if (basedOn) {
        const baseProfile = controllerProfiles.find((p) => p.id === basedOn)
        if (baseProfile && baseProfile.mappings.length > 0) {
          baseMappings = baseProfile.mappings[0].mappings
        } else {
          baseMappings = getDefaultMapping(controllerType)
        }
      } else {
        baseMappings = getDefaultMapping(controllerType)
      }

      const newMapping: ControllerMapping = {
        id: `game-mapping-${Date.now()}`,
        name: `${gameName} Mapping`,
        controllerType,
        gameId,
        gameName,
        isDefault: false,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        mappings: { ...baseMappings },
        deadzone: 0.1,
        sensitivity: 0.7,
        vibrationIntensity: 0.5,
        invertYAxis: false,
        invertXAxis: false,
        triggerThreshold: 0.1,
      }

      setGameMappings((prev) => [...prev, newMapping])

      // Create a game config for this mapping
      const newConfig: GameControllerConfig = {
        id: `config-${Date.now()}`,
        gameId,
        gameName,
        controllerMappingId: newMapping.id,
        autoLoad: true,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      }

      setGameConfigs((prev) => [...prev, newConfig])

      return newMapping.id
    },
    [controllerProfiles, getDefaultMapping],
  )

  // Update a game mapping
  const updateGameMapping = useCallback((mappingId: string, action: GameAction, button: ControllerButton) => {
    setGameMappings((prev) =>
      prev.map((mapping) => {
        if (mapping.id === mappingId) {
          const updatedMappings = { ...mapping.mappings }

          // Find and remove any existing mapping for this button
          Object.entries(updatedMappings).forEach(([key, value]) => {
            if (key === button) {
              updatedMappings[key as ControllerButton] = action
            }
          })

          return {
            ...mapping,
            mappings: updatedMappings,
            updatedAt: new Date().toISOString(),
          }
        }
        return mapping
      }),
    )
  }, [])

  // Update a profile mapping
  const updateProfileMapping = useCallback((profileId: string, action: GameAction, button: ControllerButton) => {
    setControllerProfiles((prev) =>
      prev.map((profile) => {
        if (profile.id === profileId && profile.mappings.length > 0) {
          const updatedMappings = [...profile.mappings]
          const defaultMapping = updatedMappings[0]

          const updatedButtonMappings = { ...defaultMapping.mappings }
          updatedButtonMappings[button] = action

          updatedMappings[0] = {
            ...defaultMapping,
            mappings: updatedButtonMappings,
            updatedAt: new Date().toISOString(),
          }

          return {
            ...profile,
            mappings: updatedMappings,
          }
        }
        return profile
      }),
    )
  }, [])

  // Delete a game mapping
  const deleteGameMapping = useCallback((mappingId: string) => {
    setGameMappings((prev) => prev.filter((mapping) => mapping.id !== mappingId))

    // Also delete any game configs that use this mapping
    setGameConfigs((prev) => prev.filter((config) => config.controllerMappingId !== mappingId))
  }, [])

  // Update game controller settings
  const updateGameControllerSettings = useCallback((mappingId: string, settings: Partial<GameControllerSettings>) => {
    setGameMappings((prev) =>
      prev.map((mapping) => {
        if (mapping.id === mappingId) {
          return {
            ...mapping,
            ...settings,
            updatedAt: new Date().toISOString(),
          }
        }
        return mapping
      }),
    )
  }, [])

  // Get game action descriptions
  const getGameActionDescriptions = useCallback((gameId: string): GameActionDescription[] => {
    return mockGameActionDescriptions[gameId] || []
  }, [])

  // Export a profile or game mapping to JSON
  const exportMapping = useCallback(
    (id: string, isProfile: boolean) => {
      let dataToExport

      if (isProfile) {
        dataToExport = controllerProfiles.find((profile) => profile.id === id)
      } else {
        dataToExport = gameMappings.find((mapping) => mapping.id === id)
      }

      if (dataToExport) {
        return JSON.stringify(dataToExport, null, 2)
      }

      return null
    },
    [controllerProfiles, gameMappings],
  )

  // Import a profile or game mapping from JSON
  const importMapping = useCallback(
    (jsonData: string) => {
      try {
        const data = JSON.parse(jsonData)

        if (data.mappings && Array.isArray(data.mappings)) {
          // It's a profile
          const newProfile: ControllerProfile = {
            ...data,
            id: `profile-${Date.now()}`,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
            isDefault: false,
          }

          setControllerProfiles((prev) => [...prev, newProfile])
          return { success: true, id: newProfile.id, type: "profile" }
        } else if (data.mappings && typeof data.mappings === "object") {
          // It's a game mapping
          const newMapping: ControllerMapping = {
            ...data,
            id: `game-mapping-${Date.now()}`,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
            isDefault: false,
          }

          setGameMappings((prev) => [...prev, newMapping])

          // Create a game config for this mapping if it doesn't exist
          if (data.gameId && !gameConfigs.some((config) => config.gameId === data.gameId)) {
            const newConfig: GameControllerConfig = {
              id: `config-${Date.now()}`,
              gameId: data.gameId,
              gameName: data.gameName || data.gameId,
              controllerMappingId: newMapping.id,
              autoLoad: true,
              createdAt: new Date().toISOString(),
              updatedAt: new Date().toISOString(),
            }

            setGameConfigs((prev) => [...prev, newConfig])
          }

          return { success: true, id: newMapping.id, type: "game-mapping" }
        }

        return { success: false, error: "Invalid mapping data format" }
      } catch (error) {
        return { success: false, error: "Failed to parse JSON data" }
      }
    },
    [gameConfigs],
  )

  // Get a mapping for a specific game
  const getGameMapping = useCallback(
    (gameId: string) => {
      return gameMappings.find((mapping) => mapping.gameId === gameId) || null
    },
    [gameMappings],
  )

  // Get a game config
  const getGameConfig = useCallback(
    (gameId: string) => {
      return gameConfigs.find((config) => config.gameId === gameId) || null
    },
    [gameConfigs],
  )

  // Update a game config
  const updateGameConfig = useCallback(
    (gameId: string, updates: Partial<Omit<GameControllerConfig, "id" | "gameId" | "gameName">>) => {
      setGameConfigs((prev) =>
        prev.map((config) => {
          if (config.gameId === gameId) {
            return {
              ...config,
              ...updates,
              updatedAt: new Date().toISOString(),
            }
          }
          return config
        }),
      )
    },
    [],
  )

  // Set the active game and load its mapping
  const setActiveGameAndLoadMapping = useCallback(
    (gameId: string | null) => {
      setActiveGame(gameId)

      if (gameId) {
        const config = gameConfigs.find((c) => c.gameId === gameId)
        if (config && config.autoLoad) {
          const mapping = gameMappings.find((m) => m.id === config.controllerMappingId)
          if (mapping) {
            // In a real implementation, this would apply the mapping to the controller
            console.log(`Loading mapping for ${gameId}: ${mapping.name}`)
          }
        }
      }
    },
    [gameConfigs, gameMappings],
  )

  // Test a controller mapping
  const testMapping = useCallback(
    (mappingId: string, isGameMapping = false) => {
      // In a real implementation, this would set up a test environment
      // For now, we'll just return the mapping
      if (isGameMapping) {
        return gameMappings.find((m) => m.id === mappingId)?.mappings || null
      } else {
        const profile = controllerProfiles.find((p) => p.id === mappingId)
        return profile?.mappings[0]?.mappings || null
      }
    },
    [controllerProfiles, gameMappings],
  )

  // Clone a profile or game mapping
  const cloneMapping = useCallback(
    (id: string, isProfile: boolean, newName?: string) => {
      if (isProfile) {
        const profileToClone = controllerProfiles.find((p) => p.id === id)
        if (profileToClone) {
          const newProfile: ControllerProfile = {
            ...profileToClone,
            id: `profile-${Date.now()}`,
            name: newName || `${profileToClone.name} (Copy)`,
            isDefault: false,
            mappings: profileToClone.mappings.map((m) => ({
              ...m,
              id: `mapping-${Date.now()}`,
              name: `${m.name} (Copy)`,
              isDefault: false,
              createdAt: new Date().toISOString(),
              updatedAt: new Date().toISOString(),
            })),
          }

          setControllerProfiles((prev) => [...prev, newProfile])
          return newProfile.id
        }
      } else {
        const mappingToClone = gameMappings.find((m) => m.id === id)
        if (mappingToClone) {
          const newMapping: ControllerMapping = {
            ...mappingToClone,
            id: `game-mapping-${Date.now()}`,
            name: newName || `${mappingToClone.name} (Copy)`,
            isDefault: false,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
          }

          setGameMappings((prev) => [...prev, newMapping])
          return newMapping.id
        }
      }
      return null
    },
    [controllerProfiles, gameMappings],
  )

  return {
    connectedControllers,
    controllerProfiles,
    gameMappings,
    gameConfigs,
    activeProfile,
    activeController,
    activeGame,
    currentProfile,
    currentController,
    currentGameMapping,
    isListening,
    lastButtonPressed,
    setActiveProfile,
    setActiveController,
    setActiveGameAndLoadMapping,
    listenForButton,
    stopListening,
    createProfile,
    updateProfile,
    deleteProfile,
    createGameMapping,
    updateGameMapping,
    updateProfileMapping,
    deleteGameMapping,
    updateGameControllerSettings,
    getGameActionDescriptions,
    exportMapping,
    importMapping,
    getGameMapping,
    getGameConfig,
    updateGameConfig,
    testMapping,
    cloneMapping,
  }
}
