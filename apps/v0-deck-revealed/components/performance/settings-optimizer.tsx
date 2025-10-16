"use client"

import { useState } from "react"
import { FocusableItem } from "@/components/ui/focusable-item"
import { Card } from "@/components/ui/card"
import {
  Settings,
  Zap,
  Check,
  ChevronDown,
  ChevronUp,
  AlertTriangle,
  ArrowRight,
  Sparkles,
  Gauge,
  ImageIcon,
  Cpu,
} from "lucide-react"
import type { GameSettings, SettingsRecommendation, PerformanceOptimizationPreset } from "@/types/performance"

interface SettingsOptimizerProps {
  currentSettings: GameSettings
  recommendations: SettingsRecommendation[]
  optimizationPresets: PerformanceOptimizationPreset[]
  selectedPreset: string | null
  onApplyRecommendation: (recommendation: SettingsRecommendation) => void
  onApplyAllRecommendations: () => void
  onApplyPreset: (presetId: string) => void
}

export function SettingsOptimizer({
  currentSettings,
  recommendations,
  optimizationPresets,
  selectedPreset,
  onApplyRecommendation,
  onApplyAllRecommendations,
  onApplyPreset,
}: SettingsOptimizerProps) {
  const [expandedSections, setExpandedSections] = useState<Record<string, boolean>>({
    recommendations: true,
    presets: true,
    current: false,
  })

  const toggleSection = (section: string) => {
    setExpandedSections((prev) => ({
      ...prev,
      [section]: !prev[section],
    }))
  }

  // Format setting name for display
  const formatSettingName = (setting: string): string => {
    return setting
      .replace(/([A-Z])/g, " $1") // Add space before capital letters
      .replace(/^./, (str) => str.toUpperCase()) // Capitalize first letter
  }

  // Format setting value for display
  const formatSettingValue = (value: any): string => {
    if (typeof value === "boolean") {
      return value ? "Enabled" : "Disabled"
    }
    return String(value)
  }

  // Get icon for performance impact
  const getPerformanceImpactIcon = (impact: "Low" | "Medium" | "High" | "Critical") => {
    switch (impact) {
      case "Low":
        return <Zap className="w-4 h-4 text-green-500" />
      case "Medium":
        return <Zap className="w-4 h-4 text-amber-500" />
      case "High":
        return <Zap className="w-4 h-4 text-orange-500" />
      case "Critical":
        return <Zap className="w-4 h-4 text-red-500" />
    }
  }

  // Get icon for visual impact
  const getVisualImpactIcon = (impact: "Low" | "Medium" | "High") => {
    switch (impact) {
      case "Low":
        return <ImageIcon className="w-4 h-4 text-green-500" />
      case "Medium":
        return <ImageIcon className="w-4 h-4 text-amber-500" />
      case "High":
        return <ImageIcon className="w-4 h-4 text-red-500" />
    }
  }

  return (
    <div className="space-y-6">
      {/* Recommendations */}
      <Card className="bg-card border-border rounded-xl overflow-hidden">
        <div
          className="flex items-center justify-between p-4 cursor-pointer hover:bg-muted/30 transition-colors"
          onClick={() => toggleSection("recommendations")}
        >
          <div className="flex items-center">
            <AlertTriangle className="text-amber-500 mr-2" size={20} />
            <h2 className="text-lg font-semibold">Recommended Optimizations</h2>
            {recommendations.length > 0 && (
              <div className="ml-2 bg-amber-500/20 text-amber-500 text-xs px-2 py-0.5 rounded-full">
                {recommendations.length}
              </div>
            )}
          </div>
          {expandedSections.recommendations ? (
            <ChevronUp className="text-muted-foreground" size={20} />
          ) : (
            <ChevronDown className="text-muted-foreground" size={20} />
          )}
        </div>

        {expandedSections.recommendations && (
          <div className="p-4 border-t border-border">
            {recommendations.length === 0 ? (
              <div className="text-center py-6">
                <Check className="mx-auto h-12 w-12 text-green-500 mb-3" />
                <h3 className="text-lg font-medium mb-2">No Recommendations</h3>
                <p className="text-muted-foreground">Your current settings are already optimized for your hardware.</p>
              </div>
            ) : (
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <p className="text-sm text-muted-foreground">
                    {recommendations.length} recommendation{recommendations.length !== 1 ? "s" : ""} to improve
                    performance
                  </p>
                  <FocusableItem
                    focusKey="apply-all"
                    className="text-primary text-sm font-medium hover:underline flex items-center"
                    onClick={onApplyAllRecommendations}
                  >
                    <Zap className="w-4 h-4 mr-1" />
                    Apply All
                  </FocusableItem>
                </div>

                <div className="space-y-3">
                  {recommendations.map((rec, index) => (
                    <div
                      key={index}
                      className="bg-muted/30 rounded-lg p-4 border border-border hover:border-primary/50 transition-colors"
                    >
                      <div className="flex justify-between items-start">
                        <div>
                          <h3 className="font-medium mb-1">{formatSettingName(rec.setting)}</h3>
                          <p className="text-sm text-muted-foreground mb-2">{rec.description}</p>
                          <div className="flex items-center space-x-4 text-sm">
                            <div className="flex items-center">
                              <span className="text-muted-foreground mr-1">Performance:</span>
                              <div className="flex items-center">
                                {getPerformanceImpactIcon(rec.performanceImpact)}
                                <span className="ml-1">{rec.performanceImpact}</span>
                              </div>
                            </div>
                            <div className="flex items-center">
                              <span className="text-muted-foreground mr-1">Visual:</span>
                              <div className="flex items-center">
                                {getVisualImpactIcon(rec.visualImpact)}
                                <span className="ml-1">{rec.visualImpact}</span>
                              </div>
                            </div>
                          </div>
                        </div>
                        <div className="flex flex-col items-end">
                          <div className="flex items-center mb-2">
                            <div className="text-right mr-2">
                              <div className="text-xs text-muted-foreground">Current</div>
                              <div className="font-medium">{formatSettingValue(rec.currentValue)}</div>
                            </div>
                            <ArrowRight className="text-muted-foreground mx-1" size={16} />
                            <div className="text-right ml-2">
                              <div className="text-xs text-muted-foreground">Recommended</div>
                              <div className="font-medium text-primary">{formatSettingValue(rec.recommendedValue)}</div>
                            </div>
                          </div>
                          <FocusableItem
                            focusKey={`apply-rec-${index}`}
                            className="bg-primary/20 text-primary px-3 py-1 rounded-lg text-sm hover:bg-primary/30 transition-colors"
                            onClick={() => onApplyRecommendation(rec)}
                          >
                            Apply
                          </FocusableItem>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}
      </Card>

      {/* Optimization Presets */}
      <Card className="bg-card border-border rounded-xl overflow-hidden">
        <div
          className="flex items-center justify-between p-4 cursor-pointer hover:bg-muted/30 transition-colors"
          onClick={() => toggleSection("presets")}
        >
          <div className="flex items-center">
            <Sparkles className="text-primary mr-2" size={20} />
            <h2 className="text-lg font-semibold">Optimization Presets</h2>
          </div>
          {expandedSections.presets ? (
            <ChevronUp className="text-muted-foreground" size={20} />
          ) : (
            <ChevronDown className="text-muted-foreground" size={20} />
          )}
        </div>

        {expandedSections.presets && (
          <div className="p-4 border-t border-border">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {optimizationPresets.map((preset) => (
                <FocusableItem
                  key={preset.id}
                  focusKey={`preset-${preset.id}`}
                  className={`p-4 rounded-lg border transition-colors ${
                    selectedPreset === preset.id
                      ? "border-primary bg-primary/5"
                      : "border-border bg-muted/30 hover:border-primary/50"
                  }`}
                  onClick={() => onApplyPreset(preset.id)}
                >
                  <div className="flex justify-between items-start mb-2">
                    <h3 className="font-medium">{preset.name}</h3>
                    {selectedPreset === preset.id && <Check className="text-primary" size={16} />}
                  </div>
                  <p className="text-sm text-muted-foreground mb-3">{preset.description}</p>
                  <div className="flex items-center justify-between text-sm">
                    <div className="flex items-center">
                      <Gauge className="w-4 h-4 text-green-500 mr-1" />
                      <span>FPS: {preset.performanceImpact.fps}</span>
                    </div>
                    <div className="flex items-center">
                      <ImageIcon className="w-4 h-4 text-blue-500 mr-1" />
                      <span>Quality: {preset.performanceImpact.quality}</span>
                    </div>
                  </div>
                  {preset.targetHardware && (
                    <div className="mt-2 text-xs text-muted-foreground">
                      {preset.targetHardware.recommendedGpu && (
                        <div className="flex items-center mt-1">
                          <Cpu className="w-3 h-3 mr-1" />
                          <span>Recommended: {preset.targetHardware.recommendedGpu}</span>
                        </div>
                      )}
                    </div>
                  )}
                </FocusableItem>
              ))}
            </div>
          </div>
        )}
      </Card>

      {/* Current Settings */}
      <Card className="bg-card border-border rounded-xl overflow-hidden">
        <div
          className="flex items-center justify-between p-4 cursor-pointer hover:bg-muted/30 transition-colors"
          onClick={() => toggleSection("current")}
        >
          <div className="flex items-center">
            <Settings className="text-muted-foreground mr-2" size={20} />
            <h2 className="text-lg font-semibold">Current Settings</h2>
          </div>
          {expandedSections.current ? (
            <ChevronUp className="text-muted-foreground" size={20} />
          ) : (
            <ChevronDown className="text-muted-foreground" size={20} />
          )}
        </div>

        {expandedSections.current && (
          <div className="p-4 border-t border-border">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {Object.entries(currentSettings).map(([key, value]) => (
                <div
                  key={key}
                  className="flex justify-between items-center p-2 border-b border-border/50 last:border-0"
                >
                  <span className="text-muted-foreground">{formatSettingName(key)}</span>
                  <span className="font-medium">{formatSettingValue(value)}</span>
                </div>
              ))}
            </div>
          </div>
        )}
      </Card>
    </div>
  )
}
