"use client"

import { useState, useEffect, useCallback, useRef } from "react"
import { ChevronLeft, ChevronRight, Pause, Play } from "lucide-react"
import { FocusableItem } from "@/components/ui/focusable-item"
import { OptimizedImage } from "@/components/ui/optimized-image"
import { cn } from "@/lib/utils"
import type { GameData } from "@/types/game-data"

interface FeaturedGameCarouselProps {
  games: GameData[]
  interval?: number
  autoPlay?: boolean
  className?: string
}

export function FeaturedGameCarousel({
  games,
  interval = 5000,
  autoPlay = true,
  className,
}: FeaturedGameCarouselProps) {
  const [currentIndex, setCurrentIndex] = useState(0)
  const [isPlaying, setIsPlaying] = useState(autoPlay)
  const [isTransitioning, setIsTransitioning] = useState(false)
  const transitioningRef = useRef(isTransitioning)

  // Handle edge case: if no games provided
  if (!games || games.length === 0) {
    return (
      <div className={cn("relative w-full h-64 rounded-xl overflow-hidden bg-card", className)}>
        <div className="absolute inset-0 flex items-center justify-center text-muted-foreground">
          No featured games available
        </div>
      </div>
    )
  }

  const nextSlide = useCallback(() => {
    if (transitioningRef.current) return

    transitioningRef.current = true
    setIsTransitioning(true)
    setCurrentIndex((prevIndex) => (prevIndex + 1) % games.length)

    setTimeout(() => {
      setIsTransitioning(false)
      transitioningRef.current = false
    }, 500)
  }, [games.length])

  const prevSlide = useCallback(() => {
    if (transitioningRef.current) return

    transitioningRef.current = true
    setIsTransitioning(true)
    setCurrentIndex((prevIndex) => (prevIndex - 1 + games.length) % games.length)

    setTimeout(() => {
      setIsTransitioning(false)
      transitioningRef.current = false
    }, 500)
  }, [games.length])

  const goToSlide = useCallback(
    (index: number) => {
      if (transitioningRef.current || index === currentIndex) return

      transitioningRef.current = true
      setIsTransitioning(true)
      setCurrentIndex(index)

      setTimeout(() => {
        setIsTransitioning(false)
        transitioningRef.current = false
      }, 500)
    },
    [currentIndex],
  )

  const toggleAutoPlay = useCallback(() => {
    setIsPlaying((prev) => !prev)
  }, [])

  // Set up auto rotation
  useEffect(() => {
    if (!isPlaying) return

    const timer = setInterval(() => {
      nextSlide()
    }, interval)

    return () => clearInterval(timer)
  }, [isPlaying, interval, nextSlide])

  // Get current game
  const currentGame = games[currentIndex]

  return (
    <div className={cn("relative w-full h-64 rounded-xl overflow-hidden group", className)}>
      {/* Game Image */}
      <div className="absolute inset-0 transition-opacity duration-500">
        <OptimizedImage
          src={currentGame.headerImage || currentGame.image}
          alt={currentGame.title}
          fallbackSrc="/neon-cityscape.png"
          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
          preload={true}
          lazyLoad={false}
          blurEffect={true}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-background via-background/70 to-transparent"></div>
      </div>

      {/* Game Info */}
      <div className="absolute bottom-0 left-0 p-6 w-full transition-transform duration-500">
        <div className="flex items-center mb-2">
          {currentGame.releaseDate &&
            new Date(currentGame.releaseDate) > new Date(Date.now() - 30 * 24 * 60 * 60 * 1000) && (
              <span className="bg-secondary text-white text-xs font-bold px-2 py-1 rounded-md mr-2">NEW</span>
            )}
          <span className="text-sm text-muted-foreground">
            {currentGame.releaseDate
              ? `Released ${new Date(currentGame.releaseDate).toLocaleDateString()}`
              : "Coming Soon"}
          </span>
        </div>
        <h2 className="text-2xl font-bold mb-1">{currentGame.title}</h2>
        <p className="text-muted-foreground mb-4 max-w-lg line-clamp-2">{currentGame.description}</p>
        <FocusableItem focusKey={`play-${currentGame.id}`}>
          <button className="bg-primary hover:bg-primary/90 text-white px-6 py-2 rounded-lg font-medium transition-all btn-hover-effect">
            Play Now
          </button>
        </FocusableItem>
      </div>

      {/* Navigation Arrows */}
      <div className="absolute top-1/2 left-4 -translate-y-1/2 opacity-0 group-hover:opacity-100 transition-opacity">
        <FocusableItem focusKey="prev-game">
          <button
            onClick={prevSlide}
            className="bg-background/80 hover:bg-background text-foreground p-2 rounded-full backdrop-blur-sm"
            aria-label="Previous game"
            disabled={isTransitioning}
          >
            <ChevronLeft size={24} />
          </button>
        </FocusableItem>
      </div>

      <div className="absolute top-1/2 right-4 -translate-y-1/2 opacity-0 group-hover:opacity-100 transition-opacity">
        <FocusableItem focusKey="next-game">
          <button
            onClick={nextSlide}
            className="bg-background/80 hover:bg-background text-foreground p-2 rounded-full backdrop-blur-sm"
            aria-label="Next game"
            disabled={isTransitioning}
          >
            <ChevronRight size={24} />
          </button>
        </FocusableItem>
      </div>

      {/* Indicator Dots */}
      <div className="absolute bottom-2 left-1/2 -translate-x-1/2 flex space-x-2">
        {games.map((_, index) => (
          <FocusableItem key={index} focusKey={`dot-${index}`}>
            <button
              onClick={() => goToSlide(index)}
              className={cn(
                "w-2 h-2 rounded-full transition-all",
                index === currentIndex ? "bg-primary w-4" : "bg-foreground/30 hover:bg-foreground/50",
              )}
              aria-label={`Go to slide ${index + 1}`}
              disabled={isTransitioning}
            />
          </FocusableItem>
        ))}
      </div>

      {/* Play/Pause Button */}
      <div className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity">
        <FocusableItem focusKey="toggle-autoplay">
          <button
            onClick={toggleAutoPlay}
            className="bg-background/80 hover:bg-background text-foreground p-2 rounded-full backdrop-blur-sm"
            aria-label={isPlaying ? "Pause autoplay" : "Play autoplay"}
          >
            {isPlaying ? <Pause size={16} /> : <Play size={16} />}
          </button>
        </FocusableItem>
      </div>
    </div>
  )
}
