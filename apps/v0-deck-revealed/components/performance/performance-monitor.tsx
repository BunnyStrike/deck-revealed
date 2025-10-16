"use client"

import { useState } from "react"
import { FocusableItem } from "@/components/ui/focusable-item"
import { Card } from "@/components/ui/card"
import {
  Play,
  Pause,
  BarChart2,
  Cpu,
  HardDrive,
  Thermometer,
  Clock,
  RefreshCw,
  Save,
  AlertTriangle,
} from "lucide-react"
import type { PerformanceData, PerformanceIssue } from "@/types/performance"

interface PerformanceMonitorProps {
  performanceData: PerformanceData | null
  isMonitoring: boolean
  isRecording: boolean
  issues: PerformanceIssue[]
  onStartMonitoring: () => void
  onStopMonitoring: () => void
  onStartRecording: () => void
  onStopRecording: () => void
}

export function PerformanceMonitor({
  performanceData,
  isMonitoring,
  isRecording,
  issues,
  onStartMonitoring,
  onStopMonitoring,
  onStartRecording,
  onStopRecording,
}: PerformanceMonitorProps) {
  const [selectedMetric, setSelectedMetric] = useState<"fps" | "cpu" | "gpu" | "ram" | "temperature">("fps")
  const [timeRange, setTimeRange] = useState<"1m" | "5m" | "15m" | "30m" | "1h">("5m")

  // Initialize default empty arrays for all performance data properties
  const safePerformanceData = performanceData || {
    fps: [],
    cpuUsage: [],
    gpuUsage: [],
    ramUsage: [],
    temperature: {
      cpu: [],
      gpu: [],
    },
  }

  // Get the current values for each metric
  const currentFps = safePerformanceData.fps?.length
    ? safePerformanceData.fps[safePerformanceData.fps.length - 1].value.toFixed(1)
    : "N/A"

  const currentCpuUsage = safePerformanceData.cpuUsage?.length
    ? safePerformanceData.cpuUsage[safePerformanceData.cpuUsage.length - 1].value.toFixed(1)
    : "N/A"

  const currentGpuUsage = safePerformanceData.gpuUsage?.length
    ? safePerformanceData.gpuUsage[safePerformanceData.gpuUsage.length - 1].value.toFixed(1)
    : "N/A"

  const currentRamUsage = safePerformanceData.ramUsage?.length
    ? safePerformanceData.ramUsage[safePerformanceData.ramUsage.length - 1].value.toFixed(1)
    : "N/A"

  const currentCpuTemp = safePerformanceData.temperature?.cpu?.length
    ? safePerformanceData.temperature.cpu[safePerformanceData.temperature.cpu.length - 1].value.toFixed(1)
    : "N/A"

  const currentGpuTemp = safePerformanceData.temperature?.gpu?.length
    ? safePerformanceData.temperature.gpu[safePerformanceData.temperature.gpu.length - 1].value.toFixed(1)
    : "N/A"

  // Get the average values for each metric
  const avgFps = safePerformanceData.fps?.length
    ? (safePerformanceData.fps.reduce((sum, point) => sum + point.value, 0) / safePerformanceData.fps.length).toFixed(1)
    : "N/A"

  const avgCpuUsage = safePerformanceData.cpuUsage?.length
    ? (
        safePerformanceData.cpuUsage.reduce((sum, point) => sum + point.value, 0) / safePerformanceData.cpuUsage.length
      ).toFixed(1)
    : "N/A"

  const avgGpuUsage = safePerformanceData.gpuUsage?.length
    ? (
        safePerformanceData.gpuUsage.reduce((sum, point) => sum + point.value, 0) / safePerformanceData.gpuUsage.length
      ).toFixed(1)
    : "N/A"

  // Get min/max FPS
  const minFps = safePerformanceData.fps?.length
    ? Math.min(...safePerformanceData.fps.map((point) => point.value)).toFixed(1)
    : "N/A"

  const maxFps = safePerformanceData.fps?.length
    ? Math.max(...safePerformanceData.fps.map((point) => point.value)).toFixed(1)
    : "N/A"

  // Calculate 1% low FPS (average of the lowest 1% of FPS values)
  const onePercentLowFps = safePerformanceData.fps?.length
    ? (() => {
        const sortedFps = [...safePerformanceData.fps].sort((a, b) => a.value - b.value)
        const onePercentCount = Math.max(1, Math.floor(sortedFps.length * 0.01))
        return (
          sortedFps.slice(0, onePercentCount).reduce((sum, point) => sum + point.value, 0) / onePercentCount
        ).toFixed(1)
      })()
    : "N/A"

  const getFilteredData = () => {
    if (!performanceData)
      return {
        fps: [],
        cpuUsage: [],
        gpuUsage: [],
        ramUsage: [],
        temperature: {
          cpu: [],
          gpu: [],
        },
      }

    const now = Date.now()
    let timeRangeMs: number

    switch (timeRange) {
      case "1m":
        timeRangeMs = 60 * 1000
        break
      case "5m":
        timeRangeMs = 5 * 60 * 1000
        break
      case "15m":
        timeRangeMs = 15 * 60 * 1000
        break
      case "30m":
        timeRangeMs = 30 * 60 * 1000
        break
      case "1h":
        timeRangeMs = 60 * 60 * 1000
        break
      default:
        timeRangeMs = 5 * 60 * 1000
    }

    const cutoffTime = now - timeRangeMs

    // Ensure all properties exist before filtering
    const fps = performanceData.fps || []
    const cpuUsage = performanceData.cpuUsage || []
    const gpuUsage = performanceData.gpuUsage || []
    const ramUsage = performanceData.ramUsage || []
    const temperature = performanceData.temperature || { cpu: [], gpu: [] }
    const cpuTemp = temperature.cpu || []
    const gpuTemp = temperature.gpu || []

    return {
      fps: fps.filter((point) => point.timestamp >= cutoffTime),
      cpuUsage: cpuUsage.filter((point) => point.timestamp >= cutoffTime),
      gpuUsage: gpuUsage.filter((point) => point.timestamp >= cutoffTime),
      ramUsage: ramUsage.filter((point) => point.timestamp >= cutoffTime),
      temperature: {
        cpu: cpuTemp.filter((point) => point.timestamp >= cutoffTime),
        gpu: gpuTemp.filter((point) => point.timestamp >= cutoffTime),
      },
    }
  }

  const filteredData = getFilteredData()

  // Render the performance chart
  const renderChart = () => {
    if (!filteredData) return <div className="h-64 flex items-center justify-center">No data available</div>

    let data: { timestamp: number; value: number }[] = []
    let yAxisLabel = ""
    let color = ""
    let threshold1 = 0
    let threshold2 = 0

    switch (selectedMetric) {
      case "fps":
        data = filteredData.fps || []
        yAxisLabel = "FPS"
        color = "rgba(16, 185, 129, 0.8)" // Green
        threshold1 = 30 // Below 30 FPS is poor
        threshold2 = 60 // Above 60 FPS is good
        break
      case "cpu":
        data = filteredData.cpuUsage || []
        yAxisLabel = "CPU Usage (%)"
        color = "rgba(59, 130, 246, 0.8)" // Blue
        threshold1 = 80 // Above 80% is high
        threshold2 = 95 // Above 95% is critical
        break
      case "gpu":
        data = filteredData.gpuUsage || []
        yAxisLabel = "GPU Usage (%)"
        color = "rgba(139, 92, 246, 0.8)" // Purple
        threshold1 = 80 // Above 80% is high
        threshold2 = 95 // Above 95% is critical
        break
      case "ram":
        data = filteredData.ramUsage || []
        yAxisLabel = "RAM Usage (GB)"
        color = "rgba(245, 158, 11, 0.8)" // Amber
        threshold1 = 0 // No thresholds for RAM
        threshold2 = 0
        break
      case "temperature":
        // Safely handle temperature data
        const cpuData = filteredData.temperature?.cpu || []
        const gpuData = filteredData.temperature?.gpu || []

        // Only proceed if we have CPU temperature data
        if (cpuData.length > 0) {
          // Create a safe version that handles potential missing GPU data points
          data = cpuData.map((cpuPoint, index) => {
            // Use GPU data if available for this index, otherwise use CPU data
            const gpuValue = gpuData[index]?.value || cpuPoint.value
            return {
              timestamp: cpuPoint.timestamp,
              value: (cpuPoint.value + gpuValue) / 2, // Average of CPU and GPU (or just CPU if GPU not available)
            }
          })
        }
        yAxisLabel = "Temperature (°C)"
        color = "rgba(239, 68, 68, 0.8)" // Red
        threshold1 = 80 // Above 80°C is high
        threshold2 = 90 // Above 90°C is critical
        break
    }

    if (!data || data.length === 0) {
      return <div className="h-64 flex items-center justify-center">No data available for selected metric</div>
    }

    // Find min and max values for scaling
    const values = data.map((point) => point.value)
    const minValue = Math.min(...values)
    const maxValue = Math.max(...values)

    // Add some padding to the min/max
    const padding = (maxValue - minValue) * 0.1
    const yMin = Math.max(0, minValue - padding)
    const yMax = maxValue + padding

    // Calculate positions for each data point
    const chartWidth = 100 // Percentage width
    const chartHeight = 200 // Pixels height
    const points = data
      .map((point, index) => {
        const x = (index / (data.length - 1)) * chartWidth
        const y = chartHeight - ((point.value - yMin) / (yMax - yMin)) * chartHeight
        return `${x},${y}`
      })
      .join(" ")

    // Generate time labels
    const timeLabels = []
    if (data.length > 0) {
      const firstTime = new Date(data[0].timestamp)
      const lastTime = new Date(data[data.length - 1].timestamp)

      // Add 5 evenly spaced time labels
      for (let i = 0; i < 5; i++) {
        const time = new Date(firstTime.getTime() + (lastTime.getTime() - firstTime.getTime()) * (i / 4))
        timeLabels.push(time.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }))
      }
    }

    // Generate y-axis labels
    const yLabels = []
    for (let i = 0; i <= 4; i++) {
      const value = yMin + (yMax - yMin) * (i / 4)
      yLabels.unshift(value.toFixed(1))
    }

    return (
      <div className="h-64 relative">
        {/* Y-axis labels */}
        <div className="absolute left-0 top-0 bottom-0 w-10 flex flex-col justify-between text-xs text-muted-foreground">
          {yLabels.map((label, i) => (
            <div key={i} className="flex items-center">
              <span>{label}</span>
            </div>
          ))}
        </div>

        {/* Chart area */}
        <div className="absolute left-10 right-0 top-0 bottom-16">
          {/* Horizontal grid lines */}
          {[0, 1, 2, 3, 4].map((i) => (
            <div
              key={i}
              className="absolute left-0 right-0 border-t border-muted/30"
              style={{ bottom: `${(i / 4) * 100}%` }}
            />
          ))}

          {/* Threshold lines */}
          {threshold1 > 0 && (
            <div
              className="absolute left-0 right-0 border-t border-yellow-500/50"
              style={{ bottom: `${((threshold1 - yMin) / (yMax - yMin)) * 100}%` }}
            />
          )}

          {threshold2 > 0 && (
            <div
              className="absolute left-0 right-0 border-t border-red-500/50"
              style={{ bottom: `${((threshold2 - yMin) / (yMax - yMin)) * 100}%` }}
            />
          )}

          {/* Chart line */}
          <svg className="absolute inset-0 w-full h-full overflow-visible">
            <defs>
              <linearGradient id="chartGradient" x1="0%" y1="0%" x2="0%" y2="100%">
                <stop offset="0%" stopColor={color} stopOpacity="0.8" />
                <stop offset="100%" stopColor={color} stopOpacity="0.1" />
              </linearGradient>
            </defs>

            {/* Area fill */}
            <path
              d={`M0,${chartHeight} ${points} ${chartWidth},${chartHeight} Z`}
              fill="url(#chartGradient)"
              strokeWidth="0"
            />

            {/* Line */}
            <polyline
              points={points}
              fill="none"
              stroke={color}
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />

            {/* Data points */}
            {data.length <= 30 &&
              data.map((point, index) => {
                const x = (index / (data.length - 1)) * chartWidth
                const y = chartHeight - ((point.value - yMin) / (yMax - yMin)) * chartHeight
                return <circle key={index} cx={x} cy={y} r="3" fill={color} stroke="#fff" strokeWidth="1" />
              })}
          </svg>
        </div>

        {/* X-axis labels */}
        <div className="absolute left-10 right-0 bottom-0 h-16">
          <div className="flex justify-between text-xs text-muted-foreground pt-2">
            {timeLabels.map((label, i) => (
              <div key={i}>{label}</div>
            ))}
          </div>
          <div className="text-center text-sm text-muted-foreground mt-4">Time</div>
        </div>

        {/* Y-axis label */}
        <div className="absolute left-0 top-0 bottom-16 w-10 flex items-center justify-center">
          <div className="transform -rotate-90 text-sm text-muted-foreground whitespace-nowrap">{yAxisLabel}</div>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Metrics overview */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card className="bg-card border-border p-4 rounded-xl">
          <div className="flex items-center">
            <div className="bg-green-500/20 p-2 rounded-lg mr-3">
              <BarChart2 className="text-green-500" size={20} />
            </div>
            <div>
              <p className="text-muted-foreground text-sm">FPS</p>
              <div className="flex items-baseline">
                <p className="font-bold text-xl">{currentFps}</p>
                <p className="text-xs text-muted-foreground ml-2">Avg: {avgFps}</p>
              </div>
            </div>
          </div>
        </Card>

        <Card className="bg-card border-border p-4 rounded-xl">
          <div className="flex items-center">
            <div className="bg-blue-500/20 p-2 rounded-lg mr-3">
              <Cpu className="text-blue-500" size={20} />
            </div>
            <div>
              <p className="text-muted-foreground text-sm">CPU</p>
              <div className="flex items-baseline">
                <p className="font-bold text-xl">{currentCpuUsage}%</p>
                <p className="text-xs text-muted-foreground ml-2">{currentCpuTemp}°C</p>
              </div>
            </div>
          </div>
        </Card>

        <Card className="bg-card border-border p-4 rounded-xl">
          <div className="flex items-center">
            <div className="bg-purple-500/20 p-2 rounded-lg mr-3">
              <HardDrive className="text-purple-500" size={20} />
            </div>
            <div>
              <p className="text-muted-foreground text-sm">GPU</p>
              <div className="flex items-baseline">
                <p className="font-bold text-xl">{currentGpuUsage}%</p>
                <p className="text-xs text-muted-foreground ml-2">{currentGpuTemp}°C</p>
              </div>
            </div>
          </div>
        </Card>

        <Card className="bg-card border-border p-4 rounded-xl">
          <div className="flex items-center">
            <div className="bg-amber-500/20 p-2 rounded-lg mr-3">
              <Thermometer className="text-amber-500" size={20} />
            </div>
            <div>
              <p className="text-muted-foreground text-sm">RAM</p>
              <div className="flex items-baseline">
                <p className="font-bold text-xl">{currentRamUsage} GB</p>
                <p className="text-xs text-muted-foreground ml-2">Usage</p>
              </div>
            </div>
          </div>
        </Card>
      </div>

      {/* FPS details */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="bg-card border-border p-4 rounded-xl">
          <div className="flex items-center">
            <div className="bg-green-500/20 p-2 rounded-lg mr-3">
              <Clock className="text-green-500" size={20} />
            </div>
            <div>
              <p className="text-muted-foreground text-sm">Min FPS</p>
              <p className="font-bold">{minFps}</p>
            </div>
          </div>
        </Card>

        <Card className="bg-card border-border p-4 rounded-xl">
          <div className="flex items-center">
            <div className="bg-red-500/20 p-2 rounded-lg mr-3">
              <Clock className="text-red-500" size={20} />
            </div>
            <div>
              <p className="text-muted-foreground text-sm">1% Low FPS</p>
              <p className="font-bold">{onePercentLowFps}</p>
            </div>
          </div>
        </Card>

        <Card className="bg-card border-border p-4 rounded-xl">
          <div className="flex items-center">
            <div className="bg-blue-500/20 p-2 rounded-lg mr-3">
              <Clock className="text-blue-500" size={20} />
            </div>
            <div>
              <p className="text-muted-foreground text-sm">Max FPS</p>
              <p className="font-bold">{maxFps}</p>
            </div>
          </div>
        </Card>
      </div>

      {/* Performance chart */}
      <Card className="bg-card border-border p-6 rounded-xl">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-semibold">Performance Chart</h2>
          <div className="flex items-center space-x-2">
            {isMonitoring ? (
              <FocusableItem
                focusKey="stop-monitoring"
                className="flex items-center bg-red-500/20 text-red-500 px-3 py-1 rounded-lg text-sm hover:bg-red-500/30 transition-colors"
                onClick={onStopMonitoring}
              >
                <Pause className="w-4 h-4 mr-1" />
                <span>Stop</span>
              </FocusableItem>
            ) : (
              <FocusableItem
                focusKey="start-monitoring"
                className="flex items-center bg-green-500/20 text-green-500 px-3 py-1 rounded-lg text-sm hover:bg-green-500/30 transition-colors"
                onClick={onStartMonitoring}
              >
                <Play className="w-4 h-4 mr-1" />
                <span>Start</span>
              </FocusableItem>
            )}

            {isRecording ? (
              <FocusableItem
                focusKey="stop-recording"
                className="flex items-center bg-red-500/20 text-red-500 px-3 py-1 rounded-lg text-sm hover:bg-red-500/30 transition-colors"
                onClick={onStopRecording}
              >
                <Save className="w-4 h-4 mr-1" />
                <span>Save Recording</span>
              </FocusableItem>
            ) : (
              <FocusableItem
                focusKey="start-recording"
                className="flex items-center bg-blue-500/20 text-blue-500 px-3 py-1 rounded-lg text-sm hover:bg-blue-500/30 transition-colors"
                onClick={onStartRecording}
              >
                <RefreshCw className="w-4 h-4 mr-1" />
                <span>Record Session</span>
              </FocusableItem>
            )}
          </div>
        </div>

        <div className="space-y-4">
          {/* Metric selector */}
          <div className="flex overflow-x-auto scrollbar-thin pb-2">
            <FocusableItem
              focusKey="metric-fps"
              className={`px-3 py-1 rounded-lg mr-2 whitespace-nowrap transition-colors flex items-center ${
                selectedMetric === "fps"
                  ? "bg-green-500/20 text-green-500"
                  : "bg-muted/30 text-muted-foreground hover:bg-muted/50 hover:text-foreground"
              }`}
              onClick={() => setSelectedMetric("fps")}
            >
              <BarChart2 className="w-4 h-4 mr-1" />
              <span>FPS</span>
            </FocusableItem>

            <FocusableItem
              focusKey="metric-cpu"
              className={`px-3 py-1 rounded-lg mr-2 whitespace-nowrap transition-colors flex items-center ${
                selectedMetric === "cpu"
                  ? "bg-blue-500/20 text-blue-500"
                  : "bg-muted/30 text-muted-foreground hover:bg-muted/50 hover:text-foreground"
              }`}
              onClick={() => setSelectedMetric("cpu")}
            >
              <Cpu className="w-4 h-4 mr-1" />
              <span>CPU Usage</span>
            </FocusableItem>

            <FocusableItem
              focusKey="metric-gpu"
              className={`px-3 py-1 rounded-lg mr-2 whitespace-nowrap transition-colors flex items-center ${
                selectedMetric === "gpu"
                  ? "bg-purple-500/20 text-purple-500"
                  : "bg-muted/30 text-muted-foreground hover:bg-muted/50 hover:text-foreground"
              }`}
              onClick={() => setSelectedMetric("gpu")}
            >
              <HardDrive className="w-4 h-4 mr-1" />
              <span>GPU Usage</span>
            </FocusableItem>

            <FocusableItem
              focusKey="metric-ram"
              className={`px-3 py-1 rounded-lg mr-2 whitespace-nowrap transition-colors flex items-center ${
                selectedMetric === "ram"
                  ? "bg-amber-500/20 text-amber-500"
                  : "bg-muted/30 text-muted-foreground hover:bg-muted/50 hover:text-foreground"
              }`}
              onClick={() => setSelectedMetric("ram")}
            >
              <Thermometer className="w-4 h-4 mr-1" />
              <span>RAM Usage</span>
            </FocusableItem>

            <FocusableItem
              focusKey="metric-temperature"
              className={`px-3 py-1 rounded-lg mr-2 whitespace-nowrap transition-colors flex items-center ${
                selectedMetric === "temperature"
                  ? "bg-red-500/20 text-red-500"
                  : "bg-muted/30 text-muted-foreground hover:bg-muted/50 hover:text-foreground"
              }`}
              onClick={() => setSelectedMetric("temperature")}
            >
              <Thermometer className="w-4 h-4 mr-1" />
              <span>Temperature</span>
            </FocusableItem>
          </div>

          {/* Time range selector */}
          <div className="flex justify-end">
            <div className="flex bg-muted/30 rounded-lg p-1">
              {(["1m", "5m", "15m", "30m", "1h"] as const).map((range) => (
                <FocusableItem
                  key={range}
                  focusKey={`range-${range}`}
                  className={`px-2 py-1 rounded text-xs ${
                    timeRange === range ? "bg-primary text-white" : "text-muted-foreground hover:text-foreground"
                  }`}
                  onClick={() => setTimeRange(range)}
                >
                  {range}
                </FocusableItem>
              ))}
            </div>
          </div>

          {/* Chart */}
          {renderChart()}
        </div>
      </Card>

      {/* Performance issues */}
      {issues && issues.length > 0 && (
        <Card className="bg-card border-border p-6 rounded-xl">
          <h2 className="text-xl font-semibold mb-4 flex items-center">
            <AlertTriangle className="text-amber-500 mr-2" size={20} />
            Performance Issues Detected
          </h2>

          <div className="space-y-4">
            {issues.map((issue, index) => (
              <div
                key={index}
                className={`p-4 rounded-lg ${
                  issue.severity === "Critical"
                    ? "bg-red-500/10 border border-red-500/30"
                    : issue.severity === "High"
                      ? "bg-amber-500/10 border border-amber-500/30"
                      : "bg-blue-500/10 border border-blue-500/30"
                }`}
              >
                <div className="flex items-start">
                  <AlertTriangle
                    className={`mt-1 mr-3 ${
                      issue.severity === "Critical"
                        ? "text-red-500"
                        : issue.severity === "High"
                          ? "text-amber-500"
                          : "text-blue-500"
                    }`}
                    size={18}
                  />
                  <div>
                    <h3 className="font-medium mb-1">
                      {issue.type} ({issue.severity})
                    </h3>
                    <p className="text-sm text-muted-foreground mb-2">{issue.description}</p>
                    <p className="text-sm font-medium">Recommendation:</p>
                    <p className="text-sm text-muted-foreground">{issue.recommendation}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </Card>
      )}
    </div>
  )
}
