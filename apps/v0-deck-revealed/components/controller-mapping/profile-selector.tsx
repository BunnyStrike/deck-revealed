"use client"

import { useState } from "react"
import { FocusableItem } from "@/components/ui/focusable-item"
import { Card } from "@/components/ui/card"
import { Save, Plus, Trash, Download, Upload } from "lucide-react"
import type { ControllerProfile, ControllerType } from "@/types/controller-mapping"

interface ProfileSelectorProps {
  profiles: ControllerProfile[]
  activeProfile: string
  onSelectProfile: (profileId: string) => void
  onCreateProfile: (name: string, description: string, controllerType: ControllerType) => string
  onDeleteProfile: (profileId: string) => void
  onExportProfile: (profileId: string) => void
  onImportProfile: () => void
}

export function ProfileSelector({
  profiles,
  activeProfile,
  onSelectProfile,
  onCreateProfile,
  onDeleteProfile,
  onExportProfile,
  onImportProfile,
}: ProfileSelectorProps) {
  const [isCreating, setIsCreating] = useState(false)
  const [newProfileName, setNewProfileName] = useState("")
  const [newProfileDescription, setNewProfileDescription] = useState("")
  const [newProfileType, setNewProfileType] = useState<ControllerType>("xbox")

  const handleCreateProfile = () => {
    if (newProfileName.trim()) {
      onCreateProfile(newProfileName, newProfileDescription, newProfileType)
      setNewProfileName("")
      setNewProfileDescription("")
      setIsCreating(false)
    }
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-semibold flex items-center">
          <Save className="mr-2" size={20} />
          Controller Profiles
        </h2>
        <div className="flex space-x-2">
          <FocusableItem
            focusKey="create-profile"
            className="p-2 rounded-lg bg-primary/20 text-primary hover:bg-primary/30 transition-colors"
            onClick={() => setIsCreating(true)}
          >
            <Plus size={18} />
          </FocusableItem>
          <FocusableItem
            focusKey="import-profile"
            className="p-2 rounded-lg bg-muted/30 hover:bg-muted/50 transition-colors"
            onClick={onImportProfile}
          >
            <Upload size={18} />
          </FocusableItem>
        </div>
      </div>

      {isCreating && (
        <Card className="p-4 bg-card border-border">
          <h3 className="font-medium mb-3">Create New Profile</h3>
          <div className="space-y-3">
            <div>
              <label className="block text-sm text-muted-foreground mb-1">Profile Name</label>
              <input
                type="text"
                value={newProfileName}
                onChange={(e) => setNewProfileName(e.target.value)}
                className="w-full p-2 rounded-lg bg-muted/30 border border-border focus:outline-none focus:ring-1 focus:ring-primary"
                placeholder="My Custom Profile"
              />
            </div>
            <div>
              <label className="block text-sm text-muted-foreground mb-1">Description (Optional)</label>
              <input
                type="text"
                value={newProfileDescription}
                onChange={(e) => setNewProfileDescription(e.target.value)}
                className="w-full p-2 rounded-lg bg-muted/30 border border-border focus:outline-none focus:ring-1 focus:ring-primary"
                placeholder="Custom mapping for my games"
              />
            </div>
            <div>
              <label className="block text-sm text-muted-foreground mb-1">Controller Type</label>
              <select
                value={newProfileType}
                onChange={(e) => setNewProfileType(e.target.value as ControllerType)}
                className="w-full p-2 rounded-lg bg-muted/30 border border-border focus:outline-none focus:ring-1 focus:ring-primary"
              >
                <option value="xbox">Xbox</option>
                <option value="playstation">PlayStation</option>
                <option value="nintendo">Nintendo</option>
                <option value="generic">Generic</option>
                <option value="custom">Custom</option>
              </select>
            </div>
            <div className="flex justify-end space-x-2 pt-2">
              <FocusableItem
                focusKey="cancel-create-profile"
                className="px-3 py-1.5 rounded-lg bg-muted/30 hover:bg-muted/50 transition-colors text-sm"
                onClick={() => setIsCreating(false)}
              >
                Cancel
              </FocusableItem>
              <FocusableItem
                focusKey="confirm-create-profile"
                className="px-3 py-1.5 rounded-lg bg-primary/20 text-primary hover:bg-primary/30 transition-colors text-sm"
                onClick={handleCreateProfile}
              >
                Create Profile
              </FocusableItem>
            </div>
          </div>
        </Card>
      )}

      <div className="grid grid-cols-1 gap-3">
        {profiles.map((profile) => (
          <FocusableItem
            key={profile.id}
            focusKey={`profile-${profile.id}`}
            className={`p-4 rounded-xl transition-all ${
              activeProfile === profile.id ? "neon-border bg-card shadow-lg" : "bg-muted/30 hover:bg-muted/50"
            }`}
            onClick={() => onSelectProfile(profile.id)}
          >
            <div className="flex items-center justify-between">
              <div>
                <div className="flex items-center">
                  <p className="font-medium">{profile.name}</p>
                  {profile.isDefault && (
                    <span className="ml-2 px-1.5 py-0.5 text-xs rounded bg-primary/20 text-primary">Default</span>
                  )}
                </div>
                {profile.description && <p className="text-sm text-muted-foreground mt-1">{profile.description}</p>}
              </div>
              <div className="flex space-x-2">
                <FocusableItem
                  focusKey={`export-profile-${profile.id}`}
                  className="p-1.5 rounded-lg bg-muted/30 hover:bg-muted/50 transition-colors"
                  onClick={(e) => {
                    e.stopPropagation()
                    onExportProfile(profile.id)
                  }}
                >
                  <Download size={16} />
                </FocusableItem>
                {!profile.isDefault && (
                  <FocusableItem
                    focusKey={`delete-profile-${profile.id}`}
                    className="p-1.5 rounded-lg bg-muted/30 hover:bg-muted/50 transition-colors"
                    onClick={(e) => {
                      e.stopPropagation()
                      onDeleteProfile(profile.id)
                    }}
                  >
                    <Trash size={16} />
                  </FocusableItem>
                )}
              </div>
            </div>
          </FocusableItem>
        ))}
      </div>
    </div>
  )
}
