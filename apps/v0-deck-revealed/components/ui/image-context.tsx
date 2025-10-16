"use client"

import { createContext, useContext, useState, type ReactNode } from "react"
import { preloadImages, checkImageExists } from "@/lib/image-utils"

interface ImageContextType {
  preloadedImages: Set<string>
  preloadImage: (src: string) => void
  preloadMultipleImages: (srcs: string[]) => void
  checkImageExists: (src: string) => Promise<boolean>
  imageCache: Map<string, boolean>
}

const ImageContext = createContext<ImageContextType | undefined>(undefined)

export function ImageProvider({ children }: { children: ReactNode }) {
  const [preloadedImages, setPreloadedImages] = useState<Set<string>>(new Set())
  const [imageCache, setImageCache] = useState<Map<string, boolean>>(new Map())

  const preloadImage = (src: string) => {
    if (!src || preloadedImages.has(src)) return

    const img = new Image()
    img.src = src
    setPreloadedImages((prev) => {
      const newSet = new Set(prev)
      newSet.add(src)
      return newSet
    })
  }

  const preloadMultipleImages = (srcs: string[]) => {
    const validSrcs = srcs.filter((src) => src && !preloadedImages.has(src))
    if (validSrcs.length === 0) return

    preloadImages(validSrcs)
    setPreloadedImages((prev) => {
      const newSet = new Set(prev)
      validSrcs.forEach((src) => newSet.add(src))
      return newSet
    })
  }

  const checkImageExistsAndCache = async (src: string): Promise<boolean> => {
    if (imageCache.has(src)) {
      return imageCache.get(src) as boolean
    }

    const exists = await checkImageExists(src)
    setImageCache((prev) => {
      const newMap = new Map(prev)
      newMap.set(src, exists)
      return newMap
    })
    return exists
  }

  return (
    <ImageContext.Provider
      value={{
        preloadedImages,
        preloadImage,
        preloadMultipleImages,
        checkImageExists: checkImageExistsAndCache,
        imageCache,
      }}
    >
      {children}
    </ImageContext.Provider>
  )
}

export function useImageContext() {
  const context = useContext(ImageContext)
  if (context === undefined) {
    throw new Error("useImageContext must be used within an ImageProvider")
  }
  return context
}
