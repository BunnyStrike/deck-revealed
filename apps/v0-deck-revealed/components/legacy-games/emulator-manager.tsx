"use client"

import { useState } from "react"
import { Download, Trash2, Settings, ExternalLink, Check, AlertCircle, ArrowLeft } from "lucide-react"
import { Card } from "@/components/ui/card"
import { FocusableItem } from "@/components/ui/focusable-item"
import { useLegacyGames } from "@/hooks/use-legacy-games"
import type { Emulator, EmulatorPlatform } from "@/types/legacy-games"

interface EmulatorManagerProps {
  onBack: () => void
  platformFilter?: EmulatorPlatform
}

export function EmulatorManager({ onBack, platformFilter }: EmulatorManagerProps) {
  const { emulators, platforms, addEmulator, removeEmulator, updateEmulator } = useLegacyGames()
  const [activeTab, setActiveTab] = useState<"installed" | "available">("installed")
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState<string | null>(null)

  // Filter emulators based on platform and installation status
  const filteredEmulators = emulators.filter((emulator) => {
    if (platformFilter && emulator.platform !== platformFilter) {
      return false
    }

    if (activeTab === "installed") {
      return emulator.isInstalled
    } else {
      return !emulator.isInstalled
    }
  })

  const handleInstall = async (emulator: Emulator) => {
    setLoading(true)
    setError(null)
    setSuccess(null)

    try {
      // In a real app, this would download and install the emulator
      await updateEmulator(emulator.id, { isInstalled: true })
      setSuccess(`${emulator.name} installed successfully`)
      setLoading(false)
    } catch (err) {
      setError(`Failed to install ${emulator.name}`)
      setLoading(false)
    }
  }

  const handleUninstall = async (emulator: Emulator) => {
    setLoading(true)
    setError(null)
    setSuccess(null)

    try {
      // In a real app, this would uninstall the emulator
      await updateEmulator(emulator.id, { isInstalled: false })
      setSuccess(`${emulator.name} uninstalled successfully`)
      setLoading(false)
    } catch (err) {
      setError(`Failed to uninstall ${emulator.name}`)
      setLoading(false)
    }
  }

  const getPlatformName = (platformId: EmulatorPlatform) => {
    const platform = platforms.find((p) => p.id === platformId)
    return platform ? platform.name : platformId
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center">
          <FocusableItem
            focusKey="back-button"
            className="mr-4 p-2 hover:bg-muted rounded-full transition-colors"
            onClick={onBack}
          >
            <ArrowLeft className="w-5 h-5" />
          </FocusableItem>
          <h2 className="text-2xl font-bold">Emulator Manager</h2>
        </div>

        <div className="flex bg-card rounded-lg overflow-hidden border border-border">
          <button
            className={`px-4 py-2 text-sm font-medium ${activeTab === "installed" ? "bg-primary text-white" : "text-muted-foreground hover:text-foreground"}`}
            onClick={() => setActiveTab("installed")}
          >
            Installed
          </button>
          <button
            className={`px-4 py-2 text-sm font-medium ${activeTab === "available" ? "bg-primary text-white" : "text-muted-foreground hover:text-foreground"}`}
            onClick={() => setActiveTab("available")}
          >
            Available
          </button>
        </div>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-md flex items-center">
          <AlertCircle className="w-5 h-5 mr-2" />
          {error}
        </div>
      )}

      {success && (
        <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-md flex items-center">
          <Check className="w-5 h-5 mr-2" />
          {success}
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredEmulators.map((emulator) => (
          <Card key={emulator.id} className="overflow-hidden">
            <div className="p-4">
              <div className="flex items-center mb-3">
                <div className="w-10 h-10 bg-muted rounded-md flex items-center justify-center mr-3">
                  <img
                    src={emulator.icon || `/placeholder.svg?height=40&width=40&query=emulator icon`}
                    alt={emulator.name}
                    className="w-8 h-8 object-contain"
                  />
                </div>
                <div>
                  <h3 className="font-semibold">{emulator.name}</h3>
                  <p className="text-xs text-muted-foreground">
                    {getPlatformName(emulator.platform)} • v{emulator.version}
                  </p>
                </div>
              </div>

              <p className="text-sm text-muted-foreground mb-3">
                Supports: {emulator.supportedFileExtensions.join(", ")}
              </p>

              <div className="flex justify-between items-center">
                <div className="flex gap-2">
                  <a
                    href={emulator.website}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-muted-foreground hover:text-foreground transition-colors"
                  >
                    <ExternalLink className="w-4 h-4" />
                  </a>

                  {emulator.isInstalled && (
                    <button
                      className="text-muted-foreground hover:text-foreground transition-colors"
                      onClick={() => {
                        /* Open settings dialog */
                      }}
                    >
                      <Settings className="w-4 h-4" />
                    </button>
                  )}
                </div>

                {emulator.isInstalled ? (
                  <FocusableItem
                    focusKey={`uninstall-${emulator.id}`}
                    className="bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded-lg text-sm font-medium transition-all flex items-center"
                    onClick={() => handleUninstall(emulator)}
                    disabled={loading}
                  >
                    <Trash2 className="w-3 h-3 mr-1" />
                    Uninstall
                  </FocusableItem>
                ) : (
                  <FocusableItem
                    focusKey={`install-${emulator.id}`}
                    className="bg-primary hover:bg-primary/90 text-white px-3 py-1 rounded-lg text-sm font-medium transition-all flex items-center"
                    onClick={() => handleInstall(emulator)}
                    disabled={loading}
                  >
                    <Download className="w-3 h-3 mr-1" />
                    Install
                  </FocusableItem>
                )}
              </div>
            </div>
          </Card>
        ))}
      </div>

      {filteredEmulators.length === 0 && (
        <div className="text-center py-12">
          <p className="text-muted-foreground">
            {activeTab === "installed"
              ? "No emulators installed yet. Switch to the Available tab to install emulators."
              : "No additional emulators available for installation."}
          </p>
        </div>
      )}
    </div>
  )
}
