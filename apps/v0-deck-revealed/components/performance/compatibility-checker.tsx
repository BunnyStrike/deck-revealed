"use client"

import { useState, useEffect } from "react"
import { Card } from "@/components/ui/card"
import { FocusableItem } from "@/components/ui/focusable-item"
import {
  AlertTriangle,
  Check,
  X,
  Info,
  Layers,
  DollarSign,
  ShoppingCart,
  ChevronDown,
  ChevronUp,
  Cpu,
  HardDrive,
  MemoryStickIcon as Memory,
  Monitor,
  Fan,
  Zap,
  CircuitBoardIcon as Motherboard,
} from "lucide-react"
import { checkComponentCompatibility } from "@/lib/compatibility-checker"
import type { HardwareInfo, CompatibilityResult, SuggestedUpgrade } from "@/types/performance"

interface CompatibilityCheckerProps {
  hardwareInfo: HardwareInfo
  componentType: "CPU" | "GPU" | "RAM" | "Storage" | "Cooling" | "PSU" | "Motherboard"
  suggestedUpgrade: SuggestedUpgrade
  onClose: () => void
}

export function CompatibilityChecker({
  hardwareInfo,
  componentType,
  suggestedUpgrade,
  onClose,
}: CompatibilityCheckerProps) {
  const [compatibilityResult, setCompatibilityResult] = useState<CompatibilityResult | null>(null)
  const [loading, setLoading] = useState(true)
  const [expandedSections, setExpandedSections] = useState<Record<string, boolean>>({
    issues: true,
    required: true,
    recommended: true,
    notes: true,
  })

  useEffect(() => {
    // Simulate a slight delay to show loading state
    const timer = setTimeout(() => {
      const result = checkComponentCompatibility(hardwareInfo, componentType, suggestedUpgrade)
      setCompatibilityResult(result)
      setLoading(false)
    }, 500)

    return () => clearTimeout(timer)
  }, [hardwareInfo, componentType, suggestedUpgrade])

  const toggleSection = (section: string) => {
    setExpandedSections((prev) => ({
      ...prev,
      [section]: !prev[section],
    }))
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
      case "PSU":
        return <Zap className={className} />
      case "Motherboard":
        return <Motherboard className={className} />
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
      case "Warning":
        return "text-amber-500"
      case "Low":
        return "text-green-500"
      default:
        return "text-muted-foreground"
    }
  }

  if (loading) {
    return (
      <Card className="p-6 bg-card border-border rounded-xl">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center">
            <Layers className="text-primary mr-2" size={20} />
            <h2 className="text-lg font-semibold">Compatibility Analysis</h2>
          </div>
          <FocusableItem
            focusKey="close-compatibility"
            onClick={onClose}
            className="text-muted-foreground hover:text-foreground"
          >
            <X size={20} />
          </FocusableItem>
        </div>
        <div className="flex items-center justify-center h-40">
          <div className="text-center">
            <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-primary mx-auto mb-4"></div>
            <p className="text-muted-foreground">Analyzing compatibility...</p>
          </div>
        </div>
      </Card>
    )
  }

  if (!compatibilityResult) {
    return (
      <Card className="p-6 bg-card border-border rounded-xl">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center">
            <Layers className="text-primary mr-2" size={20} />
            <h2 className="text-lg font-semibold">Compatibility Analysis</h2>
          </div>
          <FocusableItem
            focusKey="close-compatibility"
            onClick={onClose}
            className="text-muted-foreground hover:text-foreground"
          >
            <X size={20} />
          </FocusableItem>
        </div>
        <div className="flex items-center justify-center h-40">
          <div className="text-center">
            <AlertTriangle className="mx-auto h-10 w-10 text-amber-500 mb-4" />
            <p className="text-muted-foreground">Unable to analyze compatibility. Please try again.</p>
          </div>
        </div>
      </Card>
    )
  }

  return (
    <Card className="bg-card border-border rounded-xl overflow-hidden">
      <div className="p-4 border-b border-border bg-muted/30 flex items-center justify-between">
        <div className="flex items-center">
          <Layers className="text-primary mr-2" size={20} />
          <h2 className="text-lg font-semibold">Compatibility Analysis</h2>
        </div>
        <div className="flex items-center gap-4">
          <div
            className={`px-3 py-1 rounded-full text-sm font-medium ${
              compatibilityResult.compatible ? "bg-green-500/20 text-green-500" : "bg-red-500/20 text-red-500"
            }`}
          >
            {compatibilityResult.compatible ? "Compatible" : "Incompatible"}
          </div>
          <FocusableItem
            focusKey="close-compatibility"
            onClick={onClose}
            className="text-muted-foreground hover:text-foreground"
          >
            <X size={20} />
          </FocusableItem>
        </div>
      </div>

      <div className="p-4">
        <div className="flex flex-col md:flex-row md:items-center mb-6 gap-4">
          <div className="flex-1">
            <div className="flex items-center mb-2">
              {getComponentIcon(componentType)}
              <h3 className="font-medium ml-2">
                {componentType} Upgrade: {suggestedUpgrade.name}
              </h3>
            </div>
            <p className="text-sm text-muted-foreground">{suggestedUpgrade.description}</p>
          </div>

          <div className="flex flex-col items-center bg-muted/30 p-3 rounded-lg">
            <div className="text-sm text-muted-foreground mb-1">Total Upgrade Cost</div>
            <div className="text-xl font-bold text-primary">{compatibilityResult.totalEstimatedCost}</div>
            <div className="text-xs text-muted-foreground mt-1">
              {compatibilityResult.requiredComponents.length > 0
                ? "Including required components"
                : "No additional components required"}
            </div>
          </div>
        </div>

        {/* Issues Section */}
        {compatibilityResult.issues.length > 0 && (
          <div className="mb-4">
            <div
              className="flex items-center justify-between p-3 bg-muted/30 rounded-lg cursor-pointer"
              onClick={() => toggleSection("issues")}
            >
              <div className="flex items-center">
                <AlertTriangle
                  className={
                    compatibilityResult.issues.some((issue) => issue.severity === "Critical")
                      ? "text-red-500 mr-2"
                      : "text-amber-500 mr-2"
                  }
                  size={18}
                />
                <h3 className="font-medium">Compatibility Issues</h3>
                <div className="ml-2 bg-red-500/20 text-red-500 text-xs px-2 py-0.5 rounded-full">
                  {compatibilityResult.issues.length}
                </div>
              </div>
              {expandedSections.issues ? (
                <ChevronUp className="text-muted-foreground" size={18} />
              ) : (
                <ChevronDown className="text-muted-foreground" size={18} />
              )}
            </div>

            {expandedSections.issues && (
              <div className="mt-3 space-y-3">
                {compatibilityResult.issues.map((issue, index) => (
                  <div key={index} className="bg-muted/20 rounded-lg p-3 border border-border">
                    <div className="flex items-start">
                      <div className={`p-1 rounded-full ${getSeverityColor(issue.severity)} bg-opacity-20 mr-2 mt-0.5`}>
                        <AlertTriangle className="w-4 h-4" />
                      </div>
                      <div>
                        <div className="flex items-center">
                          <h4 className="font-medium">{issue.type}</h4>
                          <div className={`ml-2 text-xs font-medium ${getSeverityColor(issue.severity)}`}>
                            {issue.severity}
                          </div>
                        </div>
                        <p className="text-sm text-muted-foreground mt-1">{issue.description}</p>
                        <p className="text-sm mt-1">
                          <span className="font-medium">Solution:</span> {issue.solution}
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Required Components Section */}
        {compatibilityResult.requiredComponents.length > 0 && (
          <div className="mb-4">
            <div
              className="flex items-center justify-between p-3 bg-muted/30 rounded-lg cursor-pointer"
              onClick={() => toggleSection("required")}
            >
              <div className="flex items-center">
                <AlertTriangle className="text-red-500 mr-2" size={18} />
                <h3 className="font-medium">Required Additional Components</h3>
                <div className="ml-2 bg-red-500/20 text-red-500 text-xs px-2 py-0.5 rounded-full">
                  {compatibilityResult.requiredComponents.length}
                </div>
              </div>
              {expandedSections.required ? (
                <ChevronUp className="text-muted-foreground" size={18} />
              ) : (
                <ChevronDown className="text-muted-foreground" size={18} />
              )}
            </div>

            {expandedSections.required && (
              <div className="mt-3 space-y-3">
                {compatibilityResult.requiredComponents.map((component, index) => (
                  <div key={index} className="bg-muted/20 rounded-lg p-3 border border-border">
                    <div className="flex items-start">
                      <div className="p-1 rounded-full text-primary bg-primary/20 mr-2 mt-0.5">
                        {getComponentIcon(component.componentType, "w-4 h-4")}
                      </div>
                      <div className="flex-1">
                        <h4 className="font-medium">{component.componentType}</h4>
                        <p className="text-sm text-muted-foreground mt-1">{component.description}</p>
                      </div>
                      <div className="flex items-center text-blue-500">
                        <DollarSign className="w-4 h-4 mr-1" />
                        <span>{component.estimatedCost}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Recommended Components Section */}
        {compatibilityResult.recommendedComponents.length > 0 && (
          <div className="mb-4">
            <div
              className="flex items-center justify-between p-3 bg-muted/30 rounded-lg cursor-pointer"
              onClick={() => toggleSection("recommended")}
            >
              <div className="flex items-center">
                <Info className="text-blue-500 mr-2" size={18} />
                <h3 className="font-medium">Recommended Additional Components</h3>
                <div className="ml-2 bg-blue-500/20 text-blue-500 text-xs px-2 py-0.5 rounded-full">
                  {compatibilityResult.recommendedComponents.length}
                </div>
              </div>
              {expandedSections.recommended ? (
                <ChevronUp className="text-muted-foreground" size={18} />
              ) : (
                <ChevronDown className="text-muted-foreground" size={18} />
              )}
            </div>

            {expandedSections.recommended && (
              <div className="mt-3 space-y-3">
                {compatibilityResult.recommendedComponents.map((component, index) => (
                  <div key={index} className="bg-muted/20 rounded-lg p-3 border border-border">
                    <div className="flex items-start">
                      <div className="p-1 rounded-full text-blue-500 bg-blue-500/20 mr-2 mt-0.5">
                        {getComponentIcon(component.componentType, "w-4 h-4")}
                      </div>
                      <div className="flex-1">
                        <h4 className="font-medium">{component.componentType}</h4>
                        <p className="text-sm text-muted-foreground mt-1">{component.description}</p>
                        <p className="text-sm text-blue-500 mt-1">
                          <span className="font-medium">Reason:</span> {component.reason}
                        </p>
                      </div>
                      <div className="flex items-center text-blue-500">
                        <DollarSign className="w-4 h-4 mr-1" />
                        <span>{component.estimatedCost}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Notes Section */}
        {compatibilityResult.notes.length > 0 && (
          <div className="mb-4">
            <div
              className="flex items-center justify-between p-3 bg-muted/30 rounded-lg cursor-pointer"
              onClick={() => toggleSection("notes")}
            >
              <div className="flex items-center">
                <Info className="text-primary mr-2" size={18} />
                <h3 className="font-medium">Additional Notes</h3>
                <div className="ml-2 bg-primary/20 text-primary text-xs px-2 py-0.5 rounded-full">
                  {compatibilityResult.notes.length}
                </div>
              </div>
              {expandedSections.notes ? (
                <ChevronUp className="text-muted-foreground" size={18} />
              ) : (
                <ChevronDown className="text-muted-foreground" size={18} />
              )}
            </div>

            {expandedSections.notes && (
              <div className="mt-3 space-y-2">
                {compatibilityResult.notes.map((note, index) => (
                  <div key={index} className="bg-muted/20 rounded-lg p-3 border border-border">
                    <div className="flex items-start">
                      <Info className="w-4 h-4 text-primary mr-2 mt-0.5 flex-shrink-0" />
                      <p className="text-sm">{note}</p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Summary and Actions */}
        <div className="mt-6 flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center">
            {compatibilityResult.compatible ? (
              <div className="p-2 rounded-full text-green-500 bg-green-500/20 mr-3">
                <Check className="w-5 h-5" />
              </div>
            ) : (
              <div className="p-2 rounded-full text-red-500 bg-red-500/20 mr-3">
                <AlertTriangle className="w-5 h-5" />
              </div>
            )}
            <div>
              <h3 className="font-medium">
                {compatibilityResult.compatible
                  ? "This upgrade is compatible with your system"
                  : "This upgrade requires additional components"}
              </h3>
              <p className="text-sm text-muted-foreground">
                {compatibilityResult.compatible
                  ? "You can proceed with this upgrade without major issues"
                  : "Review the compatibility issues before proceeding"}
              </p>
            </div>
          </div>

          <div className="flex gap-2">
            <FocusableItem
              focusKey="close-compatibility-btn"
              onClick={onClose}
              className="px-4 py-2 border border-border rounded-lg hover:bg-muted/50 transition-colors"
            >
              Close
            </FocusableItem>
            <FocusableItem
              focusKey="find-components-btn"
              className="px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors flex items-center"
              onClick={() =>
                window.open(
                  `https://www.google.com/search?q=${encodeURIComponent(suggestedUpgrade.name)} price`,
                  "_blank",
                )
              }
            >
              <ShoppingCart className="w-4 h-4 mr-2" />
              Find Components
            </FocusableItem>
          </div>
        </div>
      </div>
    </Card>
  )
}
