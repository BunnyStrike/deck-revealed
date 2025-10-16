"use client"

import type React from "react"

import { useState, useRef } from "react"
import { Upload, Check, AlertCircle, FileUp } from "lucide-react"
import { Card } from "@/components/ui/card"
import { FocusableItem } from "@/components/ui/focusable-item"
import { useLegacyGames } from "@/hooks/use-legacy-games"
import type { ROM, EmulatorPlatform } from "@/types/legacy-games"

interface ROMUploaderProps {
  onComplete?: (rom: ROM) => void
  defaultPlatform?: EmulatorPlatform
}

export function ROMUploader({ onComplete, defaultPlatform }: ROMUploaderProps) {
  const { addROM, platforms, emulators } = useLegacyGames()
  const [dragActive, setDragActive] = useState(false)
  const [uploading, setUploading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState(false)
  const [selectedPlatform, setSelectedPlatform] = useState<EmulatorPlatform | undefined>(defaultPlatform)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()

    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true)
    } else if (e.type === "dragleave") {
      setDragActive(false)
    }
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setDragActive(false)

    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      handleFiles(e.dataTransfer.files)
    }
  }

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      handleFiles(e.target.files)
    }
  }

  const handleFiles = async (files: FileList) => {
    setUploading(true)
    setError(null)
    setSuccess(false)

    try {
      // In a real app, this would involve file system operations
      // Here we're just simulating the process

      const results = []

      for (let i = 0; i < files.length; i++) {
        const file = files[i]

        // Check if the file is a valid ROM
        const fileExt = file.name.split(".").pop()?.toLowerCase()
        let validFile = false
        let detectedPlatform = selectedPlatform

        // If no platform is selected, try to detect it
        if (!detectedPlatform) {
          for (const emulator of emulators) {
            if (
              emulator.supportedFileExtensions.some((ext) => ext.includes(`.${fileExt}`) || ext.includes(fileExt || ""))
            ) {
              detectedPlatform = emulator.platform
              validFile = true
              break
            }
          }
        } else {
          // Check if the file is valid for the selected platform
          const platformEmulators = emulators.filter((e) => e.platform === detectedPlatform)
          for (const emulator of platformEmulators) {
            if (
              emulator.supportedFileExtensions.some((ext) => ext.includes(`.${fileExt}`) || ext.includes(fileExt || ""))
            ) {
              validFile = true
              break
            }
          }
        }

        if (!validFile) {
          throw new Error(`Unsupported file format: ${fileExt}`)
        }

        // Create a new ROM
        const newROM = await addROM({
          fileName: file.name,
          filePath: `/roms/${detectedPlatform}/${file.name}`,
          fileSize: file.size,
          platform: detectedPlatform,
          title: file.name.split(".")[0].replace(/[-_]/g, " "),
          dateAdded: new Date().toISOString(),
          favorite: false,
          playTime: 0,
          verified: false,
        })

        results.push(newROM)
      }

      setSuccess(true)
      setUploading(false)

      if (results.length === 1 && onComplete) {
        onComplete(results[0])
      }

      // Reset the file input
      if (fileInputRef.current) {
        fileInputRef.current.value = ""
      }

      return results
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to upload ROM")
      setUploading(false)
      return null
    }
  }

  const openFileDialog = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click()
    }
  }

  return (
    <Card className={`p-6 ${dragActive ? "border-primary border-2" : "border-border"}`}>
      <div
        className="flex flex-col items-center justify-center gap-4"
        onDragEnter={handleDrag}
        onDragLeave={handleDrag}
        onDragOver={handleDrag}
        onDrop={handleDrop}
      >
        <div className="w-16 h-16 rounded-full bg-muted flex items-center justify-center">
          {success ? (
            <Check className="w-8 h-8 text-green-500" />
          ) : error ? (
            <AlertCircle className="w-8 h-8 text-red-500" />
          ) : uploading ? (
            <div className="w-8 h-8 border-4 border-t-primary border-r-primary border-b-primary border-l-transparent rounded-full animate-spin" />
          ) : (
            <Upload className="w-8 h-8 text-muted-foreground" />
          )}
        </div>

        <div className="text-center">
          <h3 className="text-lg font-semibold mb-1">Upload ROMs</h3>
          <p className="text-sm text-muted-foreground mb-4">Drag and drop your ROM files here, or click to browse</p>

          {platforms.length > 0 && (
            <div className="mb-4">
              <label className="text-sm font-medium mb-1 block">Platform (Optional)</label>
              <div className="flex flex-wrap gap-2 justify-center">
                {platforms.map((platform) => (
                  <FocusableItem
                    key={platform.id}
                    focusKey={`platform-${platform.id}`}
                    className={`px-3 py-1 rounded-full text-xs font-medium cursor-pointer transition-colors ${
                      selectedPlatform === platform.id
                        ? "bg-primary text-white"
                        : "bg-muted text-muted-foreground hover:bg-muted/80"
                    }`}
                    onClick={() => setSelectedPlatform(platform.id)}
                  >
                    {platform.shortName}
                  </FocusableItem>
                ))}
              </div>
            </div>
          )}

          {error && <div className="text-red-500 text-sm mb-4 p-2 bg-red-50 rounded-md">{error}</div>}

          {success && (
            <div className="text-green-500 text-sm mb-4 p-2 bg-green-50 rounded-md">ROM uploaded successfully!</div>
          )}

          <FocusableItem
            focusKey="upload-button"
            className="bg-primary hover:bg-primary/90 text-white px-4 py-2 rounded-lg font-medium transition-all inline-flex items-center"
            onClick={openFileDialog}
          >
            <FileUp className="w-4 h-4 mr-2" />
            Browse Files
          </FocusableItem>

          <input
            ref={fileInputRef}
            type="file"
            multiple
            className="hidden"
            onChange={handleFileInput}
            accept=".nes,.smc,.sfc,.n64,.v64,.z64,.md,.smd,.gen,.gb,.gbc,.gba"
          />
        </div>
      </div>
    </Card>
  )
}
