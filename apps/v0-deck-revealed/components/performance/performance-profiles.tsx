"use client"

import { useState } from "react"
import { FocusableItem } from "@/components/ui/focusable-item"
import { Card } from "@/components/ui/card"
import {
  BarChart2,
  Clock,
  Calendar,
  Cpu,
  HardDrive,
  Thermometer,
  AlertTriangle,
  ChevronDown,
  ChevronUp,
  Trash,
  Download,
  Share2,
  ChevronRight,
} from "lucide-react"
import type { PerformanceProfile } from "@/types/performance"

interface PerformanceProfilesProps {
  profiles: PerformanceProfile[]
  onDeleteProfile?: (profileId: string) => void
  onExportProfile?: (profileId: string) => void
  onCompareProfiles?: (profileIds: string[]) => void
}

export function PerformanceProfiles({
  profiles,
  onDeleteProfile,
  onExportProfile,
  onCompareProfiles,
}: PerformanceProfilesProps) {
  const [expandedProfiles, setExpandedProfiles] = useState<Record<string, boolean>>({})
  const [selectedProfiles, setSelectedProfiles] = useState<string[]>([])

  const toggleProfileExpanded = (profileId: string) => {
    setExpandedProfiles((prev) => ({
      ...prev,
      [profileId]: !prev[profileId],
    }))
  }

  const toggleProfileSelected = (profileId: string) => {
    setSelectedProfiles((prev) =>
      prev.includes(profileId) ? prev.filter((id) => id !== profileId) : [...prev, profileId],
    )
  }

  const handleCompare = () => {
    if (onCompareProfiles && selectedProfiles.length >= 2) {
      onCompareProfiles(selectedProfiles)
    }
  }

  // Format date
  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleDateString(undefined, {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    })
  }

  // Format duration
  const formatDuration = (seconds: number) => {
    const hours = Math.floor(seconds / 3600)
    const minutes = Math.floor((seconds % 3600) / 60)

    if (hours > 0) {
      return `${hours}h ${minutes}m`
    }
    return `${minutes}m`
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-semibold">Performance Profiles</h2>

        {selectedProfiles.length >= 2 && (
          <FocusableItem
            focusKey="compare-profiles"
            className="bg-primary/20 text-primary px-3 py-1 rounded-lg text-sm hover:bg-primary/30 transition-colors flex items-center"
            onClick={handleCompare}
          >
            <BarChart2 className="w-4 h-4 mr-1" />
            <span>Compare Selected ({selectedProfiles.length})</span>
          </FocusableItem>
        )}
      </div>

      {profiles.length === 0 ? (
        <Card className="bg-card border-border p-6 rounded-xl">
          <div className="text-center py-6">
            <BarChart2 className="mx-auto h-12 w-12 text-muted-foreground mb-3" />
            <h3 className="text-lg font-medium mb-2">No Performance Profiles</h3>
            <p className="text-muted-foreground">Start recording performance data to create profiles for this game.</p>
          </div>
        </Card>
      ) : (
        <div className="space-y-4">
          {profiles.map((profile) => (
            <Card
              key={profile.id}
              className={`bg-card border-border rounded-xl overflow-hidden transition-colors ${
                selectedProfiles.includes(profile.id) ? "border-primary" : ""
              }`}
            >
              <div className="p-4 flex items-center justify-between">
                <div className="flex items-center">
                  <input
                    type="checkbox"
                    id={`select-${profile.id}`}
                    checked={selectedProfiles.includes(profile.id)}
                    onChange={() => toggleProfileSelected(profile.id)}
                    className="mr-3 h-4 w-4 rounded border-gray-300 text-primary focus:ring-primary"
                  />
                  <div>
                    <div className="flex items-center">
                      <Calendar className="w-4 h-4 text-muted-foreground mr-1" />
                      <span className="text-sm text-muted-foreground">{formatDate(profile.date)}</span>
                      <span className="mx-2">•</span>
                      <Clock className="w-4 h-4 text-muted-foreground mr-1" />
                      <span className="text-sm text-muted-foreground">{formatDuration(profile.duration)}</span>
                    </div>
                    <div className="flex items-center mt-1">
                      <BarChart2 className="w-4 h-4 text-green-500 mr-1" />
                      <span className="font-medium">{profile.averageFps.toFixed(1)} FPS</span>
                      <span className="mx-2 text-muted-foreground">|</span>
                      <span className="text-sm text-muted-foreground">
                        {profile.minFps.toFixed(1)} min / {profile.onePercentLowFps.toFixed(1)} 1% low
                      </span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center">
                  {profile.issues.length > 0 && (
                    <div className="mr-4 flex items-center">
                      <AlertTriangle className="text-amber-500 w-4 h-4 mr-1" />
                      <span className="text-sm">{profile.issues.length} issues</span>
                    </div>
                  )}

                  <div className="flex space-x-2">
                    {onExportProfile && (
                      <FocusableItem
                        focusKey={`export-${profile.id}`}
                        className="p-1 text-muted-foreground hover:text-foreground transition-colors"
                        onClick={() => onExportProfile(profile.id)}
                      >
                        <Download className="w-5 h-5" />
                      </FocusableItem>
                    )}

                    {onDeleteProfile && (
                      <FocusableItem
                        focusKey={`delete-${profile.id}`}
                        className="p-1 text-muted-foreground hover:text-red-500 transition-colors"
                        onClick={() => onDeleteProfile(profile.id)}
                      >
                        <Trash className="w-5 h-5" />
                      </FocusableItem>
                    )}

                    <FocusableItem
                      focusKey={`expand-${profile.id}`}
                      className="p-1 text-muted-foreground hover:text-foreground transition-colors"
                      onClick={() => toggleProfileExpanded(profile.id)}
                    >
                      {expandedProfiles[profile.id] ? (
                        <ChevronUp className="w-5 h-5" />
                      ) : (
                        <ChevronDown className="w-5 h-5" />
                      )}
                    </FocusableItem>
                  </div>
                </div>
              </div>

              {expandedProfiles[profile.id] && (
                <div className="p-4 border-t border-border">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Performance Metrics */}
                    <div className="space-y-4">
                      <h3 className="font-medium">Performance Metrics</h3>

                      <div className="grid grid-cols-2 gap-3">
                        <div className="bg-muted/30 p-3 rounded-lg">
                          <div className="flex items-center text-sm text-muted-foreground mb-1">
                            <BarChart2 className="w-4 h-4 mr-1" />
                            <span>Average FPS</span>
                          </div>
                          <div className="font-bold text-lg">{profile.averageFps.toFixed(1)}</div>
                        </div>

                        <div className="bg-muted/30 p-3 rounded-lg">
                          <div className="flex items-center text-sm text-muted-foreground mb-1">
                            <BarChart2 className="w-4 h-4 mr-1" />
                            <span>1% Low FPS</span>
                          </div>
                          <div className="font-bold text-lg">{profile.onePercentLowFps.toFixed(1)}</div>
                        </div>

                        <div className="bg-muted/30 p-3 rounded-lg">
                          <div className="flex items-center text-sm text-muted-foreground mb-1">
                            <Cpu className="w-4 h-4 mr-1" />
                            <span>CPU Usage</span>
                          </div>
                          <div className="font-bold text-lg">{profile.averageCpuUsage.toFixed(1)}%</div>
                        </div>

                        <div className="bg-muted/30 p-3 rounded-lg">
                          <div className="flex items-center text-sm text-muted-foreground mb-1">
                            <HardDrive className="w-4 h-4 mr-1" />
                            <span>GPU Usage</span>
                          </div>
                          <div className="font-bold text-lg">{profile.averageGpuUsage.toFixed(1)}%</div>
                        </div>

                        <div className="bg-muted/30 p-3 rounded-lg">
                          <div className="flex items-center text-sm text-muted-foreground mb-1">
                            <Thermometer className="w-4 h-4 mr-1" />
                            <span>CPU Temp</span>
                          </div>
                          <div className="font-bold text-lg">{profile.averageTemperature.cpu.toFixed(1)}°C</div>
                        </div>

                        <div className="bg-muted/30 p-3 rounded-lg">
                          <div className="flex items-center text-sm text-muted-foreground mb-1">
                            <Thermometer className="w-4 h-4 mr-1" />
                            <span>GPU Temp</span>
                          </div>
                          <div className="font-bold text-lg">{profile.averageTemperature.gpu.toFixed(1)}°C</div>
                        </div>
                      </div>
                    </div>

                    {/* Issues and Recommendations */}
                    <div className="space-y-4">
                      {profile.issues.length > 0 && (
                        <div>
                          <h3 className="font-medium mb-2">Detected Issues</h3>
                          <div className="space-y-2">
                            {profile.issues.map((issue, index) => (
                              <div
                                key={index}
                                className={`p-3 rounded-lg text-sm ${
                                  issue.severity === "Critical"
                                    ? "bg-red-500/10 border border-red-500/30"
                                    : issue.severity === "High"
                                      ? "bg-amber-500/10 border border-amber-500/30"
                                      : "bg-blue-500/10 border border-blue-500/30"
                                }`}
                              >
                                <div className="flex items-start">
                                  <AlertTriangle
                                    className={`mt-0.5 mr-2 w-4 h-4 ${
                                      issue.severity === "Critical"
                                        ? "text-red-500"
                                        : issue.severity === "High"
                                          ? "text-amber-500"
                                          : "text-blue-500"
                                    }`}
                                  />
                                  <div>
                                    <p className="font-medium">{issue.type}</p>
                                    <p className="text-muted-foreground text-xs mt-1">{issue.description}</p>
                                  </div>
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}

                      {profile.recommendations.length > 0 && (
                        <div>
                          <h3 className="font-medium mb-2">Recommendations</h3>
                          <div className="space-y-2">
                            {profile.recommendations.map((rec, index) => (
                              <div key={index} className="bg-muted/30 p-3 rounded-lg text-sm">
                                <p className="font-medium">{rec.setting}</p>
                                <div className="flex items-center text-xs text-muted-foreground mt-1">
                                  <span>{rec.currentValue}</span>
                                  <ChevronRight className="w-3 h-3 mx-1" />
                                  <span className="text-primary">{rec.recommendedValue}</span>
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="mt-4 pt-4 border-t border-border flex justify-end">
                    <FocusableItem
                      focusKey={`share-${profile.id}`}
                      className="flex items-center text-sm text-muted-foreground hover:text-foreground transition-colors"
                    >
                      <Share2 className="w-4 h-4 mr-1" />
                      <span>Share Profile</span>
                    </FocusableItem>
                  </div>
                </div>
              )}
            </Card>
          ))}
        </div>
      )}
    </div>
  )
}
