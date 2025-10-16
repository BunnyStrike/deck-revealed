"use client"

import { useState } from "react"
import { FocusableItem } from "@/components/ui/focusable-item"
import { Card } from "@/components/ui/card"
import { Monitor, Gamepad, Bell, Shield, Zap, Cpu, HardDrive } from "lucide-react"
import { useTheme } from "@/components/theme/theme-provider"

export function Settings() {
  const { currentTheme, setTheme, availableThemes } = useTheme()
  const [controllerVibration, setControllerVibration] = useState(true)
  const [notifications, setNotifications] = useState(true)
  const [autoUpdate, setAutoUpdate] = useState(true)
  const [performanceMode, setPerformanceMode] = useState("balanced")

  return (
    <div className="space-y-8 max-w-4xl mx-auto">
      <h1 className="text-3xl font-bold gradient-text">Settings</h1>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="md:col-span-3">
          <Card className="bg-card border-border p-6 rounded-xl">
            <h2 className="text-xl font-semibold mb-4 flex items-center">
              <Monitor className="mr-2" size={20} />
              Display
            </h2>

            <div className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-muted-foreground mb-3">Theme</label>
                <div className="flex flex-wrap gap-3">
                  {availableThemes.map((theme) => (
                    <FocusableItem
                      key={theme.id}
                      focusKey={`theme-${theme.id}`}
                      className={`p-3 rounded-xl transition-all ${
                        currentTheme.id === theme.id ? "neon-border bg-card shadow-lg" : "bg-muted/30 hover:bg-muted/50"
                      }`}
                      onClick={() => setTheme(theme.id)}
                    >
                      <div className="text-center">
                        <div
                          className="w-20 h-20 rounded-lg mb-2 border border-gray-600"
                          style={{
                            background: `hsl(${theme.background})`,
                            borderColor: `hsl(${theme.border})`,
                          }}
                        >
                          <div className="flex justify-center pt-2 gap-2">
                            <div className="w-4 h-4 rounded-full" style={{ background: `hsl(${theme.primary})` }}></div>
                            <div
                              className="w-4 h-4 rounded-full"
                              style={{ background: `hsl(${theme.secondary})` }}
                            ></div>
                            <div className="w-4 h-4 rounded-full" style={{ background: `hsl(${theme.accent})` }}></div>
                          </div>
                        </div>
                        <span className={currentTheme.id === theme.id ? "font-medium" : "text-muted-foreground"}>
                          {theme.name}
                        </span>
                      </div>
                    </FocusableItem>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-muted-foreground mb-3">Text Size</label>
                <div className="bg-muted/30 p-4 rounded-xl">
                  <input
                    type="range"
                    min="1"
                    max="5"
                    defaultValue="3"
                    className="w-full h-2 bg-muted rounded-lg appearance-none cursor-pointer accent-primary"
                  />
                  <div className="flex justify-between text-xs text-muted-foreground mt-2">
                    <span>Small</span>
                    <span>Default</span>
                    <span>Large</span>
                  </div>
                </div>
              </div>
            </div>
          </Card>
        </div>

        <div className="md:col-span-2">
          <Card className="bg-card border-border p-6 rounded-xl h-full">
            <h2 className="text-xl font-semibold mb-4 flex items-center">
              <Gamepad className="mr-2" size={20} />
              Controller
            </h2>

            <div className="space-y-4">
              <FocusableItem
                focusKey="controller-vibration"
                className="flex items-center justify-between p-4 hover:bg-muted/30 rounded-xl transition-all"
                onClick={() => setControllerVibration(!controllerVibration)}
              >
                <div>
                  <span className="font-medium">Controller Vibration</span>
                  <p className="text-sm text-muted-foreground">Enable haptic feedback for supported controllers</p>
                </div>
                <div
                  className={`w-12 h-6 rounded-full p-1 transition-colors ${
                    controllerVibration ? "bg-primary" : "bg-muted"
                  }`}
                >
                  <div
                    className={`bg-white w-4 h-4 rounded-full shadow-md transform transition-transform ${
                      controllerVibration ? "translate-x-6" : "translate-x-0"
                    }`}
                  />
                </div>
              </FocusableItem>

              <div className="p-4 bg-muted/30 rounded-xl">
                <label className="block text-sm font-medium mb-3">Stick Sensitivity</label>
                <input
                  type="range"
                  min="1"
                  max="10"
                  defaultValue="5"
                  className="w-full h-2 bg-muted rounded-lg appearance-none cursor-pointer accent-primary"
                />
                <div className="flex justify-between text-xs text-muted-foreground mt-2">
                  <span>Low</span>
                  <span>Default</span>
                  <span>High</span>
                </div>
              </div>

              <FocusableItem
                focusKey="controller-remap"
                className="block w-full text-center bg-primary/10 hover:bg-primary/20 text-primary p-4 rounded-xl transition-all"
              >
                <span className="font-medium">Remap Controller Buttons</span>
              </FocusableItem>
            </div>
          </Card>
        </div>

        <div>
          <Card className="bg-card border-border p-6 rounded-xl h-full">
            <h2 className="text-xl font-semibold mb-4 flex items-center">
              <Zap className="mr-2" size={20} />
              Performance
            </h2>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-muted-foreground mb-3">Mode</label>
                <div className="space-y-2">
                  <FocusableItem
                    focusKey="perf-quality"
                    className={`block w-full text-left p-3 rounded-lg transition-all ${
                      performanceMode === "quality" ? "bg-primary/20 text-primary" : "hover:bg-muted/30"
                    }`}
                    onClick={() => setPerformanceMode("quality")}
                  >
                    <div className="flex items-center">
                      <Shield className="w-5 h-5 mr-2" />
                      <div>
                        <span className="font-medium">Quality</span>
                        <p className="text-xs text-muted-foreground">Best visual experience</p>
                      </div>
                    </div>
                  </FocusableItem>

                  <FocusableItem
                    focusKey="perf-balanced"
                    className={`block w-full text-left p-3 rounded-lg transition-all ${
                      performanceMode === "balanced" ? "bg-primary/20 text-primary" : "hover:bg-muted/30"
                    }`}
                    onClick={() => setPerformanceMode("balanced")}
                  >
                    <div className="flex items-center">
                      <Cpu className="w-5 h-5 mr-2" />
                      <div>
                        <span className="font-medium">Balanced</span>
                        <p className="text-xs text-muted-foreground">Good performance and visuals</p>
                      </div>
                    </div>
                  </FocusableItem>

                  <FocusableItem
                    focusKey="perf-battery"
                    className={`block w-full text-left p-3 rounded-lg transition-all ${
                      performanceMode === "battery" ? "bg-primary/20 text-primary" : "hover:bg-muted/30"
                    }`}
                    onClick={() => setPerformanceMode("battery")}
                  >
                    <div className="flex items-center">
                      <HardDrive className="w-5 h-5 mr-2" />
                      <div>
                        <span className="font-medium">Battery Saver</span>
                        <p className="text-xs text-muted-foreground">Maximize battery life</p>
                      </div>
                    </div>
                  </FocusableItem>
                </div>
              </div>
            </div>
          </Card>
        </div>

        <div className="md:col-span-3">
          <Card className="bg-card border-border p-6 rounded-xl">
            <h2 className="text-xl font-semibold mb-4 flex items-center">
              <Bell className="mr-2" size={20} />
              System
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FocusableItem
                focusKey="notifications"
                className="flex items-center justify-between p-4 hover:bg-muted/30 rounded-xl transition-all"
                onClick={() => setNotifications(!notifications)}
              >
                <div>
                  <span className="font-medium">Notifications</span>
                  <p className="text-sm text-muted-foreground">Show game and friend notifications</p>
                </div>
                <div
                  className={`w-12 h-6 rounded-full p-1 transition-colors ${notifications ? "bg-primary" : "bg-muted"}`}
                >
                  <div
                    className={`bg-white w-4 h-4 rounded-full shadow-md transform transition-transform ${
                      notifications ? "translate-x-6" : "translate-x-0"
                    }`}
                  />
                </div>
              </FocusableItem>

              <FocusableItem
                focusKey="auto-update"
                className="flex items-center justify-between p-4 hover:bg-muted/30 rounded-xl transition-all"
                onClick={() => setAutoUpdate(!autoUpdate)}
              >
                <div>
                  <span className="font-medium">Auto Update Games</span>
                  <p className="text-sm text-muted-foreground">Automatically download and install game updates</p>
                </div>
                <div
                  className={`w-12 h-6 rounded-full p-1 transition-colors ${autoUpdate ? "bg-primary" : "bg-muted"}`}
                >
                  <div
                    className={`bg-white w-4 h-4 rounded-full shadow-md transform transition-transform ${
                      autoUpdate ? "translate-x-6" : "translate-x-0"
                    }`}
                  />
                </div>
              </FocusableItem>

              <FocusableItem
                focusKey="clear-cache"
                className="block w-full text-center bg-primary/10 hover:bg-primary/20 text-primary p-4 rounded-xl transition-all"
              >
                <span className="font-medium">Clear Cache</span>
              </FocusableItem>

              <FocusableItem
                focusKey="reset-settings"
                className="block w-full text-center bg-secondary/10 hover:bg-secondary/20 text-secondary p-4 rounded-xl transition-all"
              >
                <span className="font-medium">Reset All Settings</span>
              </FocusableItem>
            </div>
          </Card>
        </div>
      </div>
    </div>
  )
}
