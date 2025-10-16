"use client"

import { useState } from "react"
import { Card } from "@/components/ui/card"
import { useControllerMapping } from "@/hooks/use-controller-mapping"
import { ControllerSelector } from "./controller-selector"
import { ProfileSelector } from "./profile-selector"
import { MappingEditor } from "./mapping-editor"
import { ControllerVisualization } from "./controller-visualization"
import { GameSpecificProfiles } from "./game-specific-profiles"
import { GameActionDescriptions } from "./game-action-descriptions"
import type { ControllerButton } from "@/types/controller-mapping"
import type { Game } from "@/types/game-data"

// Mock game data
const mockGames: Game[] = [
  {
    id: "cyberpunk",
    title: "Cyberpunk 2077",
    description: "An open-world, action-adventure RPG set in Night City",
    releaseDate: "2020-12-10",
    developer: "CD Projekt Red",
    publisher: "CD Projekt",
    genres: ["RPG", "Action", "Open World"],
    platforms: ["PC", "PlayStation", "Xbox"],
    coverImage: "/cyberpunk-header.png",
    screenshots: [
      "/cyberpunk-screenshot-1.png",
      "/cyberpunk-screenshot-2.png",
      "/cyberpunk-screenshot-3.png",
      "/cyberpunk-screenshot-4.png",
    ],
    rating: 4.2,
    metacritic: 86,
  },
  {
    id: "elden-ring",
    title: "Elden Ring",
    description: "An action RPG developed by FromSoftware and published by Bandai Namco Entertainment",
    releaseDate: "2022-02-25",
    developer: "FromSoftware",
    publisher: "Bandai Namco Entertainment",
    genres: ["Action RPG", "Open World"],
    platforms: ["PC", "PlayStation", "Xbox"],
    coverImage: "/elden-ring-header.png",
    screenshots: ["/elden-ring-screenshot-1.png", "/elden-ring-screenshot-2.png", "/elden-ring-screenshot-3.png"],
    rating: 4.8,
    metacritic: 96,
  },
  {
    id: "hades",
    title: "Hades",
    description: "A rogue-like dungeon crawler developed by Supergiant Games",
    releaseDate: "2020-09-17",
    developer: "Supergiant Games",
    publisher: "Supergiant Games",
    genres: ["Roguelike", "Action", "Indie"],
    platforms: ["PC", "PlayStation", "Xbox", "Switch"],
    coverImage: "/hades-header.png",
    screenshots: ["/hades-screenshot-1.png", "/hades-screenshot-2.png", "/hades-screenshot-3.png"],
    rating: 4.9,
    metacritic: 93,
  },
]

export function ControllerMapping() {
  const {
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
  } = useControllerMapping()

  const [highlightedButton, setHighlightedButton] = useState<ControllerButton | null>(null)
  const [activeTab, setActiveTab] = useState<"general" | "game-specific">("general")
  const [games] = useState<Game[]>(mockGames)

  // Handle profile export
  const handleExportProfile = (profileId: string) => {
    const jsonData = exportMapping(profileId, true)
    if (jsonData) {
      // In a real app, this would trigger a download
      alert("Profile exported successfully")
      console.log(jsonData)
    }
  }

  // Handle profile import
  const handleImportProfile = () => {
    // In a real app, this would open a file picker
    const jsonData = prompt("Paste profile JSON data:")
    if (jsonData) {
      const result = importMapping(jsonData)
      if (result.success) {
        alert(`Profile imported successfully`)
      } else {
        alert(`Import failed: ${result.error}`)
      }
    }
  }

  // Handle game mapping export
  const handleExportGameMapping = (mappingId: string) => {
    const jsonData = exportMapping(mappingId, false)
    if (jsonData) {
      // In a real app, this would trigger a download
      alert("Game mapping exported successfully")
      console.log(jsonData)
    }
  }

  // Handle game mapping import
  const handleImportGameMapping = () => {
    // In a real app, this would open a file picker
    const jsonData = prompt("Paste game mapping JSON data:")
    if (jsonData) {
      const result = importMapping(jsonData)
      if (result.success) {
        alert(`Game mapping imported successfully`)
      } else {
        alert(`Import failed: ${result.error}`)
      }
    }
  }

  // Get action descriptions for the active game
  const actionDescriptions = activeGame ? getGameActionDescriptions(activeGame) : []

  return (
    <div className="space-y-8 max-w-6xl mx-auto">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold gradient-text">Controller Mapping</h1>
        <div className="flex space-x-2">
          <button
            className={`px-4 py-2 rounded-lg transition-colors ${
              activeTab === "general" ? "bg-primary/20 text-primary" : "bg-muted/30 hover:bg-muted/50"
            }`}
            onClick={() => setActiveTab("general")}
          >
            General Profiles
          </button>
          <button
            className={`px-4 py-2 rounded-lg transition-colors ${
              activeTab === "game-specific" ? "bg-primary/20 text-primary" : "bg-muted/30 hover:bg-muted/50"
            }`}
            onClick={() => setActiveTab("game-specific")}
          >
            Game-Specific Profiles
          </button>
        </div>
      </div>

      {activeTab === "general" ? (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-1 space-y-6">
            <Card className="p-6 bg-card border-border rounded-xl">
              <ControllerSelector
                controllers={connectedControllers}
                activeController={activeController}
                onSelectController={setActiveController}
              />
            </Card>

            <Card className="p-6 bg-card border-border rounded-xl">
              <ProfileSelector
                profiles={controllerProfiles}
                activeProfile={activeProfile}
                onSelectProfile={setActiveProfile}
                onCreateProfile={createProfile}
                onDeleteProfile={deleteProfile}
                onExportProfile={handleExportProfile}
                onImportProfile={handleImportProfile}
              />
            </Card>
          </div>

          <div className="lg:col-span-2 space-y-6">
            <Card className="p-6 bg-card border-border rounded-xl">
              {currentProfile && (
                <MappingEditor
                  profile={currentProfile}
                  isListening={isListening}
                  lastButtonPressed={lastButtonPressed}
                  onUpdateMapping={updateProfileMapping}
                  onListenForButton={listenForButton}
                  onStopListening={stopListening}
                  onTestMapping={(profileId) => testMapping(profileId, false)}
                />
              )}
            </Card>

            <div>
              {currentProfile && currentProfile.mappings.length > 0 && (
                <ControllerVisualization
                  controllerType={currentProfile.controllerType}
                  mappings={currentProfile.mappings[0].mappings}
                  highlightedButton={highlightedButton}
                  onSelectButton={setHighlightedButton}
                />
              )}
            </div>
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-1 space-y-6">
            <Card className="p-6 bg-card border-border rounded-xl">
              <GameSpecificProfiles
                games={games}
                gameMappings={gameMappings}
                gameConfigs={gameConfigs}
                activeGame={activeGame}
                onSelectGame={setActiveGameAndLoadMapping}
                onCreateGameMapping={createGameMapping}
                onDeleteGameMapping={deleteGameMapping}
                onExportGameMapping={handleExportGameMapping}
                onImportGameMapping={handleImportGameMapping}
                onCloneGameMapping={(mappingId, newName) => cloneMapping(mappingId, false, newName)}
                onUpdateGameConfig={updateGameConfig}
                onUpdateGameSettings={updateGameControllerSettings}
                onTestMapping={testMapping}
              />
            </Card>

            {activeGame && actionDescriptions.length > 0 && (
              <Card className="p-6 bg-card border-border rounded-xl">
                <GameActionDescriptions gameId={activeGame} actionDescriptions={actionDescriptions} />
              </Card>
            )}
          </div>

          <div className="lg:col-span-2 space-y-6">
            {currentGameMapping ? (
              <>
                <Card className="p-6 bg-card border-border rounded-xl">
                  <MappingEditor
                    profile={{
                      id: currentGameMapping.id,
                      name: currentGameMapping.name,
                      controllerType: currentGameMapping.controllerType,
                      isDefault: false,
                      mappings: [currentGameMapping],
                    }}
                    isListening={isListening}
                    lastButtonPressed={lastButtonPressed}
                    onUpdateMapping={(_, action, button) => updateGameMapping(currentGameMapping.id, action, button)}
                    onListenForButton={listenForButton}
                    onStopListening={stopListening}
                    onTestMapping={(mappingId) => testMapping(mappingId, true)}
                  />
                </Card>

                <div>
                  <ControllerVisualization
                    controllerType={currentGameMapping.controllerType}
                    mappings={currentGameMapping.mappings}
                    highlightedButton={highlightedButton}
                    onSelectButton={setHighlightedButton}
                  />
                </div>
              </>
            ) : (
              <div className="flex items-center justify-center h-full">
                <div className="text-center p-8">
                  <p className="text-lg text-muted-foreground mb-4">Select a game to view or create a mapping</p>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  )
}
