"use client"

import { useState, useEffect, useRef, type RefObject } from "react"

interface UseIntersectionObserverOptions {
  root?: Element | null
  rootMargin?: string
  threshold?: number | number[]
  once?: boolean
}

export function useIntersectionObserver<T extends Element>({
  root = null,
  rootMargin = "0px",
  threshold = 0,
  once = false,
}: UseIntersectionObserverOptions = {}): [RefObject<T>, boolean] {
  const ref = useRef<T>(null)
  const [isIntersecting, setIsIntersecting] = useState(false)

  useEffect(() => {
    const element = ref.current
    if (!element) return

    const observer = new IntersectionObserver(
      ([entry]) => {
        setIsIntersecting(entry.isIntersecting)

        // If once is true and the element has been intersected, unobserve it
        if (once && entry.isIntersecting) {
          observer.unobserve(element)
        }
      },
      { root, rootMargin, threshold },
    )

    observer.observe(element)

    return () => {
      observer.unobserve(element)
    }
  }, [root, rootMargin, threshold, once])

  return [ref, isIntersecting]
}
