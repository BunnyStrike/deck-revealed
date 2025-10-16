"use client"

import { useState, useEffect } from "react"
import { FocusableItem } from "@/components/ui/focusable-item"
import { Card } from "@/components/ui/card"
import { GamepadIcon as GameController, Plus, Trash, Download, Upload, Copy, Settings, Play } from "lucide-react"
import type {
  ControllerMapping,
  ControllerType,
  GameControllerConfig,
  GameControllerSettings,
} from "@/types/controller-mapping"
import type { Game } from "@/types/game-data"

interface GameSpecificProfilesProps {
  games: Game[]
  gameMappings: ControllerMapping[]
  gameConfigs: GameControllerConfig[]
  activeGame: string | null
  onSelectGame: (gameId: string | null) => void
  onCreateGameMapping: (gameId: string, gameName: string, controllerType: ControllerType, basedOn?: string) => string
  onDeleteGameMapping: (mappingId: string) => void
  onExportGameMapping: (mappingId: string) => void
  onImportGameMapping: () => void
  onCloneGameMapping: (mappingId: string, newName?: string) => string | null
  onUpdateGameConfig: (
    gameId: string,
    updates: Partial<Omit<GameControllerConfig, "id" | "gameId" | "gameName">>,
  ) => void
  onUpdateGameSettings: (mappingId: string, settings: Partial<GameControllerSettings>) => void
  onTestMapping: (mappingId: string, isGameMapping: boolean) => void
}

export function GameSpecificProfiles({
  games,
  gameMappings,
  gameConfigs,
  activeGame,
  onSelectGame,
  onCreateGameMapping,
  onDeleteGameMapping,
  onExportGameMapping,
  onImportGameMapping,
  onCloneGameMapping,
  onUpdateGameConfig,
  onUpdateGameSettings,
  onTestMapping,
}: GameSpecificProfilesProps) {
  const [selectedGame, setSelectedGame] = useState<Game | null>(null)
  const [showSettings, setShowSettings] = useState(false)
  const [currentSettings, setCurrentSettings] = useState<GameControllerSettings>({
    deadzone: 0.1,
    sensitivity: 0.7,
    vibrationIntensity: 0.5,
    invertYAxis: false,
    invertXAxis: false,
    triggerThreshold: 0.1,
  })

  // Find the selected game when activeGame changes
  useEffect(() => {
    if (activeGame) {
      const game = games.find((g) => g.id === activeGame) || null
      setSelectedGame(game)

      // Load settings if a game mapping exists
      const mapping = gameMappings.find((m) => m.gameId === activeGame)
      if (mapping) {
        setCurrentSettings({
          deadzone: mapping.deadzone || 0.1,
          sensitivity: mapping.sensitivity || 0.7,
          vibrationIntensity: mapping.vibrationIntensity || 0.5,
          invertYAxis: mapping.invertYAxis || false,
          invertXAxis: mapping.invertXAxis || false,
          triggerThreshold: mapping.triggerThreshold || 0.1,
        })
      }
    } else {
      setSelectedGame(null)
    }
  }, [activeGame, games, gameMappings])

  // Get the mapping for the selected game
  const getGameMapping = (gameId: string) => {
    return gameMappings.find((mapping) => mapping.gameId === gameId) || null
  }

  // Get the config for the selected game
  const getGameConfig = (gameId: string) => {
    return gameConfigs.find((config) => config.gameId === gameId) || null
  }

  // Handle creating a new game mapping
  const handleCreateGameMapping = (gameId: string, gameName: string) => {
    onCreateGameMapping(gameId, gameName, "xbox")
  }

  // Handle saving settings
  const handleSaveSettings = () => {
    if (selectedGame) {
      const mapping = getGameMapping(selectedGame.id)
      if (mapping) {
        onUpdateGameSettings(mapping.id, currentSettings)
        setShowSettings(false)
      }
    }
  }

  // Handle toggling auto-load
  const handleToggleAutoLoad = (gameId: string) => {
    const config = getGameConfig(gameId)
    if (config) {
      onUpdateGameConfig(gameId, { autoLoad: !config.autoLoad })
    }
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-semibold flex items-center">
          <GameController className="mr-2" size={20} />
          Game-Specific Profiles
        </h2>
        <div className="flex space-x-2">
          <FocusableItem
            focusKey="import-game-mapping"
            className="p-2 rounded-lg bg-muted/30 hover:bg-muted/50 transition-colors"
            onClick={onImportGameMapping}
          >
            <Upload size={18} />
          </FocusableItem>
        </div>
      </div>

      {showSettings && selectedGame ? (
        <Card className="p-4 bg-card border-border">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-medium">Controller Settings for {selectedGame.title}</h3>
            <FocusableItem
              focusKey="close-settings"
              className="p-1.5 rounded-lg bg-muted/30 hover:bg-muted/50 transition-colors"
              onClick={() => setShowSettings(false)}
            >
              <Trash size={16} />
            </FocusableItem>
          </div>

          <div className="space-y-4">
            <div>
              <label className="block text-sm text-muted-foreground mb-1">Deadzone</label>
              <div className="flex items-center">
                <input
                  type="range"
                  min="0"
                  max="0.5"
                  step="0.01"
                  value={currentSettings.deadzone}
                  onChange={(e) =>
                    setCurrentSettings((prev) => ({ ...prev, deadzone: Number.parseFloat(e.target.value) }))
                  }
                  className="w-full"
                />
                <span className="ml-2 min-w-[40px] text-right">{currentSettings.deadzone.toFixed(2)}</span>
              </div>
            </div>

            <div>
              <label className="block text-sm text-muted-foreground mb-1">Sensitivity</label>
              <div className="flex items-center">
                <input
                  type="range"
                  min="0.1"
                  max="2"
                  step="0.1"
                  value={currentSettings.sensitivity}
                  onChange={(e) =>
                    setCurrentSettings((prev) => ({ ...prev, sensitivity: Number.parseFloat(e.target.value) }))
                  }
                  className="w-full"
                />
                <span className="ml-2 min-w-[40px] text-right">{currentSettings.sensitivity.toFixed(1)}</span>
              </div>
            </div>

            <div>
              <label className="block text-sm text-muted-foreground mb-1">Vibration Intensity</label>
              <div className="flex items-center">
                <input
                  type="range"
                  min="0"
                  max="1"
                  step="0.1"
                  value={currentSettings.vibrationIntensity}
                  onChange={(e) =>
                    setCurrentSettings((prev) => ({ ...prev, vibrationIntensity: Number.parseFloat(e.target.value) }))
                  }
                  className="w-full"
                />
                <span className="ml-2 min-w-[40px] text-right">{currentSettings.vibrationIntensity.toFixed(1)}</span>
              </div>
            </div>

            <div>
              <label className="block text-sm text-muted-foreground mb-1">Trigger Threshold</label>
              <div className="flex items-center">
                <input
                  type="range"
                  min="0.05"
                  max="0.5"
                  step="0.05"
                  value={currentSettings.triggerThreshold}
                  onChange={(e) =>
                    setCurrentSettings((prev) => ({ ...prev, triggerThreshold: Number.parseFloat(e.target.value) }))
                  }
                  className="w-full"
                />
                <span className="ml-2 min-w-[40px] text-right">{currentSettings.triggerThreshold.toFixed(2)}</span>
              </div>
            </div>

            <div className="flex items-center space-x-4">
              <div className="flex items-center">
                <input
                  type="checkbox"
                  id="invertYAxis"
                  checked={currentSettings.invertYAxis}
                  onChange={(e) => setCurrentSettings((prev) => ({ ...prev, invertYAxis: e.target.checked }))}
                  className="mr-2"
                />
                <label htmlFor="invertYAxis" className="text-sm">
                  Invert Y-Axis
                </label>
              </div>
              <div className="flex items-center">
                <input
                  type="checkbox"
                  id="invertXAxis"
                  checked={currentSettings.invertXAxis}
                  onChange={(e) => setCurrentSettings((prev) => ({ ...prev, invertXAxis: e.target.checked }))}
                  className="mr-2"
                />
                <label htmlFor="invertXAxis" className="text-sm">
                  Invert X-Axis
                </label>
              </div>
            </div>

            <div className="flex justify-end space-x-2 pt-2">
              <FocusableItem
                focusKey="cancel-settings"
                className="px-3 py-1.5 rounded-lg bg-muted/30 hover:bg-muted/50 transition-colors text-sm"
                onClick={() => setShowSettings(false)}
              >
                Cancel
              </FocusableItem>
              <FocusableItem
                focusKey="save-settings"
                className="px-3 py-1.5 rounded-lg bg-primary/20 text-primary hover:bg-primary/30 transition-colors text-sm"
                onClick={handleSaveSettings}
              >
                Save Settings
              </FocusableItem>
            </div>
          </div>
        </Card>
      ) : (
        <div className="grid grid-cols-1 gap-3">
          {games.map((game) => {
            const mapping = getGameMapping(game.id)
            const config = getGameConfig(game.id)

            return (
              <FocusableItem
                key={game.id}
                focusKey={`game-${game.id}`}
                className={`p-4 rounded-xl transition-all ${
                  activeGame === game.id ? "neon-border bg-card shadow-lg" : "bg-muted/30 hover:bg-muted/50"
                }`}
                onClick={() => onSelectGame(game.id)}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <img
                      src={game.coverImage || `/placeholder.svg?height=40&width=40&query=game`}
                      alt={game.title}
                      className="w-10 h-10 rounded mr-3 object-cover"
                    />
                    <div>
                      <p className="font-medium">{game.title}</p>
                      {mapping ? (
                        <p className="text-sm text-muted-foreground">
                          {mapping.name}
                          {config?.autoLoad && <span className="ml-2 text-xs text-primary">(Auto-load)</span>}
                        </p>
                      ) : (
                        <p className="text-sm text-muted-foreground">No custom mapping</p>
                      )}
                    </div>
                  </div>

                  <div className="flex space-x-2">
                    {mapping ? (
                      <>
                        <FocusableItem
                          focusKey={`test-game-mapping-${game.id}`}
                          className="p-1.5 rounded-lg bg-muted/30 hover:bg-muted/50 transition-colors"
                          onClick={(e) => {
                            e.stopPropagation()
                            onTestMapping(mapping.id, true)
                          }}
                        >
                          <Play size={16} />
                        </FocusableItem>
                        <FocusableItem
                          focusKey={`settings-game-mapping-${game.id}`}
                          className="p-1.5 rounded-lg bg-muted/30 hover:bg-muted/50 transition-colors"
                          onClick={(e) => {
                            e.stopPropagation()
                            setSelectedGame(game)
                            setShowSettings(true)
                          }}
                        >
                          <Settings size={16} />
                        </FocusableItem>
                        <FocusableItem
                          focusKey={`clone-game-mapping-${game.id}`}
                          className="p-1.5 rounded-lg bg-muted/30 hover:bg-muted/50 transition-colors"
                          onClick={(e) => {
                            e.stopPropagation()
                            onCloneGameMapping(mapping.id)
                          }}
                        >
                          <Copy size={16} />
                        </FocusableItem>
                        <FocusableItem
                          focusKey={`export-game-mapping-${game.id}`}
                          className="p-1.5 rounded-lg bg-muted/30 hover:bg-muted/50 transition-colors"
                          onClick={(e) => {
                            e.stopPropagation()
                            onExportGameMapping(mapping.id)
                          }}
                        >
                          <Download size={16} />
                        </FocusableItem>
                        <FocusableItem
                          focusKey={`delete-game-mapping-${game.id}`}
                          className="p-1.5 rounded-lg bg-muted/30 hover:bg-muted/50 transition-colors"
                          onClick={(e) => {
                            e.stopPropagation()
                            onDeleteGameMapping(mapping.id)
                          }}
                        >
                          <Trash size={16} />
                        </FocusableItem>
                      </>
                    ) : (
                      <FocusableItem
                        focusKey={`create-game-mapping-${game.id}`}
                        className="p-1.5 rounded-lg bg-primary/20 text-primary hover:bg-primary/30 transition-colors"
                        onClick={(e) => {
                          e.stopPropagation()
                          handleCreateGameMapping(game.id, game.title)
                        }}
                      >
                        <Plus size={16} />
                      </FocusableItem>
                    )}
                  </div>
                </div>
              </FocusableItem>
            )
          })}
        </div>
      )}
    </div>
  )
}
