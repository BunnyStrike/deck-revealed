/**
 * Generates a placeholder image URL with the specified dimensions and optional query
 */
export function generatePlaceholder(width: number, height: number, query?: string): string {
  const baseUrl = "/placeholder.svg"
  const params = new URLSearchParams()

  params.append("width", width.toString())
  params.append("height", height.toString())

  if (query) {
    params.append("query", query)
  }

  return `${baseUrl}?${params.toString()}`
}

/**
 * Preloads an array of images
 */
export function preloadImages(images: string[]): void {
  images.forEach((src) => {
    if (!src) return
    const img = new Image()
    img.src = src
  })
}

/**
 * Checks if an image exists by attempting to load it
 */
export async function checkImageExists(url: string): Promise<boolean> {
  return new Promise((resolve) => {
    const img = new Image()
    img.onload = () => resolve(true)
    img.onerror = () => resolve(false)
    img.src = url
  })
}

/**
 * Extracts image dimensions from a URL if they're present as query parameters
 */
export function extractImageDimensions(url: string): { width?: number; height?: number } {
  try {
    const urlObj = new URL(url, window.location.origin)
    const width = urlObj.searchParams.get("width")
    const height = urlObj.searchParams.get("height")

    return {
      width: width ? Number.parseInt(width, 10) : undefined,
      height: height ? Number.parseInt(height, 10) : undefined,
    }
  } catch (e) {
    return {}
  }
}
