"use client"
import { FocusableItem } from "@/components/ui/focusable-item"
import { Card } from "@/components/ui/card"
import { Gamepad, Battery, Wifi, WifiOff } from "lucide-react"
import type { ConnectedController } from "@/types/controller-mapping"

interface ControllerSelectorProps {
  controllers: ConnectedController[]
  activeController: string | null
  onSelectController: (controllerId: string) => void
}

export function ControllerSelector({ controllers, activeController, onSelectController }: ControllerSelectorProps) {
  return (
    <div className="space-y-4">
      <h2 className="text-xl font-semibold flex items-center">
        <Gamepad className="mr-2" size={20} />
        Connected Controllers
      </h2>

      <div className="grid grid-cols-1 gap-3">
        {controllers.length === 0 ? (
          <Card className="p-4 bg-muted/30 text-center">
            <p className="text-muted-foreground">No controllers detected</p>
            <p className="text-sm mt-2">Connect a controller to get started</p>
          </Card>
        ) : (
          controllers.map((controller) => (
            <FocusableItem
              key={controller.id}
              focusKey={`controller-${controller.id}`}
              className={`p-4 rounded-xl transition-all ${
                activeController === controller.id ? "neon-border bg-card shadow-lg" : "bg-muted/30 hover:bg-muted/50"
              }`}
              onClick={() => onSelectController(controller.id)}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <div
                    className={`w-10 h-10 rounded-full flex items-center justify-center mr-3 ${
                      controller.connected ? "bg-primary/20 text-primary" : "bg-muted text-muted-foreground"
                    }`}
                  >
                    <Gamepad size={20} />
                  </div>
                  <div>
                    <p className="font-medium">{controller.name}</p>
                    <p className="text-sm text-muted-foreground">
                      {controller.type.charAt(0).toUpperCase() + controller.type.slice(1)} Controller
                    </p>
                  </div>
                </div>
                <div className="flex items-center space-x-3">
                  {controller.batteryLevel !== undefined && controller.connected && (
                    <div className="flex items-center text-sm">
                      <Battery size={16} className="mr-1" />
                      <span>{controller.batteryLevel}%</span>
                    </div>
                  )}
                  {controller.connected ? (
                    <Wifi size={16} className="text-green-500" />
                  ) : (
                    <WifiOff size={16} className="text-muted-foreground" />
                  )}
                </div>
              </div>
            </FocusableItem>
          ))
        )}
      </div>
    </div>
  )
}
