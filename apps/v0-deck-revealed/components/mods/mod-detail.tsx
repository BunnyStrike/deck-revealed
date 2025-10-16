"use client"

import { useState } from "react"
import {
  ChevronLeft,
  Download,
  Tag,
  Info,
  Clock,
  FileText,
  Settings,
  AlertTriangle,
  Check,
  X,
  ExternalLink,
  Trash2,
  Cpu,
} from "lucide-react"
import { FocusableItem } from "@/components/ui/focusable-item"
import { Card } from "@/components/ui/card"
import { useMods } from "@/hooks/use-mods"

interface ModDetailProps {
  modId: string
  onBack: () => void
}

export default function ModDetail({ modId, onBack }: ModDetailProps) {
  const [activeTab, setActiveTab] = useState<"overview" | "versions" | "requirements" | "settings">("overview")
  const [currentScreenshot, setCurrentScreenshot] = useState(0)

  const { mods, installMod, uninstallMod, toggleModEnabled } = useMods()
  const mod = mods.find((m) => m.id === modId)

  if (!mod) {
    return (
      <div className="p-8 text-center">
        <h2 className="text-xl font-semibold mb-2">Mod not found</h2>
        <p className="text-muted-foreground mb-4">The mod you're looking for doesn't exist or has been removed.</p>
        <FocusableItem focusKey="back-to-mods" className="inline-flex items-center" onClick={onBack}>
          <ChevronLeft className="mr-1" size={16} />
          <span>Back to Mods</span>
        </FocusableItem>
      </div>
    )
  }

  // Format date
  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    })
  }

  // Navigate through screenshots
  const nextScreenshot = () => {
    setCurrentScreenshot((prev) => (prev + 1) % mod.screenshots.length)
  }

  const prevScreenshot = () => {
    setCurrentScreenshot((prev) => (prev - 1 + mod.screenshots.length) % mod.screenshots.length)
  }

  // Handle install/uninstall
  const handleInstallToggle = () => {
    if (mod.installed) {
      uninstallMod(mod.id)
    } else {
      installMod(mod.id)
    }
  }

  // Handle enable/disable
  const handleEnableToggle = () => {
    toggleModEnabled(mod.id)
  }

  return (
    <div className="h-full overflow-y-auto pb-8">
      {/* Back button */}
      <FocusableItem
        focusKey="back-button"
        className="inline-flex items-center text-muted-foreground hover:text-foreground mb-4 transition-colors"
        onClick={onBack}
      >
        <ChevronLeft className="mr-1" size={18} />
        <span>Back to Mods</span>
      </FocusableItem>

      {/* Mod header */}
      <div className="relative w-full h-64 rounded-xl overflow-hidden mb-6">
        <img
          src={mod.banner || mod.thumbnail || "/placeholder.svg?height=300&width=800&query=game mod banner"}
          alt={mod.name}
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-background via-background/70 to-transparent"></div>

        <div className="absolute bottom-0 left-0 p-6 w-full">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
            <div>
              <div className="flex flex-wrap gap-2 mb-2">
                {mod.categories.map((category) => (
                  <span
                    key={category.id}
                    className="bg-primary/20 text-primary text-xs font-medium px-2 py-1 rounded-full"
                  >
                    {category.name}
                  </span>
                ))}
              </div>
              <h1 className="text-3xl md:text-4xl font-bold mb-1">{mod.name}</h1>
              <p className="text-muted-foreground">
                by {mod.author.name} • Updated {formatDate(mod.updatedAt)}
              </p>
            </div>

            <div className="flex gap-2">
              <FocusableItem
                focusKey="install-mod"
                className={`${
                  mod.installed ? "bg-red-600 hover:bg-red-700" : "bg-primary hover:bg-primary/90"
                } text-white px-6 py-3 rounded-lg font-medium transition-all flex items-center gap-2`}
                onClick={handleInstallToggle}
              >
                {mod.installed ? (
                  <>
                    <Trash2 size={18} />
                    <span>Uninstall</span>
                  </>
                ) : (
                  <>
                    <Download size={18} />
                    <span>Install</span>
                  </>
                )}
              </FocusableItem>

              {mod.installed && (
                <FocusableItem
                  focusKey="toggle-mod"
                  className={`${
                    mod.enabled ? "bg-green-600 hover:bg-green-700" : "bg-muted/50 hover:bg-muted"
                  } text-white px-6 py-3 rounded-lg font-medium transition-all flex items-center gap-2`}
                  onClick={handleEnableToggle}
                >
                  {mod.enabled ? (
                    <>
                      <Check size={18} />
                      <span>Enabled</span>
                    </>
                  ) : (
                    <>
                      <X size={18} />
                      <span>Disabled</span>
                    </>
                  )}
                </FocusableItem>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Mod stats bar */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        <Card className="bg-card border-border p-4 rounded-xl">
          <div className="flex items-center">
            <div className="bg-primary/20 p-2 rounded-lg mr-3">
              <Download className="text-primary" size={20} />
            </div>
            <div>
              <p className="text-muted-foreground text-sm">Downloads</p>
              <p className="font-bold">{mod.downloadCount.toLocaleString()}</p>
            </div>
          </div>
        </Card>

        <Card className="bg-card border-border p-4 rounded-xl">
          <div className="flex items-center">
            <div className="bg-secondary/20 p-2 rounded-lg mr-3">
              <svg
                className="text-secondary w-5 h-5"
                fill="currentColor"
                viewBox="0 0 20 20"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"></path>
              </svg>
            </div>
            <div>
              <p className="text-muted-foreground text-sm">Rating</p>
              <p className="font-bold">
                {mod.rating.toFixed(1)}/5 ({mod.ratingCount})
              </p>
            </div>
          </div>
        </Card>

        <Card className="bg-card border-border p-4 rounded-xl">
          <div className="flex items-center">
            <div className="bg-accent/20 p-2 rounded-lg mr-3">
              <Tag className="text-accent" size={20} />
            </div>
            <div>
              <p className="text-muted-foreground text-sm">Version</p>
              <p className="font-bold">v{mod.latestVersion.version}</p>
            </div>
          </div>
        </Card>

        <Card className="bg-card border-border p-4 rounded-xl">
          <div className="flex items-center">
            <div className="bg-primary/20 p-2 rounded-lg mr-3">
              <Clock className="text-primary" size={20} />
            </div>
            <div>
              <p className="text-muted-foreground text-sm">Updated</p>
              <p className="font-bold">{new Date(mod.updatedAt).toLocaleDateString()}</p>
            </div>
          </div>
        </Card>
      </div>

      {/* Tabs */}
      <div className="border-b border-border mb-6">
        <div className="flex overflow-x-auto scrollbar-thin">
          {[
            { id: "overview", label: "Overview" },
            { id: "versions", label: "Versions" },
            { id: "requirements", label: "Requirements" },
            { id: "settings", label: "Settings" },
          ].map((tab) => (
            <FocusableItem
              key={tab.id}
              focusKey={`tab-${tab.id}`}
              className={`px-4 py-3 font-medium whitespace-nowrap transition-colors ${
                activeTab === tab.id
                  ? "text-primary border-b-2 border-primary"
                  : "text-muted-foreground hover:text-foreground"
              }`}
              onClick={() => setActiveTab(tab.id as any)}
            >
              {tab.label}
            </FocusableItem>
          ))}
        </div>
      </div>

      {/* Tab content */}
      <div className="space-y-6">
        {/* Overview Tab */}
        {activeTab === "overview" && (
          <>
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <div className="lg:col-span-2 space-y-6">
                {/* Description */}
                <Card className="bg-card border-border p-6 rounded-xl">
                  <h2 className="text-xl font-semibold mb-4 flex items-center">
                    <Info className="mr-2" size={20} />
                    About
                  </h2>
                  <p className="text-muted-foreground leading-relaxed whitespace-pre-line">{mod.description}</p>

                  <div className="mt-4 flex flex-wrap gap-2">
                    {mod.tags.map((tag) => (
                      <span key={tag} className="bg-muted/50 text-muted-foreground text-xs px-2 py-1 rounded-full">
                        {tag}
                      </span>
                    ))}
                  </div>
                </Card>

                {/* Screenshots */}
                {mod.screenshots.length > 0 && (
                  <Card className="bg-card border-border p-6 rounded-xl">
                    <h2 className="text-xl font-semibold mb-4">Screenshots</h2>

                    <div className="relative">
                      <div className="relative w-full h-[300px] rounded-xl overflow-hidden">
                        <img
                          src={mod.screenshots[currentScreenshot].url || "/placeholder.svg"}
                          alt={mod.screenshots[currentScreenshot].caption || `Screenshot ${currentScreenshot + 1}`}
                          className="w-full h-full object-cover"
                        />
                      </div>

                      {mod.screenshots.length > 1 && (
                        <>
                          <FocusableItem
                            focusKey="prev-screenshot"
                            className="absolute left-4 top-1/2 -translate-y-1/2 bg-card/80 backdrop-blur-sm p-2 rounded-full text-foreground hover:bg-card transition-colors"
                            onClick={prevScreenshot}
                          >
                            <ChevronLeft size={24} />
                          </FocusableItem>

                          <FocusableItem
                            focusKey="next-screenshot"
                            className="absolute right-4 top-1/2 -translate-y-1/2 bg-card/80 backdrop-blur-sm p-2 rounded-full text-foreground hover:bg-card transition-colors"
                            onClick={nextScreenshot}
                          >
                            <ChevronLeft size={24} className="rotate-180" />
                          </FocusableItem>
                        </>
                      )}

                      {mod.screenshots[currentScreenshot].caption && (
                        <div className="absolute bottom-4 left-1/2 -translate-x-1/2 bg-card/80 backdrop-blur-sm px-3 py-1 rounded-full text-sm max-w-[80%] text-center">
                          {mod.screenshots[currentScreenshot].caption}
                        </div>
                      )}
                    </div>

                    {mod.screenshots.length > 1 && (
                      <div className="grid grid-cols-4 gap-2 mt-4">
                        {mod.screenshots.map((screenshot, index) => (
                          <FocusableItem
                            key={screenshot.id}
                            focusKey={`thumbnail-${index}`}
                            className={`rounded-lg overflow-hidden border-2 transition-all ${
                              currentScreenshot === index ? "border-primary" : "border-transparent hover:border-muted"
                            }`}
                            onClick={() => setCurrentScreenshot(index)}
                          >
                            <img
                              src={screenshot.url || "/placeholder.svg"}
                              alt={`Thumbnail ${index + 1}`}
                              className="w-full h-16 object-cover"
                            />
                          </FocusableItem>
                        ))}
                      </div>
                    )}
                  </Card>
                )}
              </div>

              <div className="space-y-6">
                {/* Author */}
                <Card className="bg-card border-border p-6 rounded-xl">
                  <h2 className="text-xl font-semibold mb-4">Author</h2>

                  <div className="flex items-center mb-4">
                    <div className="w-12 h-12 rounded-full bg-muted flex items-center justify-center mr-3 overflow-hidden">
                      {mod.author.avatar ? (
                        <img
                          src={mod.author.avatar || "/placeholder.svg"}
                          alt={mod.author.name}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <span className="text-xl font-bold">{mod.author.name.charAt(0)}</span>
                      )}
                    </div>
                    <div>
                      <p className="font-medium">{mod.author.name}</p>
                      <p className="text-sm text-muted-foreground">Mod Creator</p>
                    </div>
                  </div>

                  {mod.author.website && (
                    <FocusableItem
                      focusKey="author-website"
                      className="flex items-center text-primary hover:underline text-sm"
                      onClick={() => window.open(mod.author.website, "_blank")}
                    >
                      <ExternalLink size={14} className="mr-1" />
                      <span>Visit Website</span>
                    </FocusableItem>
                  )}
                </Card>

                {/* Latest Version */}
                <Card className="bg-card border-border p-6 rounded-xl">
                  <h2 className="text-xl font-semibold mb-4">Latest Version</h2>

                  <div className="space-y-3">
                    <div>
                      <p className="text-sm text-muted-foreground">Version</p>
                      <p className="font-medium">v{mod.latestVersion.version}</p>
                    </div>

                    <div>
                      <p className="text-sm text-muted-foreground">Release Date</p>
                      <p className="font-medium">{formatDate(mod.latestVersion.releaseDate)}</p>
                    </div>

                    <div>
                      <p className="text-sm text-muted-foreground">File Size</p>
                      <p className="font-medium">{mod.latestVersion.fileSize}</p>
                    </div>

                    <div>
                      <p className="text-sm text-muted-foreground">Game Version</p>
                      <p className="font-medium">{mod.latestVersion.gameVersion}</p>
                    </div>
                  </div>

                  <div className="mt-4">
                    <h3 className="font-medium mb-2">Changelog</h3>
                    <p className="text-sm text-muted-foreground whitespace-pre-line">{mod.latestVersion.changelog}</p>
                  </div>
                </Card>
              </div>
            </div>
          </>
        )}

        {/* Versions Tab */}
        {activeTab === "versions" && (
          <div className="space-y-6">
            <h2 className="text-xl font-semibold mb-4">Version History</h2>

            <div className="space-y-4">
              {mod.versions.map((version) => (
                <Card key={version.version} className="bg-card border-border p-6 rounded-xl">
                  <div className="flex flex-col md:flex-row md:items-center justify-between gap-2 mb-4">
                    <div>
                      <h3 className="font-bold text-lg">Version {version.version}</h3>
                      <p className="text-sm text-muted-foreground">Released on {formatDate(version.releaseDate)}</p>
                    </div>

                    <div className="flex items-center gap-4">
                      <div>
                        <p className="text-xs text-muted-foreground">File Size</p>
                        <p className="font-medium">{version.fileSize}</p>
                      </div>

                      <div>
                        <p className="text-xs text-muted-foreground">Game Version</p>
                        <p className="font-medium">{version.gameVersion}</p>
                      </div>

                      <FocusableItem
                        focusKey={`download-${version.version}`}
                        className="bg-primary hover:bg-primary/90 text-white px-4 py-2 rounded-lg text-sm font-medium transition-all flex items-center gap-1"
                      >
                        <Download size={14} />
                        <span>Download</span>
                      </FocusableItem>
                    </div>
                  </div>

                  <div>
                    <h4 className="font-medium mb-2">Changelog</h4>
                    <p className="text-sm text-muted-foreground whitespace-pre-line">{version.changelog}</p>
                  </div>
                </Card>
              ))}
            </div>
          </div>
        )}

        {/* Requirements Tab */}
        {activeTab === "requirements" && (
          <div className="space-y-6">
            <h2 className="text-xl font-semibold mb-4">Requirements</h2>

            <Card className="bg-card border-border p-6 rounded-xl">
              <div className="space-y-4">
                {mod.requirements.map((req, index) => (
                  <div key={index} className="flex items-start">
                    <div
                      className={`p-2 rounded-lg mr-3 ${
                        req.optional ? "bg-muted/50 text-muted-foreground" : "bg-primary/20 text-primary"
                      }`}
                    >
                      {req.type === "game" ? (
                        <FileText size={20} />
                      ) : req.type === "mod" ? (
                        <Settings size={20} />
                      ) : (
                        <Cpu size={20} />
                      )}
                    </div>
                    <div>
                      <div className="flex items-center">
                        <p className="font-medium">{req.name}</p>
                        {req.optional && (
                          <span className="ml-2 text-xs bg-muted px-2 py-0.5 rounded-full text-muted-foreground">
                            Optional
                          </span>
                        )}
                      </div>
                      {req.version && <p className="text-sm text-muted-foreground">Version {req.version} or higher</p>}
                    </div>
                  </div>
                ))}

                {mod.requirements.length === 0 && (
                  <div className="flex items-center justify-center py-4">
                    <p className="text-muted-foreground">No specific requirements listed</p>
                  </div>
                )}
              </div>
            </Card>

            <Card className="bg-card border-border p-6 rounded-xl">
              <div className="flex items-center mb-4">
                <AlertTriangle className="text-yellow-500 mr-2" size={20} />
                <h3 className="font-semibold">Important Notes</h3>
              </div>

              <div className="space-y-2 text-sm text-muted-foreground">
                <p>• Always back up your game files before installing mods.</p>
                <p>• This mod may conflict with other mods that modify the same game files.</p>
                <p>• Game updates may break mod functionality. Check for updates after game patches.</p>
                <p>• Some mods may affect game performance or stability.</p>
              </div>
            </Card>
          </div>
        )}

        {/* Settings Tab */}
        {activeTab === "settings" && (
          <div className="space-y-6">
            <h2 className="text-xl font-semibold mb-4">Mod Settings</h2>

            {mod.installed ? (
              <>
                <Card className="bg-card border-border p-6 rounded-xl">
                  <h3 className="font-semibold mb-4">Status</h3>

                  <div className="space-y-4">
                    <div className="flex justify-between items-center">
                      <div>
                        <p className="font-medium">Enable Mod</p>
                        <p className="text-sm text-muted-foreground">Turn the mod on or off without uninstalling</p>
                      </div>
                      <FocusableItem
                        focusKey="toggle-mod-settings"
                        className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                          mod.enabled ? "bg-primary" : "bg-muted"
                        }`}
                        onClick={handleEnableToggle}
                      >
                        <span
                          className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                            mod.enabled ? "translate-x-6" : "translate-x-1"
                          }`}
                        />
                      </FocusableItem>
                    </div>

                    <div>
                      <p className="font-medium">Installation Path</p>
                      <p className="text-sm bg-muted/50 p-2 rounded mt-1 font-mono text-muted-foreground">
                        {mod.installPath || "Unknown"}
                      </p>
                    </div>

                    <div>
                      <p className="font-medium">Load Order</p>
                      <p className="text-sm text-muted-foreground mb-2">
                        Set the order in which this mod loads relative to other mods
                      </p>
                      <div className="flex items-center">
                        <input
                          type="number"
                          min="1"
                          value={mod.loadOrder || 1}
                          className="w-20 bg-muted/50 border border-border rounded p-1 text-center"
                          onChange={() => {}} // In a real app, this would update the load order
                        />
                        <span className="ml-2 text-sm text-muted-foreground">(Lower numbers load first)</span>
                      </div>
                    </div>
                  </div>
                </Card>

                <Card className="bg-card border-border p-6 rounded-xl">
                  <h3 className="font-semibold mb-4 flex items-center">
                    <AlertTriangle className="text-red-500 mr-2" size={20} />
                    Danger Zone
                  </h3>

                  <div className="space-y-4">
                    <div>
                      <p className="font-medium">Uninstall Mod</p>
                      <p className="text-sm text-muted-foreground mb-2">
                        Remove this mod from your system. This action cannot be undone.
                      </p>
                      <FocusableItem
                        focusKey="uninstall-mod-settings"
                        className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-all flex items-center gap-1"
                        onClick={handleInstallToggle}
                      >
                        <Trash2 size={14} />
                        <span>Uninstall Mod</span>
                      </FocusableItem>
                    </div>
                  </div>
                </Card>
              </>
            ) : (
              <Card className="bg-card border-border p-6 rounded-xl text-center">
                <AlertTriangle className="mx-auto text-yellow-500 mb-2" size={32} />
                <h3 className="font-semibold mb-2">Mod Not Installed</h3>
                <p className="text-muted-foreground mb-4">
                  You need to install this mod before you can configure its settings.
                </p>
                <FocusableItem
                  focusKey="install-mod-settings"
                  className="bg-primary hover:bg-primary/90 text-white px-4 py-2 rounded-lg text-sm font-medium transition-all inline-flex items-center gap-1"
                  onClick={handleInstallToggle}
                >
                  <Download size={14} />
                  <span>Install Mod</span>
                </FocusableItem>
              </Card>
            )}
          </div>
        )}
      </div>
    </div>
  )
}
