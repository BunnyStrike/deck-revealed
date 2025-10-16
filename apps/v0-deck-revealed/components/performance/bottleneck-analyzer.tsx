"use client"

import { useState } from "react"
import { Card } from "@/components/ui/card"
import { FocusableItem } from "@/components/ui/focusable-item"
import {
  AlertTriangle,
  ChevronDown,
  ChevronUp,
  Cpu,
  HardDrive,
  MemoryStickIcon as Memory,
  Monitor,
  Zap,
  Check,
  Info,
  Fan,
  Gauge,
  DollarSign,
  ShoppingCart,
  ExternalLink,
  Layers,
} from "lucide-react"
import { CompatibilityChecker } from "./compatibility-checker"
import type { BottleneckAnalysis, UpgradeRecommendation, SuggestedUpgrade, HardwareInfo } from "@/types/performance"

interface BottleneckAnalyzerProps {
  bottleneckAnalysis: BottleneckAnalysis | null
  hardwareInfo: HardwareInfo
}

export function BottleneckAnalyzer({ bottleneckAnalysis, hardwareInfo }: BottleneckAnalyzerProps) {
  const [expandedSections, setExpandedSections] = useState<Record<string, boolean>>({
    overview: true,
    recommendations: true,
  })

  const [expandedUpgrades, setExpandedUpgrades] = useState<Record<string, boolean>>({})

  const [showCompatibilityCheck, setShowCompatibilityCheck] = useState<{
    show: boolean
    componentType: "CPU" | "GPU" | "RAM" | "Storage" | "Cooling" | "PSU" | "Motherboard"
    upgrade: SuggestedUpgrade
  } | null>(null)

  const toggleSection = (section: string) => {
    setExpandedSections((prev) => ({
      ...prev,
      [section]: !prev[section],
    }))
  }

  const toggleUpgrade = (upgradeId: string) => {
    setExpandedUpgrades((prev) => ({
      ...prev,
      [upgradeId]: !prev[upgradeId],
    }))
  }

  const checkCompatibility = (
    componentType: "CPU" | "GPU" | "RAM" | "Storage" | "Cooling" | "PSU" | "Motherboard",
    upgrade: SuggestedUpgrade,
  ) => {
    setShowCompatibilityCheck({
      show: true,
      componentType,
      upgrade,
    })
  }

  const closeCompatibilityCheck = () => {
    setShowCompatibilityCheck(null)
  }

  if (!bottleneckAnalysis) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <Gauge className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
          <h3 className="text-lg font-medium mb-2">No Analysis Available</h3>
          <p className="text-muted-foreground">
            Start monitoring performance to generate a bottleneck analysis and upgrade recommendations.
          </p>
        </div>
      </div>
    )
  }

  // Get icon for component type
  const getComponentIcon = (componentType: string, className = "w-5 h-5") => {
    switch (componentType) {
      case "CPU":
        return <Cpu className={className} />
      case "GPU":
        return <Monitor className={className} />
      case "RAM":
        return <Memory className={className} />
      case "Storage":
        return <HardDrive className={className} />
      case "Cooling":
        return <Fan className={className} />
      default:
        return <Info className={className} />
    }
  }

  // Get color for severity
  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case "Critical":
        return "text-red-500"
      case "High":
        return "text-orange-500"
      case "Medium":
        return "text-amber-500"
      case "Low":
        return "text-green-500"
      default:
        return "text-muted-foreground"
    }
  }

  // Get background color for balance score
  const getBalanceScoreColor = (score: number) => {
    if (score >= 80) return "bg-green-500"
    if (score >= 60) return "bg-amber-500"
    if (score >= 40) return "bg-orange-500"
    return "bg-red-500"
  }

  // Render upgrade recommendation card
  const renderUpgradeRecommendation = (recommendation: UpgradeRecommendation, index: number) => {
    const isExpanded = expandedUpgrades[`${recommendation.componentType}-${index}`] || false

    return (
      <Card
        key={`${recommendation.componentType}-${index}`}
        className="bg-card border-border rounded-xl overflow-hidden mb-4"
      >
        <div className="p-4 border-b border-border bg-muted/30">
          <div className="flex justify-between items-start">
            <div className="flex items-start">
              <div
                className={`p-2 rounded-full ${getSeverityColor(recommendation.bottleneckSeverity)} bg-opacity-20 mr-3`}
              >
                {getComponentIcon(recommendation.componentType)}
              </div>
              <div>
                <h3 className="font-semibold text-lg">{recommendation.componentType} Upgrade</h3>
                <p className="text-muted-foreground">{recommendation.bottleneckDescription}</p>
              </div>
            </div>
            <div className="flex flex-col items-end">
              <div className={`text-sm font-medium ${getSeverityColor(recommendation.bottleneckSeverity)}`}>
                {recommendation.bottleneckSeverity} Priority
              </div>
              <div className="flex items-center mt-1 text-sm">
                <Zap className="w-4 h-4 text-green-500 mr-1" />
                <span>Gain: {recommendation.estimatedPerformanceGain}</span>
              </div>
            </div>
          </div>
        </div>

        <div className="p-4">
          <div className="flex justify-between items-center mb-4">
            <div className="flex items-center">
              <span className="text-muted-foreground mr-2">Current:</span>
              <span className="font-medium">{recommendation.currentComponent}</span>
            </div>
            <FocusableItem
              focusKey={`toggle-upgrade-${recommendation.componentType}-${index}`}
              className="text-primary text-sm hover:underline flex items-center"
              onClick={() => toggleUpgrade(`${recommendation.componentType}-${index}`)}
            >
              {isExpanded ? "Hide Options" : "Show Upgrade Options"}
              {isExpanded ? <ChevronUp className="ml-1 w-4 h-4" /> : <ChevronDown className="ml-1 w-4 h-4" />}
            </FocusableItem>
          </div>

          {isExpanded && (
            <div className="space-y-4">
              {recommendation.suggestedUpgrades.map((upgrade, upgradeIndex) => (
                <div
                  key={upgradeIndex}
                  className="bg-muted/30 rounded-lg p-4 border border-border hover:border-primary/50 transition-colors"
                >
                  <div className="flex justify-between items-start mb-2">
                    <h4 className="font-medium">{upgrade.name}</h4>
                    <div className="text-sm text-muted-foreground">{upgrade.tier} Tier</div>
                  </div>
                  <p className="text-sm text-muted-foreground mb-3">{upgrade.description}</p>

                  <div className="grid grid-cols-2 gap-3 mb-3">
                    <div className="flex items-center">
                      <Zap className="w-4 h-4 text-green-500 mr-1" />
                      <span className="text-sm">Gain: {upgrade.performanceImprovement}</span>
                    </div>
                    <div className="flex items-center">
                      <DollarSign className="w-4 h-4 text-blue-500 mr-1" />
                      <span className="text-sm">Price: {upgrade.estimatedPrice}</span>
                    </div>
                    {upgrade.releaseYear && (
                      <div className="flex items-center">
                        <Info className="w-4 h-4 text-muted-foreground mr-1" />
                        <span className="text-sm">Released: {upgrade.releaseYear}</span>
                      </div>
                    )}
                    {upgrade.powerRequirement && (
                      <div className="flex items-center">
                        <Zap className="w-4 h-4 text-amber-500 mr-1" />
                        <span className="text-sm">Power: {upgrade.powerRequirement}</span>
                      </div>
                    )}
                  </div>

                  {upgrade.compatibilityNotes && (
                    <div className="text-sm text-amber-500 mb-3 flex items-start">
                      <AlertTriangle className="w-4 h-4 mr-1 mt-0.5 flex-shrink-0" />
                      <span>{upgrade.compatibilityNotes}</span>
                    </div>
                  )}

                  <div className="flex justify-end gap-2">
                    <FocusableItem
                      focusKey={`check-compatibility-${recommendation.componentType}-${index}-${upgradeIndex}`}
                      className="bg-blue-500/20 text-blue-500 px-3 py-1 rounded-lg text-sm hover:bg-blue-500/30 transition-colors flex items-center"
                      onClick={() => checkCompatibility(recommendation.componentType as any, upgrade)}
                    >
                      <Layers className="w-4 h-4 mr-1" />
                      Check Compatibility
                    </FocusableItem>

                    <FocusableItem
                      focusKey={`search-upgrade-${recommendation.componentType}-${index}-${upgradeIndex}`}
                      className="bg-primary/20 text-primary px-3 py-1 rounded-lg text-sm hover:bg-primary/30 transition-colors flex items-center"
                      onClick={() =>
                        window.open(
                          `https://www.google.com/search?q=${encodeURIComponent(upgrade.name)} price`,
                          "_blank",
                        )
                      }
                    >
                      <ShoppingCart className="w-4 h-4 mr-1" />
                      Find Online
                      <ExternalLink className="w-3 h-3 ml-1" />
                    </FocusableItem>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </Card>
    )
  }

  return (
    <div className="space-y-6">
      {showCompatibilityCheck && (
        <div className="mb-6">
          <CompatibilityChecker
            hardwareInfo={hardwareInfo}
            componentType={showCompatibilityCheck.componentType}
            suggestedUpgrade={showCompatibilityCheck.upgrade}
            onClose={closeCompatibilityCheck}
          />
        </div>
      )}

      {/* Overview */}
      <Card className="bg-card border-border rounded-xl overflow-hidden">
        <div
          className="flex items-center justify-between p-4 cursor-pointer hover:bg-muted/30 transition-colors"
          onClick={() => toggleSection("overview")}
        >
          <div className="flex items-center">
            <Gauge className="text-primary mr-2" size={20} />
            <h2 className="text-lg font-semibold">System Balance Analysis</h2>
          </div>
          {expandedSections.overview ? (
            <ChevronUp className="text-muted-foreground" size={20} />
          ) : (
            <ChevronDown className="text-muted-foreground" size={20} />
          )}
        </div>

        {expandedSections.overview && (
          <div className="p-4 border-t border-border">
            <div className="flex flex-col md:flex-row md:items-center mb-6">
              <div className="flex-1 mb-4 md:mb-0">
                <h3 className="text-lg font-medium mb-2">Overall Assessment</h3>
                <p className="text-muted-foreground">{bottleneckAnalysis.overallAssessment}</p>

                {bottleneckAnalysis.performanceLimitingFactors.length > 0 && (
                  <div className="mt-3">
                    <h4 className="text-sm font-medium mb-1">Performance Limiting Factors:</h4>
                    <ul className="list-disc list-inside text-sm text-muted-foreground">
                      {bottleneckAnalysis.performanceLimitingFactors.map((factor, index) => (
                        <li key={index}>{factor}</li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>

              <div className="md:ml-6 flex flex-col items-center">
                <div className="text-center mb-2">
                  <div className="text-sm text-muted-foreground">System Balance Score</div>
                  <div className="relative w-24 h-24 flex items-center justify-center">
                    <svg className="w-full h-full" viewBox="0 0 100 100">
                      <circle
                        className="text-muted/30"
                        strokeWidth="10"
                        stroke="currentColor"
                        fill="transparent"
                        r="40"
                        cx="50"
                        cy="50"
                      />
                      <circle
                        className={getBalanceScoreColor(bottleneckAnalysis.balanceScore)}
                        strokeWidth="10"
                        stroke="currentColor"
                        fill="transparent"
                        r="40"
                        cx="50"
                        cy="50"
                        strokeDasharray={`${(bottleneckAnalysis.balanceScore / 100) * 251.2} 251.2`}
                        strokeDashoffset="0"
                        strokeLinecap="round"
                        transform="rotate(-90 50 50)"
                      />
                    </svg>
                    <div className="absolute text-2xl font-bold">{bottleneckAnalysis.balanceScore}</div>
                  </div>
                  <div className="text-xs text-muted-foreground mt-1">
                    {bottleneckAnalysis.balanceScore >= 80
                      ? "Well Balanced"
                      : bottleneckAnalysis.balanceScore >= 60
                        ? "Moderately Balanced"
                        : bottleneckAnalysis.balanceScore >= 40
                          ? "Poorly Balanced"
                          : "Severely Imbalanced"}
                  </div>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Primary Bottleneck */}
              {bottleneckAnalysis.primaryBottleneck.component !== "None" && (
                <div className="bg-muted/30 rounded-lg p-4 border border-border">
                  <div className="flex items-center mb-2">
                    <div
                      className={`p-1.5 rounded-full ${getSeverityColor(bottleneckAnalysis.primaryBottleneck.severity)} bg-opacity-20 mr-2`}
                    >
                      {getComponentIcon(bottleneckAnalysis.primaryBottleneck.component, "w-4 h-4")}
                    </div>
                    <h3 className="font-medium">
                      Primary Bottleneck: {bottleneckAnalysis.primaryBottleneck.component}
                    </h3>
                    <div
                      className={`ml-auto text-sm font-medium ${getSeverityColor(bottleneckAnalysis.primaryBottleneck.severity)}`}
                    >
                      {bottleneckAnalysis.primaryBottleneck.severity}
                    </div>
                  </div>
                  <p className="text-sm text-muted-foreground">{bottleneckAnalysis.primaryBottleneck.description}</p>
                </div>
              )}

              {/* Secondary Bottleneck */}
              {bottleneckAnalysis.secondaryBottleneck && (
                <div className="bg-muted/30 rounded-lg p-4 border border-border">
                  <div className="flex items-center mb-2">
                    <div
                      className={`p-1.5 rounded-full ${getSeverityColor(bottleneckAnalysis.secondaryBottleneck.severity)} bg-opacity-20 mr-2`}
                    >
                      {getComponentIcon(bottleneckAnalysis.secondaryBottleneck.component, "w-4 h-4")}
                    </div>
                    <h3 className="font-medium">
                      Secondary Bottleneck: {bottleneckAnalysis.secondaryBottleneck.component}
                    </h3>
                    <div
                      className={`ml-auto text-sm font-medium ${getSeverityColor(bottleneckAnalysis.secondaryBottleneck.severity)}`}
                    >
                      {bottleneckAnalysis.secondaryBottleneck.severity}
                    </div>
                  </div>
                  <p className="text-sm text-muted-foreground">{bottleneckAnalysis.secondaryBottleneck.description}</p>
                </div>
              )}

              {/* No Bottlenecks */}
              {bottleneckAnalysis.primaryBottleneck.component === "None" && (
                <div className="bg-muted/30 rounded-lg p-4 border border-border col-span-2">
                  <div className="flex items-center mb-2">
                    <div className="p-1.5 rounded-full text-green-500 bg-green-500/20 mr-2">
                      <Check className="w-4 h-4" />
                    </div>
                    <h3 className="font-medium">No Significant Bottlenecks</h3>
                  </div>
                  <p className="text-sm text-muted-foreground">
                    Your system is well-balanced for this game. All components are working efficiently together.
                  </p>
                </div>
              )}
            </div>
          </div>
        )}
      </Card>

      {/* Upgrade Recommendations */}
      <Card className="bg-card border-border rounded-xl overflow-hidden">
        <div
          className="flex items-center justify-between p-4 cursor-pointer hover:bg-muted/30 transition-colors"
          onClick={() => toggleSection("recommendations")}
        >
          <div className="flex items-center">
            <Zap className="text-amber-500 mr-2" size={20} />
            <h2 className="text-lg font-semibold">Upgrade Recommendations</h2>
            {bottleneckAnalysis.upgradeRecommendations.length > 0 && (
              <div className="ml-2 bg-amber-500/20 text-amber-500 text-xs px-2 py-0.5 rounded-full">
                {bottleneckAnalysis.upgradeRecommendations.length}
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
            {bottleneckAnalysis.upgradeRecommendations.length === 0 ? (
              <div className="text-center py-6">
                <Check className="mx-auto h-12 w-12 text-green-500 mb-3" />
                <h3 className="text-lg font-medium mb-2">No Upgrades Needed</h3>
                <p className="text-muted-foreground">
                  Your current hardware is well-suited for this game. No upgrades are necessary at this time.
                </p>
              </div>
            ) : (
              <div>
                <p className="text-sm text-muted-foreground mb-4">
                  Based on your performance data, we recommend the following hardware upgrades to improve your gaming
                  experience:
                </p>

                {bottleneckAnalysis.upgradeRecommendations.map((recommendation, index) =>
                  renderUpgradeRecommendation(recommendation, index),
                )}
              </div>
            )}
          </div>
        )}
      </Card>
    </div>
  )
}
