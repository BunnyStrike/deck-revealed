export interface PerformanceMetric {
  timestamp: number
  value: number
}

export interface PerformanceData {
  fps: PerformanceMetric[]
  cpuUsage: PerformanceMetric[]
  gpuUsage: PerformanceMetric[]
  ramUsage: PerformanceMetric[]
  vramUsage: PerformanceMetric[]
  temperature: {
    cpu: PerformanceMetric[]
    gpu: PerformanceMetric[]
  }
  frameTime: PerformanceMetric[]
  loadTime: number
  networkLatency?: PerformanceMetric[]
}

export interface HardwareInfo {
  cpu: {
    name: string
    cores: number
    threads: number
    baseSpeed: string
    maxSpeed?: string
    architecture: string
    socket?: string
    manufacturer?: "Intel" | "AMD" | "Other"
    tdp?: number
  }
  gpu: {
    name: string
    vram: string
    driver: string
    architecture?: string
    manufacturer?: "NVIDIA" | "AMD" | "Intel" | "Other"
    tdp?: number
    length?: number // in mm
    pciSlots?: number
    powerConnectors?: string
  }
  ram: {
    total: string
    speed: string
    type: string
    slots?: number
    slotsUsed?: number
    channels?: number
  }
  storage: {
    type: "SSD" | "HDD" | "NVMe"
    model: string
    size: string
    freeSpace: string
    interface?: "SATA" | "PCIe" | "M.2 SATA" | "M.2 NVMe"
  }
  motherboard?: {
    manufacturer: string
    model: string
    chipset?: string
    socket?: string
    formFactor?: "ATX" | "Micro ATX" | "Mini ITX" | "E-ATX" | "Other"
    ramSlots?: number
    ramType?: string
    maxRamSpeed?: string
    pciSlots?: {
      pcie16?: number
      pcie8?: number
      pcie4?: number
      pcie1?: number
    }
    m2Slots?: number
    sataConnectors?: number
    usbPorts?: {
      usb2?: number
      usb3?: number
      usb31Gen1?: number
      usb31Gen2?: number
      usbC?: number
    }
    bios?: {
      version: string
      date: string
    }
  }
  psu?: {
    model?: string
    wattage: number
    certification?: "80+ Bronze" | "80+ Silver" | "80+ Gold" | "80+ Platinum" | "80+ Titanium" | "None"
    modular?: "Full" | "Semi" | "Non"
    connectors?: {
      cpu: string[] // e.g., "8-pin", "4+4-pin"
      gpu: string[] // e.g., "6+2-pin", "8-pin"
      sata: number
      molex: number
    }
  }
  cooling?: {
    cpu: {
      type: "Air" | "AIO" | "Custom Loop" | "Stock"
      model?: string
      fans?: number
      radiatorSize?: number // in mm
    }
    case: {
      fans: number
      intakeFans?: number
      exhaustFans?: number
      fanSizes?: number[] // in mm
    }
  }
  case?: {
    model?: string
    formFactor: "ATX" | "Micro ATX" | "Mini ITX" | "E-ATX" | "Other"
    maxGpuLength?: number // in mm
    maxCpuCoolerHeight?: number // in mm
    maxRadiatorSize?: number // in mm
    driveBays?: {
      internal35?: number
      internal25?: number
      external525?: number
    }
  }
  os: {
    name: string
    version: string
    build?: string
  }
  network: {
    type: string
    speed: string
    latency: string
  }
}

export interface GameSettings {
  resolution: string
  displayMode: "Fullscreen" | "Borderless" | "Windowed"
  vsync: boolean
  frameRateLimit?: number
  graphicsPreset?: "Low" | "Medium" | "High" | "Ultra" | "Custom"
  antialiasing?: "Off" | "FXAA" | "TAA" | "MSAA 2x" | "MSAA 4x" | "MSAA 8x" | "SMAA" | "DLSS" | "FSR"
  textureQuality: "Low" | "Medium" | "High" | "Ultra"
  shadowQuality: "Low" | "Medium" | "High" | "Ultra"
  lightingQuality: "Low" | "Medium" | "High" | "Ultra"
  effectsQuality: "Low" | "Medium" | "High" | "Ultra"
  postProcessing: "Low" | "Medium" | "High" | "Ultra"
  viewDistance: "Low" | "Medium" | "High" | "Ultra"
  foliageQuality?: "Low" | "Medium" | "High" | "Ultra"
  ambientOcclusion?: "Off" | "SSAO" | "HBAO" | "HBAO+" | "RTAO"
  rayTracing?: boolean
  dlss?: "Off" | "Ultra Performance" | "Performance" | "Balanced" | "Quality"
  fsr?: "Off" | "Ultra Performance" | "Performance" | "Balanced" | "Quality"
  motionBlur: boolean
  depthOfField: boolean
  bloomEffect?: boolean
  chromaticAberration?: boolean
  filmGrain?: boolean
  volumetricFog?: boolean
  volumetricClouds?: boolean
  screenSpaceReflections?: boolean
  subsurfaceScattering?: boolean
  anisotropicFiltering?: "Off" | "2x" | "4x" | "8x" | "16x"
  tessellation?: boolean
  hdr?: boolean
}

export interface SettingsRecommendation {
  setting: keyof GameSettings
  currentValue: any
  recommendedValue: any
  performanceImpact: "Low" | "Medium" | "High" | "Critical"
  visualImpact: "Low" | "Medium" | "High"
  description: string
}

export interface PerformanceIssue {
  type:
    | "CPU Bottleneck"
    | "GPU Bottleneck"
    | "RAM Bottleneck"
    | "Thermal Throttling"
    | "Driver Issue"
    | "Storage Bottleneck"
    | "Network Issue"
    | "Other"
  severity: "Low" | "Medium" | "High" | "Critical"
  description: string
  recommendation: string
}

export interface PerformanceProfile {
  id: string
  gameId: string
  date: string
  duration: number
  averageFps: number
  minFps: number
  maxFps: number
  onePercentLowFps: number
  averageCpuUsage: number
  averageGpuUsage: number
  averageRamUsage: number
  averageVramUsage: number
  averageTemperature: {
    cpu: number
    gpu: number
  }
  settings: GameSettings
  issues: PerformanceIssue[]
  recommendations: SettingsRecommendation[]
}

export interface PerformanceOptimizationPreset {
  id: string
  name: string
  description: string
  settings: Partial<GameSettings>
  targetHardware?: {
    minCpu?: string
    recommendedCpu?: string
    minGpu?: string
    recommendedGpu?: string
    minRam?: string
    recommendedRam?: string
  }
  performanceImpact: {
    fps: string
    quality: "Low" | "Medium" | "High" | "Ultra"
  }
}

export interface UpgradeRecommendation {
  componentType: "CPU" | "GPU" | "RAM" | "Storage" | "Cooling" | "PSU" | "Motherboard"
  currentComponent: string
  suggestedUpgrades: SuggestedUpgrade[]
  bottleneckSeverity: "Low" | "Medium" | "High" | "Critical"
  bottleneckDescription: string
  estimatedPerformanceGain: string
  estimatedCost: string
  compatibilityNotes?: string
  priority: number // 1-10, higher is more important
}

export interface SuggestedUpgrade {
  name: string
  description: string
  performanceImprovement: string // e.g., "+15-25% FPS"
  estimatedPrice: string
  tier: "Budget" | "Mid-range" | "High-end" | "Enthusiast"
  compatibilityNotes?: string
  benchmarkScore?: number
  releaseYear?: number
  powerRequirement?: string
  specificDetails?: {
    [key: string]: any
  }
}

export interface BottleneckAnalysis {
  primaryBottleneck: {
    component: "CPU" | "GPU" | "RAM" | "Storage" | "None"
    severity: "Low" | "Medium" | "High" | "Critical"
    description: string
  }
  secondaryBottleneck?: {
    component: "CPU" | "GPU" | "RAM" | "Storage"
    severity: "Low" | "Medium" | "High"
    description: string
  }
  balanceScore: number // 0-100, higher is better balanced
  upgradeRecommendations: UpgradeRecommendation[]
  overallAssessment: string
  performanceLimitingFactors: string[]
}

export interface CompatibilityIssue {
  type:
    | "Socket Incompatibility"
    | "Chipset Incompatibility"
    | "RAM Type Incompatibility"
    | "Insufficient Power"
    | "Physical Size Constraint"
    | "Missing Connector"
    | "BIOS Update Required"
    | "Cooling Constraint"
    | "Driver Incompatibility"
    | "Other"
  component: string
  severity: "Warning" | "Critical"
  description: string
  solution?: string
}

export interface CompatibilityResult {
  isCompatible: boolean
  issues: CompatibilityIssue[]
  notes: string[]
  requiredAdditionalComponents?: {
    componentType: string
    description: string
    estimatedCost: string
  }[]
  recommendedAdditionalComponents?: {
    componentType: string
    description: string
    estimatedCost: string
    reason: string
  }[]
  totalEstimatedCost: string
}
