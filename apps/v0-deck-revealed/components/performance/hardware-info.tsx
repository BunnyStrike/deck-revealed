"use client"

import { Card } from "@/components/ui/card"
import { Cpu, HardDrive, MemoryStickIcon as Memory, Server, Monitor, Network, Info } from "lucide-react"
import type { HardwareInfo } from "@/types/performance"

interface HardwareInfoProps {
  hardwareInfo: HardwareInfo
}

export function HardwareInfoDisplay({ hardwareInfo }: HardwareInfoProps) {
  return (
    <div className="space-y-6">
      <h2 className="text-xl font-semibold">System Information</h2>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* CPU */}
        <Card className="bg-card border-border p-6 rounded-xl">
          <h3 className="text-lg font-semibold mb-4 flex items-center">
            <Cpu className="mr-2" size={20} />
            Processor
          </h3>

          <div className="space-y-3">
            <div className="flex justify-between">
              <span className="text-muted-foreground">Model</span>
              <span className="font-medium">{hardwareInfo.cpu.name}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Cores / Threads</span>
              <span className="font-medium">
                {hardwareInfo.cpu.cores} / {hardwareInfo.cpu.threads}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Base Speed</span>
              <span className="font-medium">{hardwareInfo.cpu.baseSpeed}</span>
            </div>
            {hardwareInfo.cpu.maxSpeed && (
              <div className="flex justify-between">
                <span className="text-muted-foreground">Max Boost</span>
                <span className="font-medium">{hardwareInfo.cpu.maxSpeed}</span>
              </div>
            )}
            <div className="flex justify-between">
              <span className="text-muted-foreground">Architecture</span>
              <span className="font-medium">{hardwareInfo.cpu.architecture}</span>
            </div>
          </div>
        </Card>

        {/* GPU */}
        <Card className="bg-card border-border p-6 rounded-xl">
          <h3 className="text-lg font-semibold mb-4 flex items-center">
            <Monitor className="mr-2" size={20} />
            Graphics
          </h3>

          <div className="space-y-3">
            <div className="flex justify-between">
              <span className="text-muted-foreground">Model</span>
              <span className="font-medium">{hardwareInfo.gpu.name}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">VRAM</span>
              <span className="font-medium">{hardwareInfo.gpu.vram}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Driver Version</span>
              <span className="font-medium">{hardwareInfo.gpu.driver}</span>
            </div>
            {hardwareInfo.gpu.architecture && (
              <div className="flex justify-between">
                <span className="text-muted-foreground">Architecture</span>
                <span className="font-medium">{hardwareInfo.gpu.architecture}</span>
              </div>
            )}
          </div>
        </Card>

        {/* RAM */}
        <Card className="bg-card border-border p-6 rounded-xl">
          <h3 className="text-lg font-semibold mb-4 flex items-center">
            <Memory className="mr-2" size={20} />
            Memory
          </h3>

          <div className="space-y-3">
            <div className="flex justify-between">
              <span className="text-muted-foreground">Total RAM</span>
              <span className="font-medium">{hardwareInfo.ram.total}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Speed</span>
              <span className="font-medium">{hardwareInfo.ram.speed}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Type</span>
              <span className="font-medium">{hardwareInfo.ram.type}</span>
            </div>
          </div>
        </Card>

        {/* Storage */}
        <Card className="bg-card border-border p-6 rounded-xl">
          <h3 className="text-lg font-semibold mb-4 flex items-center">
            <HardDrive className="mr-2" size={20} />
            Storage
          </h3>

          <div className="space-y-3">
            <div className="flex justify-between">
              <span className="text-muted-foreground">Type</span>
              <span className="font-medium">{hardwareInfo.storage.type}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Model</span>
              <span className="font-medium">{hardwareInfo.storage.model}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Capacity</span>
              <span className="font-medium">{hardwareInfo.storage.size}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Free Space</span>
              <span className="font-medium">{hardwareInfo.storage.freeSpace}</span>
            </div>
          </div>
        </Card>

        {/* Motherboard */}
        {hardwareInfo.motherboard && (
          <Card className="bg-card border-border p-6 rounded-xl">
            <h3 className="text-lg font-semibold mb-4 flex items-center">
              <Server className="mr-2" size={20} />
              Motherboard
            </h3>

            <div className="space-y-3">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Manufacturer</span>
                <span className="font-medium">{hardwareInfo.motherboard.manufacturer}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Model</span>
                <span className="font-medium">{hardwareInfo.motherboard.model}</span>
              </div>
              {hardwareInfo.motherboard.chipset && (
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Chipset</span>
                  <span className="font-medium">{hardwareInfo.motherboard.chipset}</span>
                </div>
              )}
            </div>
          </Card>
        )}

        {/* OS */}
        <Card className="bg-card border-border p-6 rounded-xl">
          <h3 className="text-lg font-semibold mb-4 flex items-center">
            <Info className="mr-2" size={20} />
            Operating System
          </h3>

          <div className="space-y-3">
            <div className="flex justify-between">
              <span className="text-muted-foreground">OS</span>
              <span className="font-medium">{hardwareInfo.os.name}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Version</span>
              <span className="font-medium">{hardwareInfo.os.version}</span>
            </div>
            {hardwareInfo.os.build && (
              <div className="flex justify-between">
                <span className="text-muted-foreground">Build</span>
                <span className="font-medium">{hardwareInfo.os.build}</span>
              </div>
            )}
          </div>
        </Card>

        {/* Network */}
        <Card className="bg-card border-border p-6 rounded-xl">
          <h3 className="text-lg font-semibold mb-4 flex items-center">
            <Network className="mr-2" size={20} />
            Network
          </h3>

          <div className="space-y-3">
            <div className="flex justify-between">
              <span className="text-muted-foreground">Type</span>
              <span className="font-medium">{hardwareInfo.network.type}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Speed</span>
              <span className="font-medium">{hardwareInfo.network.speed}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Latency</span>
              <span className="font-medium">{hardwareInfo.network.latency}</span>
            </div>
          </div>
        </Card>
      </div>
    </div>
  )
}
