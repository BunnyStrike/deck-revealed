"use client"

import { useEffect } from "react"
import { preloadImages } from "@/lib/image-utils"

interface ImagePreloaderProps {
  images: string[]
}

export function ImagePreloader({ images }: ImagePreloaderProps) {
  useEffect(() => {
    preloadImages(images)
  }, [images])

  return null
}
