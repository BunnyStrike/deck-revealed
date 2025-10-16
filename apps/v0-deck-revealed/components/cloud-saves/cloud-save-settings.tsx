"use client"

import { FocusableItem } from "@/components/ui/focusable-item"
import { Card } from "@/components/ui/card"
import { ChevronLeft, Cloud, HardDrive, Lock, Clock, RefreshCw, AlertTriangle } from "lucide-react"
import { useCloudSaves } from "@/hooks/use-cloud-saves"

interface CloudSaveSettingsProps {
  onBack: () => void
}

export function CloudSaveSettings({ onBack }: CloudSaveSettingsProps) {
  const { settings, updateSettings } = useCloudSaves()

  return (
    <div className="h-full overflow-y-auto pb-8">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center">
          <FocusableItem
            focusKey="back-button"
            className="inline-flex items-center text-muted-foreground hover:text-foreground mr-4 transition-colors"
            onClick={onBack}
          >
            <ChevronLeft className="mr-1" size={18} />
            <span>Back</span>
          </FocusableItem>
          <h1 className="text-2xl font-bold gradient-text">Cloud Save Settings</h1>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card className="bg-card border-border p-6 rounded-xl">
          <h2 className="text-xl font-semibold mb-4 flex items-center">
            <Cloud className="mr-2" size={20} />
            Sync Settings
          </h2>

          <div className="space-y-4">
            <div className="flex items-center justify-between p-4 hover:bg-muted/30 rounded-xl transition-all">
              <div>
                <span className="font-medium">Auto Sync</span>
                <p className="text-sm text-muted-foreground">Automatically sync save files with the cloud</p>
              </div>
              <div
                className={`w-12 h-6 rounded-full p-1 transition-colors ${
                  settings.autoSync ? "bg-primary" : "bg-muted"
                }`}
                onClick={() => updateSettings({ autoSync: !settings.autoSync })}
              >
                <div
                  className={`bg-white w-4 h-4 rounded-full shadow-md transform transition-transform ${
                    settings.autoSync ? "translate-x-6" : "translate-x-0"
                  }`}
                />
              </div>
            </div>

            <div className="p-4 bg-muted/30 rounded-xl">
              <label className="block text-sm font-medium mb-3">Conflict Resolution</label>
              <select
                className="w-full bg-card border border-border text-foreground rounded-lg py-2 px-4 focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all"
                value={settings.conflictResolution}
                onChange={(e) => updateSettings({ conflictResolution: e.target.value as any })}
              >
                <option value="ask">Ask me every time</option>
                <option value="newest">Use newest version</option>
                <option value="local">Always keep local version</option>
                <option value="cloud">Always keep cloud version</option>
              </select>
            </div>
          </div>
        </Card>

        <Card className="bg-card border-border p-6 rounded-xl">
          <h2 className="text-xl font-semibold mb-4 flex items-center">
            <HardDrive className="mr-2" size={20} />
            Backup Settings
          </h2>

          <div className="space-y-4">
            <div className="flex items-center justify-between p-4 hover:bg-muted/30 rounded-xl transition-all">
              <div>
                <span className="font-medium">Auto Backup</span>
                <p className="text-sm text-muted-foreground">Automatically create backups of save files</p>
              </div>
              <div
                className={`w-12 h-6 rounded-full p-1 transition-colors ${
                  settings.autoBackup ? "bg-primary" : "bg-muted"
                }`}
                onClick={() => updateSettings({ autoBackup: !settings.autoBackup })}
              >
                <div
                  className={`bg-white w-4 h-4 rounded-full shadow-md transform transition-transform ${
                    settings.autoBackup ? "translate-x-6" : "translate-x-0"
                  }`}
                />
              </div>
            </div>

            <div className="p-4 bg-muted/30 rounded-xl">
              <label className="block text-sm font-medium mb-3">Backup Frequency</label>
              <select
                className="w-full bg-card border border-border text-foreground rounded-lg py-2 px-4 focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all"
                value={settings.backupFrequency}
                onChange={(e) => updateSettings({ backupFrequency: e.target.value as any })}
                disabled={!settings.autoBackup}
              >
                <option value="hourly">Hourly</option>
                <option value="daily">Daily</option>
                <option value="weekly">Weekly</option>
                <option value="on-exit">On Game Exit</option>
              </select>
            </div>

            <div className="p-4 bg-muted/30 rounded-xl">
              <label className="block text-sm font-medium mb-3">Maximum Backups per Save</label>
              <input
                type="number"
                min="1"
                max="20"
                className="w-full bg-card border border-border text-foreground rounded-lg py-2 px-4 focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all"
                value={settings.maxBackupsPerSave}
                onChange={(e) => updateSettings({ maxBackupsPerSave: Number.parseInt(e.target.value) })}
              />
            </div>

            <div className="p-4 bg-muted/30 rounded-xl">
              <label className="block text-sm font-medium mb-3">Backup Location</label>
              <div className="flex">
                <input
                  type="text"
                  className="flex-grow bg-card border border-border text-foreground rounded-l-lg py-2 px-4 focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all"
                  value={settings.backupLocation}
                  onChange={(e) => updateSettings({ backupLocation: e.target.value })}
                />
                <button className="bg-primary hover:bg-primary/90 text-white px-4 py-2 rounded-r-lg font-medium transition-all">
                  Browse
                </button>
              </div>
            </div>
          </div>
        </Card>

        <Card className="bg-card border-border p-6 rounded-xl">
          <h2 className="text-xl font-semibold mb-4 flex items-center">
            <Lock className="mr-2" size={20} />
            Security Settings
          </h2>

          <div className="space-y-4">
            <div className="flex items-center justify-between p-4 hover:bg-muted/30 rounded-xl transition-all">
              <div>
                <span className="font-medium">Compression</span>
                <p className="text-sm text-muted-foreground">Compress backups to save disk space</p>
              </div>
              <div
                className={`w-12 h-6 rounded-full p-1 transition-colors ${
                  settings.compressionEnabled ? "bg-primary" : "bg-muted"
                }`}
                onClick={() => updateSettings({ compressionEnabled: !settings.compressionEnabled })}
              >
                <div
                  className={`bg-white w-4 h-4 rounded-full shadow-md transform transition-transform ${
                    settings.compressionEnabled ? "translate-x-6" : "translate-x-0"
                  }`}
                />
              </div>
            </div>

            <div className="flex items-center justify-between p-4 hover:bg-muted/30 rounded-xl transition-all">
              <div>
                <span className="font-medium">Encryption</span>
                <p className="text-sm text-muted-foreground">Encrypt backups for additional security</p>
              </div>
              <div
                className={`w-12 h-6 rounded-full p-1 transition-colors ${
                  settings.encryptionEnabled ? "bg-primary" : "bg-muted"
                }`}
                onClick={() => updateSettings({ encryptionEnabled: !settings.encryptionEnabled })}
              >
                <div
                  className={`bg-white w-4 h-4 rounded-full shadow-md transform transition-transform ${
                    settings.encryptionEnabled ? "translate-x-6" : "translate-x-0"
                  }`}
                />
              </div>
            </div>
          </div>
        </Card>

        <Card className="bg-card border-border p-6 rounded-xl">
          <h2 className="text-xl font-semibold mb-4 flex items-center">
            <Clock className="mr-2" size={20} />
            Cleanup Settings
          </h2>

          <div className="space-y-4">
            <div className="p-4 bg-muted/30 rounded-xl">
              <label className="block text-sm font-medium mb-3">Maximum Backup Age (Days)</label>
              <input
                type="number"
                min="1"
                max="365"
                className="w-full bg-card border border-border text-foreground rounded-lg py-2 px-4 focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all"
                value={settings.maxBackupAge}
                onChange={(e) => updateSettings({ maxBackupAge: Number.parseInt(e.target.value) })}
              />
              <p className="text-xs text-muted-foreground mt-2">
                Backups older than this will be automatically deleted. Set to 0 to keep backups indefinitely.
              </p>
            </div>

            <div className="mt-4">
              <FocusableItem
                focusKey="cleanup-now"
                className="block w-full text-center bg-primary/10 hover:bg-primary/20 text-primary p-4 rounded-xl transition-all"
              >
                <span className="font-medium flex items-center justify-center">
                  <RefreshCw className="w-4 h-4 mr-2" />
                  Run Cleanup Now
                </span>
              </FocusableItem>
            </div>
          </div>
        </Card>
      </div>

      <Card className="bg-card border-border p-6 rounded-xl mt-6">
        <div className="flex items-center mb-4">
          <AlertTriangle className="text-secondary mr-2" size={20} />
          <h2 className="text-xl font-semibold">Advanced Options</h2>
        </div>

        <p className="text-muted-foreground mb-4">
          These actions affect all your cloud saves and backups. Use with caution.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <FocusableItem
            focusKey="reset-settings"
            className="block w-full text-center bg-muted/30 hover:bg-muted/50 p-4 rounded-xl transition-all"
          >
            <span className="font-medium">Reset Settings</span>
          </FocusableItem>

          <FocusableItem
            focusKey="clear-all-backups"
            className="block w-full text-center bg-secondary/10 hover:bg-secondary/20 text-secondary p-4 rounded-xl transition-all"
          >
            <span className="font-medium">Clear All Backups</span>
          </FocusableItem>

          <FocusableItem
            focusKey="clear-cloud-data"
            className="block w-full text-center bg-secondary/10 hover:bg-secondary/20 text-secondary p-4 rounded-xl transition-all"
          >
            <span className="font-medium">Clear Cloud Data</span>
          </FocusableItem>
        </div>
      </Card>
    </div>
  )
}
