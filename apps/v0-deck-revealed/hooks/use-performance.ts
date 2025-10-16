"use client"

import { useState, useEffect, useCallback } from "react"
import type {
  PerformanceData,
  HardwareInfo,
  GameSettings,
  SettingsRecommendation,
  PerformanceIssue,
  PerformanceProfile,
  PerformanceOptimizationPreset,
  BottleneckAnalysis,
  UpgradeRecommendation,
  SuggestedUpgrade,
} from "@/types/performance"

// Mock hardware info
const mockHardwareInfo: HardwareInfo = {
  cpu: {
    name: "AMD Ryzen 7 5800X",
    cores: 8,
    threads: 16,
    baseSpeed: "3.8 GHz",
    maxSpeed: "4.7 GHz",
    architecture: "Zen 3",
  },
  gpu: {
    name: "NVIDIA GeForce RTX 3070",
    vram: "8 GB GDDR6",
    driver: "531.41",
    architecture: "Ampere",
  },
  ram: {
    total: "32 GB",
    speed: "3600 MHz",
    type: "DDR4",
  },
  storage: {
    type: "NVMe",
    model: "Samsung 970 EVO Plus",
    size: "1 TB",
    freeSpace: "450 GB",
  },
  os: {
    name: "Windows 11",
    version: "22H2",
    build: "22621.1413",
  },
  motherboard: {
    manufacturer: "MSI",
    model: "MAG B550 TOMAHAWK",
    chipset: "AMD B550",
  },
  network: {
    type: "Ethernet",
    speed: "1 Gbps",
    latency: "15 ms",
  },
}

// Mock current game settings
const mockGameSettings: GameSettings = {
  resolution: "2560x1440",
  displayMode: "Fullscreen",
  vsync: false,
  frameRateLimit: 144,
  graphicsPreset: "High",
  antialiasing: "TAA",
  textureQuality: "High",
  shadowQuality: "Medium",
  lightingQuality: "High",
  effectsQuality: "High",
  postProcessing: "Medium",
  viewDistance: "High",
  foliageQuality: "Medium",
  ambientOcclusion: "SSAO",
  rayTracing: false,
  dlss: "Balanced",
  motionBlur: false,
  depthOfField: true,
  bloomEffect: true,
  chromaticAberration: false,
  filmGrain: false,
  volumetricFog: true,
  volumetricClouds: true,
  screenSpaceReflections: true,
  subsurfaceScattering: false,
  anisotropicFiltering: "16x",
  tessellation: true,
  hdr: true,
}

// Mock optimization presets
const mockOptimizationPresets: PerformanceOptimizationPreset[] = [
  {
    id: "max-performance",
    name: "Maximum Performance",
    description: "Optimizes for highest possible frame rates at the expense of visual quality",
    settings: {
      graphicsPreset: "Low",
      textureQuality: "Medium",
      shadowQuality: "Low",
      lightingQuality: "Low",
      effectsQuality: "Low",
      postProcessing: "Low",
      viewDistance: "Medium",
      antialiasing: "FXAA",
      ambientOcclusion: "Off",
      rayTracing: false,
      motionBlur: false,
      depthOfField: false,
      volumetricFog: false,
      volumetricClouds: false,
      screenSpaceReflections: false,
    },
    performanceImpact: {
      fps: "+40-60%",
      quality: "Low",
    },
  },
  {
    id: "balanced",
    name: "Balanced",
    description: "Provides a good balance between performance and visual quality",
    settings: {
      graphicsPreset: "Medium",
      textureQuality: "High",
      shadowQuality: "Medium",
      lightingQuality: "Medium",
      effectsQuality: "Medium",
      postProcessing: "Medium",
      viewDistance: "Medium",
      antialiasing: "TAA",
      ambientOcclusion: "SSAO",
      rayTracing: false,
      dlss: "Balanced",
      motionBlur: false,
    },
    performanceImpact: {
      fps: "+15-30%",
      quality: "Medium",
    },
  },
  {
    id: "quality",
    name: "Quality",
    description: "Emphasizes visual quality while maintaining good performance",
    settings: {
      graphicsPreset: "High",
      textureQuality: "Ultra",
      shadowQuality: "High",
      lightingQuality: "High",
      effectsQuality: "High",
      postProcessing: "High",
      viewDistance: "High",
      antialiasing: "TAA",
      ambientOcclusion: "HBAO",
      rayTracing: false,
      dlss: "Quality",
    },
    performanceImpact: {
      fps: "Baseline",
      quality: "High",
    },
  },
  {
    id: "ray-tracing",
    name: "Ray Tracing",
    description: "Enables ray tracing features for maximum visual fidelity",
    settings: {
      graphicsPreset: "Ultra",
      textureQuality: "Ultra",
      shadowQuality: "Ultra",
      lightingQuality: "Ultra",
      effectsQuality: "Ultra",
      postProcessing: "Ultra",
      viewDistance: "Ultra",
      antialiasing: "TAA",
      ambientOcclusion: "RTAO",
      rayTracing: true,
      dlss: "Quality",
    },
    targetHardware: {
      minGpu: "NVIDIA RTX 2060",
      recommendedGpu: "NVIDIA RTX 3070 or better",
    },
    performanceImpact: {
      fps: "-15-30%",
      quality: "Ultra",
    },
  },
]

// Mock performance profiles
const mockPerformanceProfiles: PerformanceProfile[] = [
  {
    id: "profile1",
    gameId: "game1", // Cyberpunk 2077
    date: "2023-05-15T14:30:00Z",
    duration: 3600, // 1 hour in seconds
    averageFps: 78.5,
    minFps: 45.2,
    maxFps: 120.3,
    onePercentLowFps: 52.1,
    averageCpuUsage: 65.3,
    averageGpuUsage: 92.7,
    averageRamUsage: 12.4,
    averageVramUsage: 6.8,
    averageTemperature: {
      cpu: 72.5,
      gpu: 78.2,
    },
    settings: mockGameSettings,
    issues: [
      {
        type: "GPU Bottleneck",
        severity: "Medium",
        description: "Your GPU is running at high utilization, which may limit performance in demanding scenes.",
        recommendation: "Consider lowering shadow quality and post-processing effects to reduce GPU load.",
      },
    ],
    recommendations: [
      {
        setting: "shadowQuality",
        currentValue: "Medium",
        recommendedValue: "Low",
        performanceImpact: "High",
        visualImpact: "Medium",
        description: "Lowering shadow quality can significantly improve performance with minimal visual impact.",
      },
      {
        setting: "volumetricClouds",
        currentValue: true,
        recommendedValue: false,
        performanceImpact: "Medium",
        visualImpact: "Low",
        description: "Disabling volumetric clouds can improve performance in outdoor scenes.",
      },
    ],
  },
  {
    id: "profile2",
    gameId: "game1", // Cyberpunk 2077
    date: "2023-05-10T18:45:00Z",
    duration: 2700, // 45 minutes in seconds
    averageFps: 65.2,
    minFps: 38.7,
    maxFps: 110.5,
    onePercentLowFps: 42.3,
    averageCpuUsage: 70.1,
    averageGpuUsage: 95.3,
    averageRamUsage: 13.2,
    averageVramUsage: 7.1,
    averageTemperature: {
      cpu: 75.8,
      gpu: 82.4,
    },
    settings: {
      ...mockGameSettings,
      rayTracing: true,
      dlss: "Performance",
    },
    issues: [
      {
        type: "Thermal Throttling",
        severity: "High",
        description:
          "Your GPU is reaching high temperatures, which may cause thermal throttling and reduced performance.",
        recommendation: "Improve system cooling or lower graphics settings to reduce GPU load and temperature.",
      },
    ],
    recommendations: [
      {
        setting: "rayTracing",
        currentValue: true,
        recommendedValue: false,
        performanceImpact: "Critical",
        visualImpact: "High",
        description: "Disabling ray tracing will significantly improve performance but will reduce lighting quality.",
      },
    ],
  },
]

// Generate mock performance data
const generateMockPerformanceData = (duration = 300): PerformanceData => {
  const now = Date.now()
  const data: PerformanceData = {
    fps: [],
    cpuUsage: [],
    gpuUsage: [],
    ramUsage: [],
    vramUsage: [],
    temperature: {
      cpu: [],
      gpu: [],
    },
    frameTime: [],
    loadTime: 12.5,
  }

  // Generate data points at 1-second intervals
  for (let i = 0; i < duration; i++) {
    const timestamp = now - (duration - i) * 1000 // Going from past to present

    // Generate somewhat realistic values with some variation
    const baseFps = 75 + Math.sin(i / 10) * 15
    const fps = Math.max(30, Math.min(144, baseFps + (Math.random() * 10 - 5)))

    const baseCpuUsage = 60 + Math.sin(i / 15) * 20
    const cpuUsage = Math.max(20, Math.min(95, baseCpuUsage + (Math.random() * 10 - 5)))

    const baseGpuUsage = 85 + Math.sin(i / 20) * 10
    const gpuUsage = Math.max(30, Math.min(99, baseGpuUsage + (Math.random() * 10 - 5)))

    const baseRamUsage = 12 + Math.sin(i / 30) * 2
    const ramUsage = Math.max(8, Math.min(16, baseRamUsage + (Math.random() * 1 - 0.5)))

    const baseVramUsage = 6 + Math.sin(i / 25) * 1
    const vramUsage = Math.max(3, Math.min(8, baseVramUsage + (Math.random() * 0.5 - 0.25)))

    const baseCpuTemp = 70 + Math.sin(i / 18) * 5
    const cpuTemp = Math.max(50, Math.min(85, baseCpuTemp + (Math.random() * 3 - 1.5)))

    const baseGpuTemp = 75 + Math.sin(i / 22) * 7
    const gpuTemp = Math.max(55, Math.min(90, baseGpuTemp + (Math.random() * 3 - 1.5)))

    const frameTime = 1000 / fps

    data.fps.push({ timestamp, value: fps })
    data.cpuUsage.push({ timestamp, value: cpuUsage })
    data.gpuUsage.push({ timestamp, value: gpuUsage })
    data.ramUsage.push({ timestamp, value: ramUsage })
    data.vramUsage.push({ timestamp, value: vramUsage })
    data.temperature.cpu.push({ timestamp, value: cpuTemp })
    data.temperature.gpu.push({ timestamp, value: gpuTemp })
    data.frameTime.push({ timestamp, value: frameTime })
  }

  return data
}

// Generate settings recommendations based on hardware and current settings
const generateSettingsRecommendations = (
  hardware: HardwareInfo,
  currentSettings: GameSettings,
): SettingsRecommendation[] => {
  const recommendations: SettingsRecommendation[] = []

  // Check if GPU supports ray tracing
  const supportsRayTracing = hardware.gpu.name.includes("RTX") || hardware.gpu.name.includes("RX 6")
  if (currentSettings.rayTracing && !supportsRayTracing) {
    recommendations.push({
      setting: "rayTracing",
      currentValue: true,
      recommendedValue: false,
      performanceImpact: "Critical",
      visualImpact: "High",
      description: "Your GPU does not fully support ray tracing. Disabling it will significantly improve performance.",
    })
  }

  // Check if GPU supports DLSS
  const supportsDLSS = hardware.gpu.name.includes("RTX")
  if (currentSettings.dlss !== "Off" && !supportsDLSS) {
    recommendations.push({
      setting: "dlss",
      currentValue: currentSettings.dlss,
      recommendedValue: "Off",
      performanceImpact: "Medium",
      visualImpact: "Low",
      description: "Your GPU does not support DLSS. Consider using FSR instead if available.",
    })
  }

  // Check if GPU supports FSR
  const supportsFSR = true // Most modern GPUs support FSR
  if (!supportsDLSS && currentSettings.fsr === "Off" && supportsFSR) {
    recommendations.push({
      setting: "fsr",
      currentValue: "Off",
      recommendedValue: "Balanced",
      performanceImpact: "High",
      visualImpact: "Low",
      description: "Enabling FSR can significantly improve performance with minimal visual impact.",
    })
  }

  // Recommend settings based on GPU tier
  const isHighEndGPU =
    hardware.gpu.name.includes("RTX 30") ||
    hardware.gpu.name.includes("RTX 40") ||
    hardware.gpu.name.includes("RX 6800") ||
    hardware.gpu.name.includes("RX 6900") ||
    hardware.gpu.name.includes("RX 7")

  const isMidRangeGPU =
    hardware.gpu.name.includes("RTX 20") ||
    hardware.gpu.name.includes("RTX 3050") ||
    hardware.gpu.name.includes("RTX 3060") ||
    hardware.gpu.name.includes("GTX 16") ||
    hardware.gpu.name.includes("RX 5") ||
    hardware.gpu.name.includes("RX 6600") ||
    hardware.gpu.name.includes("RX 6700")

  if (!isHighEndGPU && currentSettings.shadowQuality === "Ultra") {
    recommendations.push({
      setting: "shadowQuality",
      currentValue: "Ultra",
      recommendedValue: isMidRangeGPU ? "High" : "Medium",
      performanceImpact: "High",
      visualImpact: "Low",
      description:
        "Shadow quality has a significant impact on performance. Reducing it can improve frame rates with minimal visual difference.",
    })
  }

  if (!isHighEndGPU && currentSettings.postProcessing === "Ultra") {
    recommendations.push({
      setting: "postProcessing",
      currentValue: "Ultra",
      recommendedValue: "Medium",
      performanceImpact: "Medium",
      visualImpact: "Low",
      description: "Lowering post-processing effects can improve performance while maintaining good visual quality.",
    })
  }

  // Check VRAM usage for texture settings
  const vramGB = Number.parseInt(hardware.gpu.vram.split(" ")[0])
  if (vramGB < 8 && currentSettings.textureQuality === "Ultra") {
    recommendations.push({
      setting: "textureQuality",
      currentValue: "Ultra",
      recommendedValue: "High",
      performanceImpact: "Medium",
      visualImpact: "Low",
      description:
        "Your GPU has limited VRAM. Lowering texture quality can prevent stuttering due to VRAM limitations.",
    })
  }

  // Add more recommendations based on other hardware factors
  if (hardware.cpu.cores < 6 && currentSettings.effectsQuality === "Ultra") {
    recommendations.push({
      setting: "effectsQuality",
      currentValue: "Ultra",
      recommendedValue: "Medium",
      performanceImpact: "Medium",
      visualImpact: "Medium",
      description:
        "Effects quality can be CPU-intensive. Lowering it can improve performance on CPUs with fewer cores.",
    })
  }

  return recommendations
}

// Detect performance issues based on metrics
const detectPerformanceIssues = (performanceData: PerformanceData, hardware: HardwareInfo): PerformanceIssue[] => {
  const issues: PerformanceIssue[] = []

  // Calculate averages
  const avgFps = performanceData.fps.reduce((sum, point) => sum + point.value, 0) / performanceData.fps.length
  const avgCpuUsage =
    performanceData.cpuUsage.reduce((sum, point) => sum + point.value, 0) / performanceData.cpuUsage.length
  const avgGpuUsage =
    performanceData.gpuUsage.reduce((sum, point) => sum + point.value, 0) / performanceData.gpuUsage.length
  const avgCpuTemp =
    performanceData.temperature.cpu.reduce((sum, point) => sum + point.value, 0) /
    performanceData.temperature.cpu.length
  const avgGpuTemp =
    performanceData.temperature.gpu.reduce((sum, point) => sum + point.value, 0) /
    performanceData.temperature.gpu.length

  // Check for CPU bottleneck
  if (avgCpuUsage > 90 && avgGpuUsage < 80) {
    issues.push({
      type: "CPU Bottleneck",
      severity: avgFps < 60 ? "High" : "Medium",
      description:
        "Your CPU is running at high utilization while your GPU is not fully utilized, indicating a CPU bottleneck.",
      recommendation:
        "Consider lowering CPU-intensive settings like physics, AI, and view distance. Closing background applications may also help.",
    })
  }

  // Check for GPU bottleneck
  if (avgGpuUsage > 95) {
    issues.push({
      type: "GPU Bottleneck",
      severity: avgFps < 60 ? "High" : "Medium",
      description: "Your GPU is running at maximum utilization, limiting your frame rate.",
      recommendation:
        "Lower graphics settings, especially resolution, shadows, and effects, or enable DLSS/FSR if available.",
    })
  }

  // Check for thermal throttling
  if (avgCpuTemp > 85) {
    issues.push({
      type: "Thermal Throttling",
      severity: "High",
      description:
        "Your CPU is running at high temperatures, which may cause thermal throttling and reduced performance.",
      recommendation: "Improve system cooling, clean dust from fans and heatsinks, or consider undervolting your CPU.",
    })
  }

  if (avgGpuTemp > 85) {
    issues.push({
      type: "Thermal Throttling",
      severity: "High",
      description:
        "Your GPU is running at high temperatures, which may cause thermal throttling and reduced performance.",
      recommendation:
        "Improve system cooling, clean dust from fans and heatsinks, or consider creating a custom fan curve.",
    })
  }

  // Check for storage bottleneck
  if (hardware.storage.type === "HDD" && performanceData.loadTime > 30) {
    issues.push({
      type: "Storage Bottleneck",
      severity: "Medium",
      description: "Your HDD storage may be causing long load times and potential stuttering during gameplay.",
      recommendation: "Consider upgrading to an SSD for faster load times and smoother gameplay.",
    })
  }

  return issues
}

// Mock CPU upgrade suggestions
const cpuUpgradeSuggestions: Record<string, SuggestedUpgrade[]> = {
  "AMD Ryzen 5": [
    {
      name: "AMD Ryzen 7 5800X3D",
      description: "8-core, 16-thread CPU with 3D V-Cache technology for gaming",
      performanceImprovement: "+15-30% FPS",
      estimatedPrice: "$329-399",
      tier: "High-end",
      benchmarkScore: 25800,
      releaseYear: 2022,
      powerRequirement: "105W TDP",
    },
    {
      name: "AMD Ryzen 7 7800X3D",
      description: "8-core, 16-thread CPU with 3D V-Cache on Zen 4 architecture",
      performanceImprovement: "+25-40% FPS",
      estimatedPrice: "$449-499",
      tier: "Enthusiast",
      compatibilityNotes: "Requires AM5 motherboard and DDR5 RAM",
      benchmarkScore: 31500,
      releaseYear: 2023,
      powerRequirement: "120W TDP",
    },
  ],
  "AMD Ryzen 7": [
    {
      name: "AMD Ryzen 7 5800X3D",
      description: "8-core, 16-thread CPU with 3D V-Cache technology for gaming",
      performanceImprovement: "+10-20% FPS",
      estimatedPrice: "$329-399",
      tier: "High-end",
      benchmarkScore: 25800,
      releaseYear: 2022,
      powerRequirement: "105W TDP",
    },
    {
      name: "AMD Ryzen 9 5950X",
      description: "16-core, 32-thread CPU for high-end workstations and gaming",
      performanceImprovement: "+5-15% FPS, +40-60% productivity",
      estimatedPrice: "$499-599",
      tier: "Enthusiast",
      benchmarkScore: 28500,
      releaseYear: 2020,
      powerRequirement: "105W TDP",
    },
    {
      name: "AMD Ryzen 7 7800X3D",
      description: "8-core, 16-thread CPU with 3D V-Cache on Zen 4 architecture",
      performanceImprovement: "+20-35% FPS",
      estimatedPrice: "$449-499",
      tier: "Enthusiast",
      compatibilityNotes: "Requires AM5 motherboard and DDR5 RAM",
      benchmarkScore: 31500,
      releaseYear: 2023,
      powerRequirement: "120W TDP",
    },
  ],
  "Intel Core i5": [
    {
      name: "Intel Core i7-12700K",
      description: "12-core (8P+4E), 20-thread CPU with hybrid architecture",
      performanceImprovement: "+15-30% FPS",
      estimatedPrice: "$349-399",
      tier: "High-end",
      benchmarkScore: 27000,
      releaseYear: 2021,
      powerRequirement: "125W TDP",
    },
    {
      name: "Intel Core i7-13700K",
      description: "16-core (8P+8E), 24-thread CPU with improved hybrid architecture",
      performanceImprovement: "+25-40% FPS",
      estimatedPrice: "$399-449",
      tier: "Enthusiast",
      benchmarkScore: 31000,
      releaseYear: 2022,
      powerRequirement: "125W TDP",
    },
  ],
  "Intel Core i7": [
    {
      name: "Intel Core i7-13700K",
      description: "16-core (8P+8E), 24-thread CPU with improved hybrid architecture",
      performanceImprovement: "+10-20% FPS",
      estimatedPrice: "$399-449",
      tier: "High-end",
      benchmarkScore: 31000,
      releaseYear: 2022,
      powerRequirement: "125W TDP",
    },
    {
      name: "Intel Core i9-13900K",
      description: "24-core (8P+16E), 32-thread flagship CPU",
      performanceImprovement: "+15-25% FPS, +30-40% productivity",
      estimatedPrice: "$549-599",
      tier: "Enthusiast",
      benchmarkScore: 38000,
      releaseYear: 2022,
      powerRequirement: "125W TDP (250W turbo)",
    },
  ],
}

// Mock GPU upgrade suggestions
const gpuUpgradeSuggestions: Record<string, SuggestedUpgrade[]> = {
  "NVIDIA GeForce GTX": [
    {
      name: "NVIDIA GeForce RTX 3060",
      description: "Mid-range GPU with ray tracing and DLSS support",
      performanceImprovement: "+70-120% FPS",
      estimatedPrice: "$299-349",
      tier: "Mid-range",
      benchmarkScore: 14500,
      releaseYear: 2021,
      powerRequirement: "170W",
    },
    {
      name: "NVIDIA GeForce RTX 3070",
      description: "High-performance GPU with excellent ray tracing capabilities",
      performanceImprovement: "+120-180% FPS",
      estimatedPrice: "$499-599",
      tier: "High-end",
      benchmarkScore: 20500,
      releaseYear: 2020,
      powerRequirement: "220W",
    },
    {
      name: "NVIDIA GeForce RTX 4060 Ti",
      description: "Latest generation mid-range GPU with improved ray tracing",
      performanceImprovement: "+100-150% FPS",
      estimatedPrice: "$399-449",
      tier: "Mid-range",
      benchmarkScore: 19000,
      releaseYear: 2023,
      powerRequirement: "160W",
    },
  ],
  "NVIDIA GeForce RTX 20": [
    {
      name: "NVIDIA GeForce RTX 3070",
      description: "High-performance GPU with excellent ray tracing capabilities",
      performanceImprovement: "+40-70% FPS",
      estimatedPrice: "$499-599",
      tier: "High-end",
      benchmarkScore: 20500,
      releaseYear: 2020,
      powerRequirement: "220W",
    },
    {
      name: "NVIDIA GeForce RTX 4070",
      description: "Latest generation high-performance GPU",
      performanceImprovement: "+60-100% FPS",
      estimatedPrice: "$599-649",
      tier: "High-end",
      benchmarkScore: 25000,
      releaseYear: 2023,
      powerRequirement: "200W",
    },
  ],
  "NVIDIA GeForce RTX 3050": [
    {
      name: "NVIDIA GeForce RTX 3070",
      description: "High-performance GPU with excellent ray tracing capabilities",
      performanceImprovement: "+70-100% FPS",
      estimatedPrice: "$499-599",
      tier: "High-end",
      benchmarkScore: 20500,
      releaseYear: 2020,
      powerRequirement: "220W",
    },
    {
      name: "NVIDIA GeForce RTX 4060 Ti",
      description: "Latest generation mid-range GPU with improved ray tracing",
      performanceImprovement: "+50-80% FPS",
      estimatedPrice: "$399-449",
      tier: "Mid-range",
      benchmarkScore: 19000,
      releaseYear: 2023,
      powerRequirement: "160W",
    },
  ],
  "NVIDIA GeForce RTX 3060": [
    {
      name: "NVIDIA GeForce RTX 3080",
      description: "High-end GPU for 4K gaming and content creation",
      performanceImprovement: "+60-90% FPS",
      estimatedPrice: "$699-799",
      tier: "High-end",
      benchmarkScore: 26000,
      releaseYear: 2020,
      powerRequirement: "320W",
    },
    {
      name: "NVIDIA GeForce RTX 4070",
      description: "Latest generation high-performance GPU",
      performanceImprovement: "+40-70% FPS",
      estimatedPrice: "$599-649",
      tier: "High-end",
      benchmarkScore: 25000,
      releaseYear: 2023,
      powerRequirement: "200W",
    },
  ],
  "NVIDIA GeForce RTX 3070": [
    {
      name: "NVIDIA GeForce RTX 3080 Ti",
      description: "High-end GPU for 4K gaming with near-flagship performance",
      performanceImprovement: "+25-40% FPS",
      estimatedPrice: "$799-999",
      tier: "Enthusiast",
      benchmarkScore: 30000,
      releaseYear: 2021,
      powerRequirement: "350W",
    },
    {
      name: "NVIDIA GeForce RTX 4070 Ti",
      description: "Latest generation high-performance GPU",
      performanceImprovement: "+30-50% FPS",
      estimatedPrice: "$799-899",
      tier: "Enthusiast",
      benchmarkScore: 28000,
      releaseYear: 2023,
      powerRequirement: "285W",
    },
    {
      name: "NVIDIA GeForce RTX 4080",
      description: "Latest generation high-end GPU for 4K gaming",
      performanceImprovement: "+50-70% FPS",
      estimatedPrice: "$1,099-1,199",
      tier: "Enthusiast",
      benchmarkScore: 35000,
      releaseYear: 2022,
      powerRequirement: "320W",
    },
  ],
  "AMD Radeon RX 5": [
    {
      name: "AMD Radeon RX 6700 XT",
      description: "High-performance GPU for 1440p gaming",
      performanceImprovement: "+50-80% FPS",
      estimatedPrice: "$399-479",
      tier: "High-end",
      benchmarkScore: 19000,
      releaseYear: 2021,
      powerRequirement: "230W",
    },
    {
      name: "AMD Radeon RX 7700 XT",
      description: "Latest generation high-performance GPU",
      performanceImprovement: "+80-120% FPS",
      estimatedPrice: "$449-499",
      tier: "High-end",
      benchmarkScore: 24000,
      releaseYear: 2023,
      powerRequirement: "245W",
    },
  ],
  "AMD Radeon RX 6": [
    {
      name: "AMD Radeon RX 6800 XT",
      description: "High-end GPU for 4K gaming",
      performanceImprovement: "+30-50% FPS",
      estimatedPrice: "$599-699",
      tier: "High-end",
      benchmarkScore: 25000,
      releaseYear: 2020,
      powerRequirement: "300W",
    },
    {
      name: "AMD Radeon RX 7800 XT",
      description: "Latest generation high-performance GPU",
      performanceImprovement: "+40-60% FPS",
      estimatedPrice: "$499-599",
      tier: "High-end",
      benchmarkScore: 28000,
      releaseYear: 2023,
      powerRequirement: "263W",
    },
  ],
}

// Mock RAM upgrade suggestions
const ramUpgradeSuggestions: Record<string, SuggestedUpgrade[]> = {
  "8 GB": [
    {
      name: "16GB (2x8GB) DDR4-3200",
      description: "Dual-channel memory kit with good gaming performance",
      performanceImprovement: "+10-20% FPS, reduced stuttering",
      estimatedPrice: "$50-70",
      tier: "Mid-range",
      releaseYear: 2020,
    },
    {
      name: "32GB (2x16GB) DDR4-3600",
      description: "High-capacity, high-speed memory kit for gaming and multitasking",
      performanceImprovement: "+15-25% FPS, future-proof capacity",
      estimatedPrice: "$90-130",
      tier: "High-end",
      releaseYear: 2021,
    },
  ],
  "16 GB": [
    {
      name: "32GB (2x16GB) DDR4-3600",
      description: "High-capacity, high-speed memory kit for gaming and multitasking",
      performanceImprovement: "+5-10% FPS, improved multitasking",
      estimatedPrice: "$90-130",
      tier: "High-end",
      releaseYear: 2021,
    },
    {
      name: "32GB (2x16GB) DDR5-5600",
      description: "Next-gen memory with high bandwidth and capacity",
      performanceImprovement: "+10-15% FPS, future-proof",
      estimatedPrice: "$150-200",
      tier: "Enthusiast",
      compatibilityNotes: "Requires DDR5 compatible motherboard",
      releaseYear: 2022,
    },
  ],
}

// Mock storage upgrade suggestions
const storageUpgradeSuggestions: Record<string, SuggestedUpgrade[]> = {
  HDD: [
    {
      name: "1TB SATA SSD",
      description: "Basic SSD with dramatically improved load times over HDD",
      performanceImprovement: "5-10x faster load times, reduced stuttering",
      estimatedPrice: "$70-90",
      tier: "Mid-range",
      releaseYear: 2022,
    },
    {
      name: "1TB NVMe SSD",
      description: "High-speed NVMe SSD for fast game loads and system responsiveness",
      performanceImprovement: "10-20x faster load times, smoother gameplay",
      estimatedPrice: "$90-120",
      tier: "High-end",
      compatibilityNotes: "Requires motherboard with M.2 NVMe slot",
      releaseYear: 2022,
    },
  ],
  "SATA SSD": [
    {
      name: "1TB NVMe SSD",
      description: "High-speed NVMe SSD for fast game loads and system responsiveness",
      performanceImprovement: "2-3x faster load times",
      estimatedPrice: "$90-120",
      tier: "High-end",
      compatibilityNotes: "Requires motherboard with M.2 NVMe slot",
      releaseYear: 2022,
    },
    {
      name: "2TB NVMe SSD",
      description: "High-capacity, high-speed NVMe SSD",
      performanceImprovement: "2-3x faster load times, more storage for games",
      estimatedPrice: "$150-200",
      tier: "Enthusiast",
      compatibilityNotes: "Requires motherboard with M.2 NVMe slot",
      releaseYear: 2022,
    },
  ],
  "NVMe Gen3": [
    {
      name: "1TB NVMe Gen4 SSD",
      description: "Latest generation high-speed NVMe SSD",
      performanceImprovement: "1.5-2x faster load times",
      estimatedPrice: "$120-150",
      tier: "High-end",
      compatibilityNotes: "Requires motherboard with PCIe 4.0 support",
      releaseYear: 2022,
    },
  ],
}

// Function to analyze bottlenecks and provide upgrade recommendations
const analyzeBottlenecks = (
  performanceData: PerformanceData,
  hardwareInfo: HardwareInfo,
  gameSettings: GameSettings,
): BottleneckAnalysis => {
  // Calculate average metrics
  const avgFps = performanceData.fps.reduce((sum, point) => sum + point.value, 0) / performanceData.fps.length
  const avgCpuUsage =
    performanceData.cpuUsage.reduce((sum, point) => sum + point.value, 0) / performanceData.cpuUsage.length
  const avgGpuUsage =
    performanceData.gpuUsage.reduce((sum, point) => sum + point.value, 0) / performanceData.gpuUsage.length
  const avgRamUsage =
    performanceData.ramUsage.reduce((sum, point) => sum + point.value, 0) / performanceData.ramUsage.length
  const avgCpuTemp =
    performanceData.temperature.cpu.reduce((sum, point) => sum + point.value, 0) /
    performanceData.temperature.cpu.length
  const avgGpuTemp =
    performanceData.temperature.gpu.reduce((sum, point) => sum + point.value, 0) /
    performanceData.temperature.gpu.length

  // Initialize bottleneck analysis
  const analysis: BottleneckAnalysis = {
    primaryBottleneck: {
      component: "None",
      severity: "Low",
      description: "No significant bottlenecks detected.",
    },
    balanceScore: 90, // Default to a good balance
    upgradeRecommendations: [],
    overallAssessment: "Your system is well-balanced for this game.",
    performanceLimitingFactors: [],
  }

  // Detect CPU bottleneck
  if (avgCpuUsage > 90 && avgGpuUsage < 80) {
    analysis.primaryBottleneck = {
      component: "CPU",
      severity: avgCpuUsage > 95 ? "Critical" : avgCpuUsage > 90 ? "High" : "Medium",
      description:
        "Your CPU is running at high utilization while your GPU is not fully utilized, indicating a CPU bottleneck.",
    }
    analysis.balanceScore = Math.max(30, 100 - avgCpuUsage)
    analysis.performanceLimitingFactors.push("High CPU utilization")
    analysis.overallAssessment = "Your system is CPU-bottlenecked in this game."

    // Find CPU upgrade recommendations
    let cpuUpgrades: SuggestedUpgrade[] = []
    for (const cpuType in cpuUpgradeSuggestions) {
      if (hardwareInfo.cpu.name.includes(cpuType)) {
        cpuUpgrades = cpuUpgradeSuggestions[cpuType]
        break
      }
    }

    // If no specific match, provide generic recommendations
    if (cpuUpgrades.length === 0) {
      cpuUpgrades = [
        {
          name: "Newer generation CPU",
          description: "Consider upgrading to a newer generation CPU with better single-thread performance",
          performanceImprovement: "+15-30% FPS",
          estimatedPrice: "$300-500",
          tier: "High-end",
        },
      ]
    }

    analysis.upgradeRecommendations.push({
      componentType: "CPU",
      currentComponent: hardwareInfo.cpu.name,
      suggestedUpgrades: cpuUpgrades,
      bottleneckSeverity: analysis.primaryBottleneck.severity,
      bottleneckDescription:
        "Your CPU is limiting your gaming performance. Games with high CPU demands are particularly affected.",
      estimatedPerformanceGain: cpuUpgrades[0].performanceImprovement,
      estimatedCost: cpuUpgrades[0].estimatedPrice,
      priority:
        analysis.primaryBottleneck.severity === "Critical"
          ? 10
          : analysis.primaryBottleneck.severity === "High"
            ? 8
            : 6,
    })

    // Check if cooling might be an issue
    if (avgCpuTemp > 85) {
      analysis.upgradeRecommendations.push({
        componentType: "Cooling",
        currentComponent: "Current CPU Cooler",
        suggestedUpgrades: [
          {
            name: "High-performance CPU cooler",
            description: "Better cooling solution to prevent thermal throttling",
            performanceImprovement: "+5-15% sustained performance",
            estimatedPrice: "$50-100",
            tier: "Mid-range",
          },
        ],
        bottleneckSeverity: "Medium",
        bottleneckDescription: "Your CPU is running hot, which may cause thermal throttling and reduced performance.",
        estimatedPerformanceGain: "+5-15% sustained performance",
        estimatedCost: "$50-100",
        priority: 7,
      })
    }
  }

  // Detect GPU bottleneck
  if (avgGpuUsage > 90 && avgCpuUsage < 80) {
    const severity = avgGpuUsage > 95 ? "Critical" : avgGpuUsage > 90 ? "High" : "Medium"

    if (
      analysis.primaryBottleneck.component === "None" ||
      (severity === "Critical" && analysis.primaryBottleneck.severity !== "Critical") ||
      (severity === "High" && analysis.primaryBottleneck.severity === "Medium")
    ) {
      analysis.primaryBottleneck = {
        component: "GPU",
        severity,
        description: "Your GPU is running at maximum utilization, limiting your frame rate.",
      }
      analysis.balanceScore = Math.max(30, 100 - avgGpuUsage)
      analysis.performanceLimitingFactors.push("High GPU utilization")
      analysis.overallAssessment = "Your system is GPU-bottlenecked in this game."
    } else if (analysis.primaryBottleneck.component !== "GPU") {
      analysis.secondaryBottleneck = {
        component: "GPU",
        severity,
        description: "Your GPU is also running at high utilization, creating a secondary bottleneck.",
      }
    }

    // Find GPU upgrade recommendations
    let gpuUpgrades: SuggestedUpgrade[] = []
    for (const gpuType in gpuUpgradeSuggestions) {
      if (hardwareInfo.gpu.name.includes(gpuType)) {
        gpuUpgrades = gpuUpgradeSuggestions[gpuType]
        break
      }
    }

    // If no specific match, provide generic recommendations
    if (gpuUpgrades.length === 0) {
      gpuUpgrades = [
        {
          name: "Newer generation GPU",
          description: "Consider upgrading to a newer generation GPU with better performance",
          performanceImprovement: "+30-50% FPS",
          estimatedPrice: "$400-700",
          tier: "High-end",
        },
      ]
    }

    const gpuRecommendation: UpgradeRecommendation = {
      componentType: "GPU",
      currentComponent: hardwareInfo.gpu.name,
      suggestedUpgrades: gpuUpgrades,
      bottleneckSeverity: severity,
      bottleneckDescription:
        "Your GPU is limiting your gaming performance, especially at higher resolutions and quality settings.",
      estimatedPerformanceGain: gpuUpgrades[0].performanceImprovement,
      estimatedCost: gpuUpgrades[0].estimatedPrice,
      priority: severity === "Critical" ? 10 : severity === "High" ? 8 : 6,
    }

    // Add GPU recommendation with appropriate priority
    if (analysis.primaryBottleneck.component === "GPU") {
      analysis.upgradeRecommendations.unshift(gpuRecommendation) // Make it the first recommendation
    } else {
      analysis.upgradeRecommendations.push(gpuRecommendation)
    }

    // Check if cooling might be an issue
    if (avgGpuTemp > 85) {
      analysis.upgradeRecommendations.push({
        componentType: "Cooling",
        currentComponent: "Current GPU Cooling",
        suggestedUpgrades: [
          {
            name: "Improved case airflow",
            description: "Better case fans or configuration to improve GPU cooling",
            performanceImprovement: "+3-8% sustained performance",
            estimatedPrice: "$30-80",
            tier: "Mid-range",
          },
        ],
        bottleneckSeverity: "Medium",
        bottleneckDescription: "Your GPU is running hot, which may cause thermal throttling and reduced performance.",
        estimatedPerformanceGain: "+3-8% sustained performance",
        estimatedCost: "$30-80",
        priority: 5,
      })
    }
  }

  // Detect RAM bottleneck
  const ramGB = Number.parseInt(hardwareInfo.ram.total.split(" ")[0])
  if (avgRamUsage / ramGB > 0.85) {
    const severity = avgRamUsage / ramGB > 0.95 ? "High" : "Medium"

    if (analysis.primaryBottleneck.component === "None") {
      analysis.primaryBottleneck = {
        component: "RAM",
        severity,
        description:
          "Your system is using most of the available RAM, which can cause stuttering and performance issues.",
      }
      analysis.performanceLimitingFactors.push("High RAM utilization")
      analysis.overallAssessment = "Your system would benefit from more RAM for this game."
    } else {
      analysis.secondaryBottleneck = {
        component: "RAM",
        severity,
        description: "Your system is using most of the available RAM, creating a secondary bottleneck.",
      }
    }

    // Find RAM upgrade recommendations
    let ramUpgrades: SuggestedUpgrade[] = []
    for (const ramSize in ramUpgradeSuggestions) {
      if (hardwareInfo.ram.total.includes(ramSize)) {
        ramUpgrades = ramUpgradeSuggestions[ramSize]
        break
      }
    }

    // If no specific match, provide generic recommendations
    if (ramUpgrades.length === 0) {
      ramUpgrades = [
        {
          name: "32GB DDR4-3200 RAM",
          description: "Increased memory capacity for better multitasking and future-proofing",
          performanceImprovement: "+5-15% FPS, reduced stuttering",
          estimatedPrice: "$90-130",
          tier: "High-end",
        },
      ]
    }

    analysis.upgradeRecommendations.push({
      componentType: "RAM",
      currentComponent: hardwareInfo.ram.total,
      suggestedUpgrades: ramUpgrades,
      bottleneckSeverity: severity,
      bottleneckDescription:
        "Your system is using most of the available RAM, which can cause stuttering and performance issues.",
      estimatedPerformanceGain: ramUpgrades[0].performanceImprovement,
      estimatedCost: ramUpgrades[0].estimatedPrice,
      priority: severity === "High" ? 7 : 5,
    })
  }

  // Detect storage bottleneck
  if (
    hardwareInfo.storage.type === "HDD" ||
    (hardwareInfo.storage.type === "SATA SSD" && performanceData.loadTime > 20)
  ) {
    const severity = hardwareInfo.storage.type === "HDD" ? "High" : "Medium"

    if (analysis.primaryBottleneck.component === "None") {
      analysis.primaryBottleneck = {
        component: "Storage",
        severity,
        description: "Your storage device is limiting load times and may cause stuttering during gameplay.",
      }
      analysis.performanceLimitingFactors.push("Slow storage")
      analysis.overallAssessment = "Your system would benefit from faster storage for this game."
    } else {
      analysis.secondaryBottleneck = {
        component: "Storage",
        severity,
        description: "Your storage device is creating a secondary bottleneck, affecting load times.",
      }
    }

    // Find storage upgrade recommendations
    let storageUpgrades: SuggestedUpgrade[] = []
    for (const storageType in storageUpgradeSuggestions) {
      if (hardwareInfo.storage.type.includes(storageType)) {
        storageUpgrades = storageUpgradeSuggestions[storageType]
        break
      }
    }

    // If no specific match, provide generic recommendations
    if (storageUpgrades.length === 0) {
      storageUpgrades = [
        {
          name: "1TB NVMe SSD",
          description: "High-speed NVMe SSD for fast game loads and system responsiveness",
          performanceImprovement: "5-10x faster load times, reduced stuttering",
          estimatedPrice: "$90-120",
          tier: "High-end",
          compatibilityNotes: "Requires motherboard with M.2 NVMe slot",
        },
      ]
    }

    analysis.upgradeRecommendations.push({
      componentType: "Storage",
      currentComponent: `${hardwareInfo.storage.type} (${hardwareInfo.storage.model})`,
      suggestedUpgrades: storageUpgrades,
      bottleneckSeverity: severity,
      bottleneckDescription: "Your storage device is limiting load times and may cause stuttering during gameplay.",
      estimatedPerformanceGain: storageUpgrades[0].performanceImprovement,
      estimatedCost: storageUpgrades[0].estimatedPrice,
      priority: severity === "High" ? 6 : 4,
    })
  }

  // Calculate overall balance score based on component utilization differences
  if (analysis.primaryBottleneck.component !== "None") {
    // Adjust balance score based on the difference between CPU and GPU utilization
    const utilizationDifference = Math.abs(avgCpuUsage - avgGpuUsage)
    analysis.balanceScore = Math.max(30, 100 - utilizationDifference)

    // Further reduce score if there are multiple bottlenecks
    if (analysis.secondaryBottleneck) {
      analysis.balanceScore = Math.max(20, analysis.balanceScore - 15)
    }

    // Update overall assessment
    if (analysis.balanceScore < 50) {
      analysis.overallAssessment = "Your system has significant hardware imbalances that are limiting performance."
    } else if (analysis.balanceScore < 70) {
      analysis.overallAssessment = "Your system has some hardware imbalances that are affecting performance."
    } else {
      analysis.overallAssessment = "Your system has minor hardware imbalances but performs reasonably well."
    }
  }

  // Sort upgrade recommendations by priority
  analysis.upgradeRecommendations.sort((a, b) => b.priority - a.priority)

  return analysis
}

export function usePerformance(gameId: string) {
  const [isMonitoring, setIsMonitoring] = useState(false)
  const [performanceData, setPerformanceData] = useState<PerformanceData | null>(null)
  const [hardwareInfo, setHardwareInfo] = useState<HardwareInfo>(mockHardwareInfo)
  const [currentSettings, setCurrentSettings] = useState<GameSettings>(mockGameSettings)
  const [recommendations, setRecommendations] = useState<SettingsRecommendation[]>([])
  const [performanceIssues, setPerformanceIssues] = useState<PerformanceIssue[]>([])
  const [performanceProfiles, setPerformanceProfiles] = useState<PerformanceProfile[]>(
    mockPerformanceProfiles.filter((profile) => profile.gameId === gameId),
  )
  const [optimizationPresets, setOptimizationPresets] =
    useState<PerformanceOptimizationPreset[]>(mockOptimizationPresets)
  const [selectedPreset, setSelectedPreset] = useState<string | null>(null)
  const [isRecording, setIsRecording] = useState(false)
  const [recordingStartTime, setRecordingStartTime] = useState<number | null>(null)
  const [bottleneckAnalysis, setBottleneckAnalysis] = useState<BottleneckAnalysis | null>(null)

  // Start monitoring performance
  const startMonitoring = useCallback(() => {
    setIsMonitoring(true)
    // In a real app, this would start collecting actual performance metrics
    setPerformanceData(generateMockPerformanceData())
  }, [])

  // Stop monitoring performance
  const stopMonitoring = useCallback(() => {
    setIsMonitoring(false)
  }, [])

  // Start recording a performance profile
  const startRecording = useCallback(() => {
    setIsRecording(true)
    setRecordingStartTime(Date.now())
    // In a real app, this would start recording detailed performance metrics
  }, [])

  // Stop recording and save the performance profile
  const stopRecording = useCallback(() => {
    if (!recordingStartTime || !performanceData) return

    const duration = (Date.now() - recordingStartTime) / 1000 // Convert to seconds

    // Calculate metrics from the performance data
    const avgFps = performanceData.fps.reduce((sum, point) => sum + point.value, 0) / performanceData.fps.length
    const minFps = Math.min(...performanceData.fps.map((point) => point.value))
    const maxFps = Math.max(...performanceData.fps.map((point) => point.value))

    // Calculate 1% low FPS (average of the lowest 1% of FPS values)
    const sortedFps = [...performanceData.fps].sort((a, b) => a.value - b.value)
    const onePercentCount = Math.max(1, Math.floor(sortedFps.length * 0.01))
    const onePercentLowFps =
      sortedFps.slice(0, onePercentCount).reduce((sum, point) => sum + point.value, 0) / onePercentCount

    const avgCpuUsage =
      performanceData.cpuUsage.reduce((sum, point) => sum + point.value, 0) / performanceData.cpuUsage.length
    const avgGpuUsage =
      performanceData.gpuUsage.reduce((sum, point) => sum + point.value, 0) / performanceData.gpuUsage.length
    const avgRamUsage =
      performanceData.ramUsage.reduce((sum, point) => sum + point.value, 0) / performanceData.ramUsage.length
    const avgVramUsage =
      performanceData.vramUsage.reduce((sum, point) => sum + point.value, 0) / performanceData.vramUsage.length
    const avgCpuTemp =
      performanceData.temperature.cpu.reduce((sum, point) => sum + point.value, 0) /
      performanceData.temperature.cpu.length
    const avgGpuTemp =
      performanceData.temperature.gpu.reduce((sum, point) => sum + point.value, 0) /
      performanceData.temperature.gpu.length

    // Create a new performance profile
    const newProfile: PerformanceProfile = {
      id: `profile-${Date.now()}`,
      gameId,
      date: new Date().toISOString(),
      duration,
      averageFps: avgFps,
      minFps,
      maxFps,
      onePercentLowFps,
      averageCpuUsage: avgCpuUsage,
      averageGpuUsage: avgGpuUsage,
      averageRamUsage: avgRamUsage,
      averageVramUsage: avgVramUsage,
      averageTemperature: {
        cpu: avgCpuTemp,
        gpu: avgGpuTemp,
      },
      settings: currentSettings,
      issues: performanceIssues,
      recommendations,
    }

    // Add the new profile to the list
    setPerformanceProfiles((prev) => [...prev, newProfile])

    // Reset recording state
    setIsRecording(false)
    setRecordingStartTime(null)
  }, [recordingStartTime, performanceData, gameId, currentSettings, performanceIssues, recommendations])

  // Apply an optimization preset
  const applyPreset = useCallback(
    (presetId: string) => {
      const preset = optimizationPresets.find((p) => p.id === presetId)
      if (!preset) return

      setSelectedPreset(presetId)

      // Apply the preset settings to the current settings
      setCurrentSettings((prev) => ({
        ...prev,
        ...preset.settings,
      }))

      // In a real app, this would actually apply the settings to the game
    },
    [optimizationPresets],
  )

  // Apply a specific recommendation
  const applyRecommendation = useCallback((recommendation: SettingsRecommendation) => {
    setCurrentSettings((prev) => ({
      ...prev,
      [recommendation.setting]: recommendation.recommendedValue,
    }))

    // Remove the applied recommendation from the list
    setRecommendations((prev) =>
      prev.filter(
        (rec) => rec.setting !== recommendation.setting || rec.recommendedValue !== recommendation.recommendedValue,
      ),
    )

    // In a real app, this would actually apply the setting to the game
  }, [])

  // Apply all recommendations
  const applyAllRecommendations = useCallback(() => {
    const updatedSettings = { ...currentSettings }

    recommendations.forEach((rec) => {
      updatedSettings[rec.setting] = rec.recommendedValue
    })

    setCurrentSettings(updatedSettings)
    setRecommendations([])

    // In a real app, this would actually apply all settings to the game
  }, [recommendations, currentSettings])

  // Update hardware info
  useEffect(() => {
    // In a real app, this would detect the actual hardware
    setHardwareInfo(mockHardwareInfo)
  }, [])

  // Generate recommendations based on hardware and current settings
  useEffect(() => {
    const newRecommendations = generateSettingsRecommendations(hardwareInfo, currentSettings)
    setRecommendations(newRecommendations)
  }, [hardwareInfo, currentSettings])

  // Update performance data periodically when monitoring
  useEffect(() => {
    if (!isMonitoring) return

    const interval = setInterval(() => {
      // In a real app, this would get actual performance metrics
      setPerformanceData(generateMockPerformanceData())
    }, 5000) // Update every 5 seconds

    return () => clearInterval(interval)
  }, [isMonitoring])

  // Detect performance issues when performance data changes
  useEffect(() => {
    if (!performanceData) return

    const issues = detectPerformanceIssues(performanceData, hardwareInfo)
    setPerformanceIssues(issues)
  }, [performanceData, hardwareInfo])

  // Update bottleneck analysis when performance data changes
  useEffect(() => {
    if (!performanceData || !hardwareInfo) return

    const analysis = analyzeBottlenecks(performanceData, hardwareInfo, currentSettings)
    setBottleneckAnalysis(analysis)
  }, [performanceData, hardwareInfo, currentSettings])

  return {
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
  }
}
