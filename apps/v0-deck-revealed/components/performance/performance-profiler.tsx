"use client"

import { useState } from "react"
import { Card } from "@/components/ui/card"
import { FocusableItem } from "@/components/ui/focusable-item"
import { Cpu, BarChart3, Gauge, Settings, FileBarChart } from "lucide-react"
import { usePerformance } from "@/hooks/use-performance"
import { SettingsOptimizer } from "./settings-optimizer"
import { PerformanceProfiles } from "./performance-profiles"
import { PerformanceMonitor } from "./performance-monitor"
import { HardwareInfoDisplay } from "./hardware-info"
import { BottleneckAnalyzer } from "./bottleneck-analyzer"
import { GamepadHints } from "@/components/ui/gamepad-hints"

const PROFILER_TABS = [
  { id: "monitor", name: "Performance Monitor", icon: <BarChart3 className="w-5 h-5" /> },
  { id: "hardware", name: "Hardware Info", icon: <Cpu className="w-5 h-5" /> },
  { id: "bottlenecks", name: "Bottleneck Analysis", icon: <Gauge className="w-5 h-5" /> },
  { id: "optimizer", name: "Settings Optimizer", icon: <Settings className="w-5 h-5" /> },
  { id: "profiles", name: "Performance Profiles", icon: <FileBarChart className="w-5 h-5" /> },
]

interface PerformanceProfilerProps {
  gameId: string
}

export function PerformanceProfiler({ gameId }: PerformanceProfilerProps) {
  const [activeTab, setActiveTab] = useState("monitor")

  const {
    isMonitoring,
    performanceData,
    hardwareInfo,
    currentSettings,
    recommendations,
    performanceIssues,
    performanceProfiles,
    optimizationPresets,
    selectedPreset,
    isRecording,
    startMonitoring,
    stopMonitoring,
    startRecording,
    stopRecording,
    applyPreset,
    applyRecommendation,
    applyAllRecommendations,
    bottleneckAnalysis,
  } = usePerformance(gameId)

  const renderTabContent = () => {
    switch (activeTab) {
      case "monitor":
        return (
          <PerformanceMonitor
            isMonitoring={isMonitoring}
            performanceData={performanceData}
            isRecording={isRecording}
            startMonitoring={startMonitoring}
            stopMonitoring={stopMonitoring}
            startRecording={startRecording}
            stopRecording={stopRecording}
            performanceIssues={performanceIssues}
          />
        )
      case "hardware":
        return <HardwareInfoDisplay hardwareInfo={hardwareInfo} />
      case "bottlenecks":
        return <BottleneckAnalyzer bottleneckAnalysis={bottleneckAnalysis} hardwareInfo={hardwareInfo} />
      case "optimizer":
        return (
          <SettingsOptimizer
            currentSettings={currentSettings}
            recommendations={recommendations}
            optimizationPresets={optimizationPresets}
            selectedPreset={selectedPreset}
            applyRecommendation={applyRecommendation}
            applyAllRecommendations={applyAllRecommendations}
            applyPreset={applyPreset}
          />
        )
      case "profiles":
        return <PerformanceProfiles profiles={performanceProfiles} />
      default:
        return null
    }
  }

  return (
    <div className="h-full flex flex-col">
      <Card className="flex-1 border-border bg-card rounded-xl overflow-hidden flex flex-col">
        <div className="flex border-b border-border">
          {PROFILER_TABS.map((tab) => (
            <FocusableItem
              key={tab.id}
              focusKey={`tab-${tab.id}`}
              className={`flex items-center px-4 py-3 text-sm font-medium border-r border-border cursor-pointer transition-colors ${
                activeTab === tab.id
                  ? "bg-muted/50 text-foreground"
                  : "text-muted-foreground hover:bg-muted/30 hover:text-foreground"
              }`}
              onClick={() => setActiveTab(tab.id)}
            >
              <span className="mr-2">{tab.icon}</span>
              {tab.name}
            </FocusableItem>
          ))}
        </div>

        <div className="flex-1 overflow-auto p-4">{renderTabContent()}</div>

        <div className="border-t border-border p-2">
          <GamepadHints
            hints={[
              { button: "A", label: "Select" },
              { button: "B", label: "Back" },
              { button: "LB/RB", label: "Switch Tab" },
              ...(activeTab === "monitor"
                ? [
                    { button: "X", label: isMonitoring ? "Stop Monitoring" : "Start Monitoring" },
                    { button: "Y", label: isRecording ? "Stop Recording" : "Start Recording" },
                  ]
                : []),
              ...(activeTab === "optimizer"
                ? [
                    { button: "X", label: "Apply Selected" },
                    { button: "Y", label: "Apply All" },
                  ]
                : []),
            ]}
          />
        </div>
      </Card>
    </div>
  )
}
