"use client"

import { useState, useEffect } from "react"

type ImageStatus = "loading" | "loaded" | "error"

interface UseImageLoadingOptions {
  preload?: boolean
  fallbackSrc?: string
  placeholderSrc?: string
  crossOrigin?: "anonymous" | "use-credentials"
}

export function useImageLoading(
  src: string | undefined,
  { preload = false, fallbackSrc, placeholderSrc, crossOrigin }: UseImageLoadingOptions = {},
) {
  const [status, setStatus] = useState<ImageStatus>("loading")
  const [imageSrc, setImageSrc] = useState<string | undefined>(preload ? src : placeholderSrc || src)

  useEffect(() => {
    if (!src) {
      setStatus("error")
      setImageSrc(fallbackSrc || placeholderSrc)
      return
    }

    // Reset status when src changes
    if (src !== imageSrc) {
      setStatus("loading")
      setImageSrc(placeholderSrc || src)
    }

    const img = new Image()
    if (crossOrigin) {
      img.crossOrigin = crossOrigin
    }

    img.onload = () => {
      setStatus("loaded")
      setImageSrc(src)
    }

    img.onerror = () => {
      setStatus("error")
      setImageSrc(fallbackSrc || placeholderSrc)
    }

    img.src = src

    return () => {
      img.onload = null
      img.onerror = null
    }
  }, [src, fallbackSrc, placeholderSrc, crossOrigin])

  return { status, imageSrc }
}
