"use client"

import type React from "react"

import { useState, useEffect, forwardRef } from "react"
import { useImageLoading } from "@/hooks/use-image-loading"
import { useIntersectionObserver } from "@/hooks/use-intersection-observer"
import { generatePlaceholder } from "@/lib/image-utils"
import { cn } from "@/lib/utils"

export interface OptimizedImageProps extends React.ImgHTMLAttributes<HTMLImageElement> {
  src: string
  alt: string
  fallbackSrc?: string
  placeholderSrc?: string
  preload?: boolean
  lazyLoad?: boolean
  blurEffect?: boolean
  aspectRatio?: string
  objectFit?: "contain" | "cover" | "fill" | "none" | "scale-down"
  containerClassName?: string
}

export const OptimizedImage = forwardRef<HTMLImageElement, OptimizedImageProps>(
  (
    {
      src,
      alt,
      fallbackSrc,
      placeholderSrc,
      preload = false,
      lazyLoad = true,
      blurEffect = true,
      aspectRatio,
      objectFit = "cover",
      width,
      height,
      className,
      containerClassName,
      ...props
    },
    ref,
  ) => {
    // Generate default placeholder if not provided
    const defaultPlaceholder =
      width && height ? generatePlaceholder(Number(width), Number(height)) : "/placeholder.svg?width=400&height=300"

    const actualPlaceholder = placeholderSrc || defaultPlaceholder

    // Set up intersection observer for lazy loading
    const [containerRef, isVisible] = useIntersectionObserver<HTMLDivElement>({
      rootMargin: "200px", // Load images 200px before they come into view
      once: true,
    })

    // Only load the image if it's visible or preload is true
    const shouldLoad = preload || !lazyLoad || isVisible

    // Use the image loading hook
    const { status, imageSrc } = useImageLoading(shouldLoad ? src : undefined, {
      preload,
      fallbackSrc,
      placeholderSrc: actualPlaceholder,
      crossOrigin: props.crossOrigin,
    })

    // Track if the image has loaded for blur effect
    const [hasLoaded, setHasLoaded] = useState(false)

    useEffect(() => {
      if (status === "loaded") {
        setHasLoaded(true)
      }
    }, [status])

    return (
      <div
        ref={containerRef}
        className={cn("overflow-hidden relative", aspectRatio && `aspect-[${aspectRatio}]`, containerClassName)}
        style={{
          width: width ? `${width}px` : "100%",
          height: height ? `${height}px` : undefined,
        }}
      >
        <img
          ref={ref}
          src={imageSrc || actualPlaceholder}
          alt={alt}
          width={width}
          height={height}
          className={cn(
            "transition-all duration-500",
            objectFit && `object-${objectFit}`,
            blurEffect && status === "loading" && "blur-sm scale-105",
            className,
          )}
          onLoad={() => setHasLoaded(true)}
          {...props}
        />

        {status === "error" && (
          <div className="absolute inset-0 flex items-center justify-center bg-muted/20 text-muted-foreground text-sm">
            {alt || "Image failed to load"}
          </div>
        )}
      </div>
    )
  },
)

OptimizedImage.displayName = "OptimizedImage"
