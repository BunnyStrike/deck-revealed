import type { HardwareInfo, CompatibilityResult, CompatibilityIssue, SuggestedUpgrade } from "@/types/performance"

// Function to extract CPU socket from name
function extractCpuSocket(cpuName: string): string | null {
  // Intel sockets
  if (cpuName.includes("LGA1700") || cpuName.includes("12th Gen") || cpuName.includes("13th Gen")) {
    return "LGA1700"
  }
  if (cpuName.includes("LGA1200") || cpuName.includes("10th Gen") || cpuName.includes("11th Gen")) {
    return "LGA1200"
  }
  if (
    cpuName.includes("LGA1151") ||
    cpuName.includes("6th Gen") ||
    cpuName.includes("7th Gen") ||
    cpuName.includes("8th Gen") ||
    cpuName.includes("9th Gen")
  ) {
    return "LGA1151"
  }

  // AMD sockets
  if (
    cpuName.includes("AM5") ||
    (cpuName.includes("Ryzen") && (cpuName.includes("7000") || cpuName.includes("8000")))
  ) {
    return "AM5"
  }
  if (
    cpuName.includes("AM4") ||
    (cpuName.includes("Ryzen") &&
      (cpuName.includes("1000") ||
        cpuName.includes("2000") ||
        cpuName.includes("3000") ||
        cpuName.includes("4000") ||
        cpuName.includes("5000")))
  ) {
    return "AM4"
  }

  return null
}

// Function to extract motherboard chipset compatibility
function checkChipsetCompatibility(motherboardChipset: string, cpuName: string): boolean {
  // Intel 12th/13th Gen with 600/700 series
  if (
    (cpuName.includes("12th Gen") || cpuName.includes("13th Gen")) &&
    (motherboardChipset.includes("Z690") ||
      motherboardChipset.includes("Z790") ||
      motherboardChipset.includes("B660") ||
      motherboardChipset.includes("B760") ||
      motherboardChipset.includes("H610") ||
      motherboardChipset.includes("H770"))
  ) {
    return true
  }

  // Intel 10th/11th Gen with 400/500 series
  if (
    (cpuName.includes("10th Gen") || cpuName.includes("11th Gen")) &&
    (motherboardChipset.includes("Z490") ||
      motherboardChipset.includes("Z590") ||
      motherboardChipset.includes("B460") ||
      motherboardChipset.includes("B560") ||
      motherboardChipset.includes("H410") ||
      motherboardChipset.includes("H510"))
  ) {
    return true
  }

  // AMD Ryzen 5000 series with 500 series or certain 400 series chipsets
  if (
    cpuName.includes("Ryzen") &&
    cpuName.includes("5000") &&
    (motherboardChipset.includes("X570") ||
      motherboardChipset.includes("B550") ||
      motherboardChipset.includes("X470") ||
      motherboardChipset.includes("B450"))
  ) {
    return true
  }

  // AMD Ryzen 7000 series with 600 series chipsets
  if (
    cpuName.includes("Ryzen") &&
    cpuName.includes("7000") &&
    (motherboardChipset.includes("X670") || motherboardChipset.includes("B650"))
  ) {
    return true
  }

  return false
}

// Function to estimate power consumption
function estimateTotalPower(
  hardware: HardwareInfo,
  upgradedComponent?: {
    type: "CPU" | "GPU"
    powerRequired: number
  },
): number {
  let basePower = 50 // Base system power

  // Estimate CPU power if not being upgraded
  if (!upgradedComponent || upgradedComponent.type !== "CPU") {
    if (hardware.cpu.tdp) {
      basePower += hardware.cpu.tdp
    } else {
      // Rough estimates based on CPU class
      if (hardware.cpu.name.includes("i9") || hardware.cpu.name.includes("Ryzen 9")) {
        basePower += 125
      } else if (hardware.cpu.name.includes("i7") || hardware.cpu.name.includes("Ryzen 7")) {
        basePower += 95
      } else if (hardware.cpu.name.includes("i5") || hardware.cpu.name.includes("Ryzen 5")) {
        basePower += 65
      } else {
        basePower += 45
      }
    }
  } else if (upgradedComponent.type === "CPU") {
    basePower += upgradedComponent.powerRequired
  }

  // Estimate GPU power if not being upgraded
  if (!upgradedComponent || upgradedComponent.type !== "GPU") {
    if (hardware.gpu.tdp) {
      basePower += hardware.gpu.tdp
    } else {
      // Rough estimates based on GPU class
      if (hardware.gpu.name.includes("RTX 40")) {
        if (hardware.gpu.name.includes("4090")) {
          basePower += 450
        } else if (hardware.gpu.name.includes("4080")) {
          basePower += 320
        } else if (hardware.gpu.name.includes("4070")) {
          basePower += 200
        } else if (hardware.gpu.name.includes("4060")) {
          basePower += 170
        }
      } else if (hardware.gpu.name.includes("RTX 30")) {
        if (hardware.gpu.name.includes("3090")) {
          basePower += 350
        } else if (hardware.gpu.name.includes("3080")) {
          basePower += 320
        } else if (hardware.gpu.name.includes("3070")) {
          basePower += 220
        } else if (hardware.gpu.name.includes("3060")) {
          basePower += 170
        }
      } else if (hardware.gpu.name.includes("RX 6")) {
        if (hardware.gpu.name.includes("6900") || hardware.gpu.name.includes("6950")) {
          basePower += 300
        } else if (hardware.gpu.name.includes("6800")) {
          basePower += 250
        } else if (hardware.gpu.name.includes("6700")) {
          basePower += 230
        } else if (hardware.gpu.name.includes("6600")) {
          basePower += 180
        }
      } else {
        basePower += 150 // Default estimate for other GPUs
      }
    }
  } else if (upgradedComponent.type === "GPU") {
    basePower += upgradedComponent.powerRequired
  }

  // Add memory, storage, and other components power
  basePower += 50

  // Add 20% headroom for power supply recommendation
  return Math.ceil(basePower * 1.2)
}

// Function to extract GPU power requirement
function extractGpuPowerRequirement(gpuName: string): number {
  // NVIDIA RTX 40 series
  if (gpuName.includes("RTX 4090")) return 450
  if (gpuName.includes("RTX 4080")) return 320
  if (gpuName.includes("RTX 4070 Ti")) return 285
  if (gpuName.includes("RTX 4070")) return 200
  if (gpuName.includes("RTX 4060 Ti")) return 160
  if (gpuName.includes("RTX 4060")) return 115

  // NVIDIA RTX 30 series
  if (gpuName.includes("RTX 3090 Ti")) return 450
  if (gpuName.includes("RTX 3090")) return 350
  if (gpuName.includes("RTX 3080 Ti")) return 350
  if (gpuName.includes("RTX 3080")) return 320
  if (gpuName.includes("RTX 3070 Ti")) return 290
  if (gpuName.includes("RTX 3070")) return 220
  if (gpuName.includes("RTX 3060 Ti")) return 200
  if (gpuName.includes("RTX 3060")) return 170

  // AMD RX 6000 series
  if (gpuName.includes("RX 6950 XT")) return 335
  if (gpuName.includes("RX 6900 XT")) return 300
  if (gpuName.includes("RX 6800 XT")) return 280
  if (gpuName.includes("RX 6800")) return 250
  if (gpuName.includes("RX 6750 XT")) return 250
  if (gpuName.includes("RX 6700 XT")) return 230
  if (gpuName.includes("RX 6650 XT")) return 180
  if (gpuName.includes("RX 6600 XT")) return 160
  if (gpuName.includes("RX 6600")) return 132

  // AMD RX 7000 series
  if (gpuName.includes("RX 7900 XTX")) return 355
  if (gpuName.includes("RX 7900 XT")) return 300
  if (gpuName.includes("RX 7800 XT")) return 263
  if (gpuName.includes("RX 7700 XT")) return 245
  if (gpuName.includes("RX 7600")) return 165

  return 150 // Default estimate
}

// Function to extract CPU power requirement
function extractCpuPowerRequirement(cpuName: string): number {
  // Intel 12th/13th Gen
  if (cpuName.includes("i9-13900K") || cpuName.includes("i9-12900K")) return 125 // Base, can go up to 250W
  if (cpuName.includes("i7-13700K") || cpuName.includes("i7-12700K")) return 125
  if (cpuName.includes("i5-13600K") || cpuName.includes("i5-12600K")) return 125
  if (cpuName.includes("i9-13900") || cpuName.includes("i9-12900")) return 65
  if (cpuName.includes("i7-13700") || cpuName.includes("i7-12700")) return 65
  if (cpuName.includes("i5-13600") || cpuName.includes("i5-12600")) return 65
  if (cpuName.includes("i5-13400") || cpuName.includes("i5-12400")) return 65
  if (cpuName.includes("i3-13100") || cpuName.includes("i3-12100")) return 60

  // AMD Ryzen 5000 series
  if (cpuName.includes("Ryzen 9 5950X")) return 105
  if (cpuName.includes("Ryzen 9 5900X")) return 105
  if (cpuName.includes("Ryzen 7 5800X3D")) return 105
  if (cpuName.includes("Ryzen 7 5800X")) return 105
  if (cpuName.includes("Ryzen 5 5600X")) return 65
  if (cpuName.includes("Ryzen 5 5600")) return 65

  // AMD Ryzen 7000 series
  if (cpuName.includes("Ryzen 9 7950X")) return 170
  if (cpuName.includes("Ryzen 9 7900X")) return 170
  if (cpuName.includes("Ryzen 7 7800X3D")) return 120
  if (cpuName.includes("Ryzen 7 7700X")) return 105
  if (cpuName.includes("Ryzen 5 7600X")) return 105
  if (cpuName.includes("Ryzen 5 7600")) return 65

  return 75 // Default estimate
}

// Function to check RAM compatibility
function checkRamCompatibility(motherboardRamType: string, ramType: string): boolean {
  if (
    (motherboardRamType.includes("DDR4") && ramType.includes("DDR4")) ||
    (motherboardRamType.includes("DDR5") && ramType.includes("DDR5"))
  ) {
    return true
  }
  return false
}

// Function to check GPU physical compatibility with case
function checkGpuCaseCompatibility(
  gpuLength: number,
  caseMaxGpuLength = 330, // Default assumption if not specified
): boolean {
  return gpuLength <= caseMaxGpuLength
}

// Function to check if power supply has the required connectors
function checkPsuConnectors(psuConnectors: { gpu: string[] }, requiredGpuConnectors: string[]): boolean {
  if (!psuConnectors || !psuConnectors.gpu || psuConnectors.gpu.length === 0) {
    return false
  }

  const availableConnectors = psuConnectors.gpu.slice()

  for (const required of requiredGpuConnectors) {
    // Check for exact match
    const exactMatchIndex = availableConnectors.findIndex((conn) => conn === required)
    if (exactMatchIndex >= 0) {
      availableConnectors.splice(exactMatchIndex, 1)
      continue
    }

    // Check for compatible connectors (e.g., 8-pin can work for 6-pin)
    if (required === "6-pin") {
      const compatIndex = availableConnectors.findIndex((conn) => conn === "8-pin" || conn === "6+2-pin")
      if (compatIndex >= 0) {
        availableConnectors.splice(compatIndex, 1)
        continue
      }
    }

    return false
  }

  return true
}

// Get GPU connector requirements
function getGpuConnectorRequirements(gpuName: string): string[] {
  // RTX 40 series
  if (gpuName.includes("RTX 4090")) return ["16-pin"]
  if (gpuName.includes("RTX 4080")) return ["16-pin"]
  if (gpuName.includes("RTX 4070 Ti")) return ["16-pin"]
  if (gpuName.includes("RTX 4070")) return ["8-pin"]
  if (gpuName.includes("RTX 4060 Ti")) return ["8-pin"]
  if (gpuName.includes("RTX 4060")) return ["8-pin"]

  // RTX 30 series
  if (gpuName.includes("RTX 3090")) return ["8-pin", "8-pin", "8-pin"]
  if (gpuName.includes("RTX 3080 Ti")) return ["8-pin", "8-pin", "8-pin"]
  if (gpuName.includes("RTX 3080")) return ["8-pin", "8-pin"]
  if (gpuName.includes("RTX 3070 Ti")) return ["8-pin", "8-pin"]
  if (gpuName.includes("RTX 3070")) return ["8-pin", "8-pin"]
  if (gpuName.includes("RTX 3060 Ti")) return ["8-pin"]
  if (gpuName.includes("RTX 3060")) return ["8-pin"]

  // AMD RX 6000 series
  if (gpuName.includes("RX 6900 XT")) return ["8-pin", "8-pin", "8-pin"]
  if (gpuName.includes("RX 6800 XT")) return ["8-pin", "8-pin"]
  if (gpuName.includes("RX 6800")) return ["8-pin", "8-pin"]
  if (gpuName.includes("RX 6700 XT")) return ["8-pin", "6-pin"]
  if (gpuName.includes("RX 6600 XT")) return ["8-pin"]
  if (gpuName.includes("RX 6600")) return ["8-pin"]

  // AMD RX 7000 series
  if (gpuName.includes("RX 7900 XTX")) return ["8-pin", "8-pin"]
  if (gpuName.includes("RX 7900 XT")) return ["8-pin", "8-pin"]
  if (gpuName.includes("RX 7800 XT")) return ["8-pin", "8-pin"]
  if (gpuName.includes("RX 7700 XT")) return ["8-pin", "8-pin"]
  if (gpuName.includes("RX 7600")) return ["8-pin"]

  return ["8-pin"] // Default assumption
}

// Function to check if a BIOS update would be required
function checkBiosUpdateRequired(motherboard: HardwareInfo["motherboard"], newCpuName: string): boolean {
  // If we don't have motherboard BIOS info, assume update might be needed
  if (!motherboard || !motherboard.bios) {
    return true
  }

  const biosDate = new Date(motherboard.bios.date)

  // Check for common cases where BIOS updates are needed

  // Ryzen 5000 series on 400 series chipsets
  if (
    newCpuName.includes("Ryzen") &&
    newCpuName.includes("5000") &&
    (motherboard.chipset?.includes("B450") || motherboard.chipset?.includes("X470")) &&
    biosDate < new Date("2020-11-01")
  ) {
    return true
  }

  // Intel 11th gen on 400 series chipsets
  if (newCpuName.includes("11th Gen") && motherboard.chipset?.includes("400") && biosDate < new Date("2021-03-01")) {
    return true
  }

  // Intel 13th gen on 600 series chipsets
  if (newCpuName.includes("13th Gen") && motherboard.chipset?.includes("600") && biosDate < new Date("2022-09-01")) {
    return true
  }

  return false
}

// Main function to check CPU compatibility
function checkCpuCompatibility(hardware: HardwareInfo, newCpu: SuggestedUpgrade): CompatibilityResult {
  const issues: CompatibilityIssue[] = []
  const notes: string[] = []
  const requiredComponents: { componentType: string; description: string; estimatedCost: string }[] = []
  const recommendedComponents: { componentType: string; description: string; estimatedCost: string; reason: string }[] =
    []

  // Extract current and new CPU details
  const currentCpuSocket = hardware.cpu.socket || extractCpuSocket(hardware.cpu.name)
  const newCpuSocket = extractCpuSocket(newCpu.name)

  // Check socket compatibility
  let socketCompatible = true
  if (currentCpuSocket && newCpuSocket && currentCpuSocket !== newCpuSocket) {
    socketCompatible = false
    issues.push({
      type: "Socket Incompatibility",
      component: "CPU",
      severity: "Critical",
      description: `The new CPU (${newCpu.name}) uses socket ${newCpuSocket}, but your motherboard has socket ${currentCpuSocket}.`,
      solution: "A new motherboard compatible with the CPU socket is required.",
    })
    requiredComponents.push({
      componentType: "Motherboard",
      description: `Motherboard with ${newCpuSocket} socket`,
      estimatedCost: "$120-300",
    })
  }

  // Check chipset compatibility if motherboard info is available
  if (socketCompatible && hardware.motherboard && hardware.motherboard.chipset) {
    const chipsetCompatible = checkChipsetCompatibility(hardware.motherboard.chipset, newCpu.name)

    if (!chipsetCompatible) {
      issues.push({
        type: "Chipset Incompatibility",
        component: "Motherboard",
        severity: "Critical",
        description: `The motherboard chipset (${hardware.motherboard.chipset}) may not be compatible with the new CPU (${newCpu.name}).`,
        solution: "A new motherboard with a compatible chipset is required, or a BIOS update may be needed.",
      })

      // Add note about potential BIOS update
      notes.push(
        `Some ${hardware.motherboard.chipset} motherboards may support this CPU with a BIOS update. Check with the motherboard manufacturer for compatibility.`,
      )
    }
  }

  // Check for power requirements
  const cpuPower = extractCpuPowerRequirement(newCpu.name)

  // Check if PSU has enough wattage
  if (hardware.psu) {
    const estimatedPower = estimateTotalPower(hardware, { type: "CPU", powerRequired: cpuPower })

    if (hardware.psu.wattage < estimatedPower) {
      issues.push({
        type: "Insufficient Power",
        component: "PSU",
        severity: "Critical",
        description: `Your power supply (${hardware.psu.wattage}W) may not provide enough power for the new CPU (estimated system power: ${estimatedPower}W).`,
        solution: "Consider upgrading to a higher wattage power supply.",
      })

      requiredComponents.push({
        componentType: "PSU",
        description: `${estimatedPower}W power supply`,
        estimatedCost: "$80-150",
      })
    } else if (hardware.psu.wattage < estimatedPower * 1.2) {
      // If PSU is adequate but cutting it close (less than 20% headroom)
      notes.push(
        `Your power supply is adequate but has limited headroom. Consider upgrading if you plan to add more components in the future.`,
      )
    }
  }

  // Check for cooling requirements
  if (hardware.cooling && hardware.cooling.cpu) {
    const currentCooling = hardware.cooling.cpu

    // High-end CPUs may need better cooling
    if (
      (newCpu.name.includes("i9") ||
        newCpu.name.includes("Ryzen 9") ||
        newCpu.name.includes("i7-13") ||
        newCpu.name.includes("Ryzen 7 7")) &&
      (currentCooling.type === "Stock" ||
        (currentCooling.type === "Air" &&
          !currentCooling.model?.includes("Noctua") &&
          !currentCooling.model?.includes("Dark Rock")))
    ) {
      issues.push({
        type: "Cooling Constraint",
        component: "CPU Cooler",
        severity: "Warning",
        description: `Your current CPU cooler may not be sufficient for the high TDP of ${newCpu.name}.`,
        solution: "Consider upgrading to a high-performance air cooler or AIO liquid cooler.",
      })

      recommendedComponents.push({
        componentType: "CPU Cooler",
        description: "High-performance CPU cooler",
        estimatedCost: "$70-150",
        reason: "Better thermal performance for high-TDP CPU",
      })
    }
  } else {
    // If no cooling info, add a note about potential cooling needs
    notes.push(`Ensure you have adequate cooling for the new CPU, especially if upgrading to a higher TDP model.`)
  }

  // Check if RAM is compatible if the motherboard needs to be changed
  if (!socketCompatible) {
    // If new CPU needs DDR5 but current system has DDR4
    if (
      (newCpu.name.includes("Ryzen 7000") || newCpu.name.includes("13th Gen")) &&
      hardware.ram.type.includes("DDR4")
    ) {
      issues.push({
        type: "RAM Type Incompatibility",
        component: "RAM",
        severity: "Critical",
        description: `The new CPU platform requires DDR5 memory, but your current system has ${hardware.ram.type}.`,
        solution: "You will need to upgrade your RAM along with the motherboard.",
      })

      requiredComponents.push({
        componentType: "RAM",
        description: "DDR5 memory kit",
        estimatedCost: "$120-250",
      })
    }
  }

  // Check if BIOS update would be required
  if (socketCompatible && hardware.motherboard) {
    const biosUpdateRequired = checkBiosUpdateRequired(hardware.motherboard, newCpu.name)

    if (biosUpdateRequired) {
      issues.push({
        type: "BIOS Update Required",
        component: "Motherboard",
        severity: "Warning",
        description: `Your motherboard may require a BIOS update to support ${newCpu.name}.`,
        solution: "Update your motherboard BIOS to the latest version before installing the new CPU.",
      })

      notes.push(
        `IMPORTANT: Update your motherboard BIOS to the latest version before installing the new CPU. You will need your current CPU to perform the update.`,
      )
    }
  }

  // Calculate total cost of upgrade (CPU + required components)
  const cpuCost = newCpu.estimatedPrice.split("-")[0].replace(/[^0-9]/g, "")
  let totalCost = Number.parseInt(cpuCost || "0", 10)

  requiredComponents.forEach((comp) => {
    const compCost = comp.estimatedCost.split("-")[0].replace(/[^0-9]/g, "")
    totalCost += Number.parseInt(compCost || "0", 10)
  })

  return {
    compatible: issues.filter((issue) => issue.severity === "Critical").length === 0,
    issues,
    notes,
    requiredComponents,
    recommendedComponents,
    totalEstimatedCost: `$${totalCost}-${totalCost + 200}`,
  }
}

// Function to check GPU compatibility
function checkGpuCompatibility(hardware: HardwareInfo, newGpu: SuggestedUpgrade): CompatibilityResult {
  const issues: CompatibilityIssue[] = []
  const notes: string[] = []
  const requiredComponents: { componentType: string; description: string; estimatedCost: string }[] = []
  const recommendedComponents: { componentType: string; description: string; estimatedCost: string; reason: string }[] =
    []

  // Check for power requirements
  const gpuPower = extractGpuPowerRequirement(newGpu.name)

  // Check if PSU has enough wattage
  if (hardware.psu) {
    const estimatedPower = estimateTotalPower(hardware, { type: "GPU", powerRequired: gpuPower })

    if (hardware.psu.wattage < estimatedPower) {
      issues.push({
        type: "Insufficient Power",
        component: "PSU",
        severity: "Critical",
        description: `Your power supply (${hardware.psu.wattage}W) may not provide enough power for the new GPU (estimated system power: ${estimatedPower}W).`,
        solution: "Consider upgrading to a higher wattage power supply.",
      })

      requiredComponents.push({
        componentType: "PSU",
        description: `${estimatedPower}W power supply`,
        estimatedCost: "$80-150",
      })
    } else if (hardware.psu.wattage < estimatedPower * 1.2) {
      // If PSU is adequate but cutting it close (less than 20% headroom)
      notes.push(
        `Your power supply is adequate but has limited headroom. Consider upgrading if you plan to add more components in the future.`,
      )
    }

    // Check for required power connectors
    const requiredConnectors = getGpuConnectorRequirements(newGpu.name)

    if (hardware.psu.connectors && !checkPsuConnectors(hardware.psu.connectors, requiredConnectors)) {
      issues.push({
        type: "Power Connector Incompatibility",
        component: "PSU",
        severity: "Critical",
        description: `Your power supply doesn't have the required ${requiredConnectors.join(", ")} power connector(s) for ${newGpu.name}.`,
        solution:
          "Upgrade to a power supply with the required connectors or use adapters (not recommended for high-end GPUs).",
      })

      requiredComponents.push({
        componentType: "PSU",
        description: `Power supply with ${requiredConnectors.join(", ")} connector(s)`,
        estimatedCost: "$80-150",
      })
    }
  }

  // Check for physical size constraints
  if (hardware.case && hardware.case.maxGpuLength && newGpu.physicalDimensions?.length) {
    if (newGpu.physicalDimensions.length > hardware.case.maxGpuLength) {
      issues.push({
        type: "Physical Size Constraint",
        component: "Case",
        severity: "Critical",
        description: `The new GPU (${newGpu.physicalDimensions.length}mm) is too long for your case (max GPU length: ${hardware.case.maxGpuLength}mm).`,
        solution: "Consider a smaller GPU model or upgrade to a larger case.",
      })

      requiredComponents.push({
        componentType: "Case",
        description: "Larger PC case",
        estimatedCost: "$70-150",
      })
    } else if (newGpu.physicalDimensions.length > hardware.case.maxGpuLength - 20) {
      // If GPU is close to the maximum length
      notes.push(
        `The new GPU will fit in your case, but clearance will be tight. Ensure there are no obstructions like drive cages or cables.`,
      )
    }
  }

  // Check for PCIe generation compatibility
  if (hardware.motherboard && hardware.motherboard.pciExpressVersion) {
    const motherboardPcie = Number.parseInt(hardware.motherboard.pciExpressVersion.charAt(0))
    let gpuPcie = 4 // Default assumption for modern GPUs

    // Try to extract PCIe version from GPU name or description
    if (newGpu.description) {
      if (newGpu.description.includes("PCIe 5.0") || newGpu.description.includes("PCIe 5")) {
        gpuPcie = 5
      } else if (newGpu.description.includes("PCIe 4.0") || newGpu.description.includes("PCIe 4")) {
        gpuPcie = 4
      } else if (newGpu.description.includes("PCIe 3.0") || newGpu.description.includes("PCIe 3")) {
        gpuPcie = 3
      }
    }

    if (motherboardPcie < gpuPcie) {
      notes.push(
        `Your motherboard has PCIe ${motherboardPcie}.0 while the GPU supports PCIe ${gpuPcie}.0. The GPU will work but may not reach its full performance potential.`,
      )
    }
  }

  // Check for CPU bottleneck
  // This is a simplified check - real bottleneck analysis would be more complex
  if (hardware.cpu) {
    let potentialBottleneck = false

    // Check for high-end GPU with older/lower-end CPU
    if (
      (newGpu.name.includes("RTX 4090") || newGpu.name.includes("RTX 4080") || newGpu.name.includes("RX 7900")) &&
      (hardware.cpu.name.includes("i3") ||
        hardware.cpu.name.includes("i5-10") ||
        hardware.cpu.name.includes("Ryzen 3") ||
        hardware.cpu.name.includes("Ryzen 5 3"))
    ) {
      potentialBottleneck = true
    }

    if (potentialBottleneck) {
      notes.push(
        `Your current CPU (${hardware.cpu.name}) may bottleneck the performance of ${newGpu.name}. Consider a CPU upgrade for optimal performance.`,
      )

      recommendedComponents.push({
        componentType: "CPU",
        description: "CPU upgrade",
        estimatedCost: "$200-400",
        reason: "Reduce potential bottlenecking with high-end GPU",
      })
    }
  }

  // Calculate total cost of upgrade (GPU + required components)
  const gpuCost = newGpu.estimatedPrice.split("-")[0].replace(/[^0-9]/g, "")
  let totalCost = Number.parseInt(gpuCost || "0", 10)

  requiredComponents.forEach((comp) => {
    const compCost = comp.estimatedCost.split("-")[0].replace(/[^0-9]/g, "")
    totalCost += Number.parseInt(compCost || "0", 10)
  })

  return {
    compatible: issues.filter((issue) => issue.severity === "Critical").length === 0,
    issues,
    notes,
    requiredComponents,
    recommendedComponents,
    totalEstimatedCost: `$${totalCost}-${totalCost + 200}`,
  }
}

// Function to check RAM compatibility
function checkRamCompatibilityFull(hardware: HardwareInfo, newRam: SuggestedUpgrade): CompatibilityResult {
  const issues: CompatibilityIssue[] = []
  const notes: string[] = []
  const requiredComponents: { componentType: string; description: string; estimatedCost: string }[] = []
  const recommendedComponents: { componentType: string; description: string; estimatedCost: string; reason: string }[] =
    []

  // Extract RAM type from name/description
  let ramType = "DDR4" // Default assumption
  if (newRam.name.includes("DDR5") || (newRam.description && newRam.description.includes("DDR5"))) {
    ramType = "DDR5"
  } else if (newRam.name.includes("DDR4") || (newRam.description && newRam.description.includes("DDR4"))) {
    ramType = "DDR4"
  } else if (newRam.name.includes("DDR3") || (newRam.description && newRam.description.includes("DDR3"))) {
    ramType = "DDR3"
  }

  // Check RAM type compatibility with motherboard
  if (hardware.motherboard && hardware.motherboard.memoryType) {
    if (!checkRamCompatibility(hardware.motherboard.memoryType, ramType)) {
      issues.push({
        type: "RAM Type Incompatibility",
        component: "Motherboard",
        severity: "Critical",
        description: `Your motherboard supports ${hardware.motherboard.memoryType} memory, but the new RAM is ${ramType}.`,
        solution:
          "You need to select RAM that matches your motherboard memory type, or upgrade your motherboard and CPU.",
      })
    }
  }

  // Check RAM speed compatibility
  if (hardware.motherboard && hardware.motherboard.supportedMemorySpeeds) {
    // Extract RAM speed from name/description
    let ramSpeed = 0
    const speedRegex = /(\d{3,4})MHz|(\d{3,4})MT\/s|DDR\d-(\d{3,4})/

    if (newRam.name) {
      const match = newRam.name.match(speedRegex)
      if (match) {
        ramSpeed = Number.parseInt(match[1] || match[2] || match[3], 10)
      }
    }

    if (ramSpeed > 0) {
      const supportedSpeeds = hardware.motherboard.supportedMemorySpeeds

      // Check if the exact speed is supported
      if (!supportedSpeeds.includes(ramSpeed)) {
        // Find the closest supported speed
        const closestSpeed = supportedSpeeds.reduce((prev, curr) =>
          Math.abs(curr - ramSpeed) < Math.abs(prev - ramSpeed) ? curr : prev,
        )

        notes.push(
          `Your motherboard doesn't officially support ${ramSpeed}MHz RAM. The RAM will likely run at ${closestSpeed}MHz instead.`,
        )
      }
    }
  }

  // Check RAM capacity limits
  if (hardware.motherboard && hardware.motherboard.maxMemory) {
    // Extract RAM capacity from name/description
    let ramCapacity = 0
    let modulesCount = 0

    // Try to extract from name
    const capacityRegex = /(\d+)GB|(\d+)x(\d+)GB/
    if (newRam.name) {
      const match = newRam.name.match(capacityRegex)
      if (match) {
        if (match[1]) {
          ramCapacity = Number.parseInt(match[1], 10)
          modulesCount = 1 // Assume single module if not specified
        } else if (match[2] && match[3]) {
          modulesCount = Number.parseInt(match[2], 10)
          const moduleSize = Number.parseInt(match[3], 10)
          ramCapacity = modulesCount * moduleSize
        }
      }
    }

    if (ramCapacity > 0 && ramCapacity > hardware.motherboard.maxMemory) {
      issues.push({
        type: "Memory Capacity Exceeded",
        component: "Motherboard",
        severity: "Warning",
        description: `The new RAM's total capacity (${ramCapacity}GB) exceeds your motherboard's maximum supported memory (${hardware.motherboard.maxMemory}GB).`,
        solution: "Choose RAM with a lower total capacity or upgrade your motherboard.",
      })
    }

    // Check number of RAM slots
    if (hardware.motherboard.memorySlots && modulesCount > hardware.motherboard.memorySlots) {
      issues.push({
        type: "Insufficient Memory Slots",
        component: "Motherboard",
        severity: "Critical",
        description: `The new RAM kit has ${modulesCount} modules, but your motherboard only has ${hardware.motherboard.memorySlots} memory slots.`,
        solution: "Choose a RAM kit with fewer modules or upgrade your motherboard.",
      })
    }
  }

  // Calculate total cost of upgrade (RAM + required components)
  const ramCost = newRam.estimatedPrice.split("-")[0].replace(/[^0-9]/g, "")
  let totalCost = Number.parseInt(ramCost || "0", 10)

  requiredComponents.forEach((comp) => {
    const compCost = comp.estimatedCost.split("-")[0].replace(/[^0-9]/g, "")
    totalCost += Number.parseInt(compCost || "0", 10)
  })

  return {
    compatible: issues.filter((issue) => issue.severity === "Critical").length === 0,
    issues,
    notes,
    requiredComponents,
    recommendedComponents,
    totalEstimatedCost: `$${totalCost}-${totalCost + 100}`,
  }
}

// Function to check storage compatibility
function checkStorageCompatibility(hardware: HardwareInfo, newStorage: SuggestedUpgrade): CompatibilityResult {
  const issues: CompatibilityIssue[] = []
  const notes: string[] = []
  const requiredComponents: { componentType: string; description: string; estimatedCost: string }[] = []
  const recommendedComponents: { componentType: string; description: string; estimatedCost: string; reason: string }[] =
    []

  // Determine storage type
  let storageType = "SATA"
  if (newStorage.name.includes("NVMe") || (newStorage.description && newStorage.description.includes("NVMe"))) {
    storageType = "NVMe"
  } else if (newStorage.name.includes("M.2") || (newStorage.description && newStorage.description.includes("M.2"))) {
    storageType = "M.2"
  }

  // Check motherboard compatibility
  if (hardware.motherboard) {
    if (storageType === "NVMe" && (!hardware.motherboard.nvmeSupport || hardware.motherboard.nvmeSlots === 0)) {
      issues.push({
        type: "Interface Incompatibility",
        component: "Motherboard",
        severity: "Critical",
        description: `Your motherboard doesn't support NVMe storage.`,
        solution: "Choose a SATA SSD instead, or upgrade your motherboard.",
      })

      recommendedComponents.push({
        componentType: "Storage",
        description: "SATA SSD (alternative)",
        estimatedCost: "$70-150",
        reason: "Compatible with your current motherboard",
      })
    } else if (storageType === "M.2" && (!hardware.motherboard.m2Support || hardware.motherboard.m2Slots === 0)) {
      issues.push({
        type: "Interface Incompatibility",
        component: "Motherboard",
        severity: "Critical",
        description: `Your motherboard doesn't support M.2 storage.`,
        solution: "Choose a SATA SSD instead, or upgrade your motherboard.",
      })

      recommendedComponents.push({
        componentType: "Storage",
        description: "SATA SSD (alternative)",
        estimatedCost: "$70-150",
        reason: "Compatible with your current motherboard",
      })
    }

    // Check if all slots are already occupied
    if (
      storageType === "NVMe" &&
      hardware.motherboard.nvmeSlots !== undefined &&
      hardware.motherboard.nvmeSlots <= hardware.storage.filter((s) => s.type === "NVMe").length
    ) {
      issues.push({
        type: "No Available Slots",
        component: "Motherboard",
        severity: "Warning",
        description: `All NVMe slots on your motherboard are already occupied.`,
        solution: "Remove an existing NVMe drive, use a PCIe adapter card, or choose a different storage type.",
      })

      recommendedComponents.push({
        componentType: "Adapter",
        description: "PCIe to NVMe adapter card",
        estimatedCost: "$20-40",
        reason: "Allow NVMe installation without removing existing drives",
      })
    } else if (
      storageType === "M.2" &&
      hardware.motherboard.m2Slots !== undefined &&
      hardware.motherboard.m2Slots <= hardware.storage.filter((s) => s.type === "M.2").length
    ) {
      issues.push({
        type: "No Available Slots",
        component: "Motherboard",
        severity: "Warning",
        description: `All M.2 slots on your motherboard are already occupied.`,
        solution: "Remove an existing M.2 drive or choose a different storage type.",
      })
    }
  }

  // Check for PCIe generation compatibility for NVMe drives
  if (storageType === "NVMe" && hardware.motherboard && hardware.motherboard.pciExpressVersion) {
    const motherboardPcie = Number.parseInt(hardware.motherboard.pciExpressVersion.charAt(0))
    let storagePcie = 3 // Default assumption for modern NVMe drives

    // Try to extract PCIe version from storage name or description
    if (newStorage.description) {
      if (newStorage.description.includes("PCIe 5.0") || newStorage.description.includes("PCIe 5")) {
        storagePcie = 5
      } else if (newStorage.description.includes("PCIe 4.0") || newStorage.description.includes("PCIe 4")) {
        storagePcie = 4
      } else if (newStorage.description.includes("PCIe 3.0") || newStorage.description.includes("PCIe 3")) {
        storagePcie = 3
      }
    }

    if (motherboardPcie < storagePcie) {
      notes.push(
        `Your motherboard has PCIe ${motherboardPcie}.0 while the storage drive supports PCIe ${storagePcie}.0. The drive will work but may not reach its full speed.`,
      )
    }
  }

  // Calculate total cost of upgrade (Storage + required components)
  const storageCost = newStorage.estimatedPrice.split("-")[0].replace(/[^0-9]/g, "")
  let totalCost = Number.parseInt(storageCost || "0", 10)

  requiredComponents.forEach((comp) => {
    const compCost = comp.estimatedCost.split("-")[0].replace(/[^0-9]/g, "")
    totalCost += Number.parseInt(compCost || "0", 10)
  })

  return {
    compatible: issues.filter((issue) => issue.severity === "Critical").length === 0,
    issues,
    notes,
    requiredComponents,
    recommendedComponents,
    totalEstimatedCost: `$${totalCost}-${totalCost + 50}`,
  }
}

// Main function to check component compatibility
export function checkComponentCompatibility(
  hardware: HardwareInfo,
  componentType: "CPU" | "GPU" | "RAM" | "Storage" | "Cooling" | "PSU" | "Motherboard",
  suggestedUpgrade: SuggestedUpgrade,
): CompatibilityResult {
  switch (componentType) {
    case "CPU":
      return checkCpuCompatibility(hardware, suggestedUpgrade)
    case "GPU":
      return checkGpuCompatibility(hardware, suggestedUpgrade)
    case "RAM":
      return checkRamCompatibilityFull(hardware, suggestedUpgrade)
    case "Storage":
      return checkStorageCompatibility(hardware, suggestedUpgrade)
    case "Cooling":
    case "PSU":
    case "Motherboard":
      // Simplified compatibility check for other components
      return {
        compatible: true,
        issues: [],
        notes: ["Detailed compatibility analysis not available for this component type."],
        requiredComponents: [],
        recommendedComponents: [],
        totalEstimatedCost: suggestedUpgrade.estimatedPrice,
      }
  }
}
