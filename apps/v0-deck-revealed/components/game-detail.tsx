"use client"

import { useState } from "react"
import { FocusableItem } from "@/components/ui/focusable-item"
import { Card } from "@/components/ui/card"
import {
  Play,
  Download,
  Settings,
  Star,
  Clock,
  Users,
  Award,
  ChevronLeft,
  ChevronRight,
  Info,
  Share2,
  Heart,
  BarChart2,
  HardDrive,
  FileText,
  Gauge,
} from "lucide-react"
import { Reviews } from "@/components/reviews/reviews"
import { PerformanceProfiler } from "@/components/performance/performance-profiler"
import type { GameData } from "@/types/game-data"
import { OptimizedImage } from "@/components/ui/optimized-image"
import { ImagePreloader } from "@/components/ui/image-preloader"
import {
  Breadcrumb,
  BreadcrumbList,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb"
import { ModBrowser } from "@/components/mods/mod-browser"

interface GameDetailProps {
  gameId: string
  onBack: () => void
}

export function GameDetail({ gameId, onBack }: GameDetailProps) {
  const [activeTab, setActiveTab] = useState("overview")
  const [currentScreenshot, setCurrentScreenshot] = useState(0)

  // In a real app, this would be fetched from an API or database
  const gameData: GameData = {
    id: gameId,
    title: "Cyberpunk 2077",
    developer: "CD Projekt Red",
    publisher: "CD Projekt",
    releaseDate: "December 10, 2020",
    lastPlayed: "2 hours ago",
    totalPlaytime: "42 hours",
    description:
      "Cyberpunk 2077 is an open-world, action-adventure RPG set in the megalopolis of Night City, where you play as a cyberpunk mercenary wrapped up in a do-or-die fight for survival. Improved and featuring all-new free additional content, customize your character and playstyle as you take on jobs, build a reputation, and unlock upgrades. The relationships you forge and the choices you make will shape the story and the world around you. Legends are made here. What will yours be?",
    genres: ["RPG", "Open World", "Action", "Sci-Fi", "FPS"],
    features: ["Single-player", "Controller Support", "Cloud Saves", "Achievements"],
    platforms: ["PC", "PlayStation 5", "Xbox Series X/S", "PlayStation 4", "Xbox One"],
    image: "/neon-cityscape.png",
    headerImage: "/cyberpunk-header.png",
    screenshots: [
      "/cyberpunk-screenshot-1.png",
      "/cyberpunk-screenshot-2.png",
      "/cyberpunk-screenshot-3.png",
      "/cyberpunk-screenshot-4.png",
    ],
    rating: 4.2,
    ratingCount: 125632,
    statistics: {
      averagePlaytime: "65 hours",
      completionRate: 72,
      difficultyRating: 6.5,
      replayValue: 8.2,
    },
    achievements: {
      total: 44,
      unlocked: 16,
      recent: [
        {
          id: "ach1",
          name: "The Wheel of Fortune",
          description: "Complete a job for a fixer",
          date: "2 days ago",
          icon: "/achievement-icon-1.png",
        },
        {
          id: "ach2",
          name: "The Fool",
          description: "Complete all gigs and NCPD Scanner Hustles in Watson",
          date: "1 week ago",
          icon: "/achievement-icon-2.png",
        },
      ],
    },
    friends: [
      { id: "friend1", name: "Alex", status: "Online", playtime: "120h", avatar: "A" },
      { id: "friend2", name: "Jordan", status: "Online", playtime: "85h", avatar: "J" },
      { id: "friend3", name: "Taylor", status: "Offline", playtime: "65h", avatar: "T" },
    ],
    dlc: [
      { id: "dlc1", name: "Phantom Liberty", price: "$29.99", image: "/cyberpunk-dlc-1.png", installed: true },
      { id: "dlc2", name: "Ultimate Cosmetics Pack", price: "$9.99", image: "/cyberpunk-dlc-2.png", installed: false },
    ],
    systemRequirements: {
      minimum: {
        os: "Windows 10 64-bit",
        cpu: "Intel Core i5-3570K or AMD FX-8310",
        gpu: "NVIDIA GeForce GTX 970 or AMD Radeon RX 470",
        ram: "8 GB",
        storage: "70 GB SSD",
      },
      recommended: {
        os: "Windows 10 64-bit",
        cpu: "Intel Core i7-4790 or AMD Ryzen 3 3200G",
        gpu: "NVIDIA GeForce GTX 1060 6GB or AMD Radeon RX 590",
        ram: "12 GB",
        storage: "70 GB SSD",
      },
    },
  }

  // Critical images to preload
  const criticalImages = [
    gameData.headerImage,
    gameData.image,
    gameData.screenshots[0],
    gameData.achievements.recent[0].icon,
  ]

  // Navigate through screenshots
  const nextScreenshot = () => {
    setCurrentScreenshot((prev) => (prev + 1) % gameData.screenshots.length)
  }

  const prevScreenshot = () => {
    setCurrentScreenshot((prev) => (prev - 1 + gameData.screenshots.length) % gameData.screenshots.length)
  }

  // If in reviews tab, show the reviews component
  if (activeTab === "reviews") {
    return <Reviews gameId={gameId} onBack={() => setActiveTab("overview")} />
  }

  // If in performance tab, show the performance profiler component
  if (activeTab === "performance") {
    return <PerformanceProfiler gameId={gameId} onBack={() => setActiveTab("overview")} />
  }

  // If in mods tab, show the mod browser component
  if (activeTab === "mods") {
    return <ModBrowser gameId={gameId} onSelectMod={() => {}} />
  }

  return (
    <div className="h-full overflow-y-auto pb-8">
      {/* Preload critical images */}
      <ImagePreloader images={criticalImages} />

      {/* Back button */}
      <Breadcrumb>
        <BreadcrumbList>
          <BreadcrumbItem>
            <BreadcrumbLink href="#" onClick={onBack}>
              Game Library
            </BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbPage>{gameData.title}</BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>

      {/* Game header */}
      <div className="relative w-full h-80 rounded-xl overflow-hidden mb-6">
        <OptimizedImage
          src={gameData.headerImage || gameData.image}
          alt={gameData.title}
          className="w-full h-full object-cover"
          fallbackSrc={`/placeholder.svg?width=1200&height=320&query=${gameData.title} game banner`}
          preload={true}
          lazyLoad={false}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-background via-background/70 to-transparent"></div>

        <div className="absolute bottom-0 left-0 p-6 w-full">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
            <div>
              <div className="flex flex-wrap gap-2 mb-2">
                {gameData.genres.slice(0, 3).map((genre) => (
                  <span key={genre} className="bg-primary/20 text-primary text-xs font-medium px-2 py-1 rounded-full">
                    {genre}
                  </span>
                ))}
              </div>
              <h1 className="text-3xl md:text-4xl font-bold mb-1">{gameData.title}</h1>
              <p className="text-muted-foreground">
                {gameData.developer} • {gameData.releaseDate}
              </p>
            </div>

            <div className="flex gap-2">
              <FocusableItem
                focusKey="play-game"
                className="bg-primary hover:bg-primary/90 text-white px-6 py-3 rounded-lg font-medium transition-all flex items-center gap-2 btn-hover-effect"
              >
                <Play size={18} />
                <span>Play</span>
              </FocusableItem>

              <FocusableItem
                focusKey="game-settings"
                className="bg-muted/50 hover:bg-muted text-foreground px-3 py-3 rounded-lg transition-all"
              >
                <Settings size={18} />
              </FocusableItem>
            </div>
          </div>
        </div>
      </div>

      {/* Game stats bar */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        <Card className="bg-card border-border p-4 rounded-xl">
          <div className="flex items-center">
            <div className="bg-primary/20 p-2 rounded-lg mr-3">
              <Clock className="text-primary" size={20} />
            </div>
            <div>
              <p className="text-muted-foreground text-sm">Total Playtime</p>
              <p className="font-bold">{gameData.totalPlaytime}</p>
            </div>
          </div>
        </Card>

        <Card className="bg-card border-border p-4 rounded-xl">
          <div className="flex items-center">
            <div className="bg-secondary/20 p-2 rounded-lg mr-3">
              <Award className="text-secondary" size={20} />
            </div>
            <div>
              <p className="text-muted-foreground text-sm">Achievements</p>
              <p className="font-bold">
                {gameData.achievements.unlocked}/{gameData.achievements.total}
              </p>
            </div>
          </div>
        </Card>

        <Card className="bg-card border-border p-4 rounded-xl">
          <div className="flex items-center">
            <div className="bg-accent/20 p-2 rounded-lg mr-3">
              <Users className="text-accent" size={20} />
            </div>
            <div>
              <p className="text-muted-foreground text-sm">Friends Playing</p>
              <p className="font-bold">{gameData.friends.length}</p>
            </div>
          </div>
        </Card>

        <Card className="bg-card border-border p-4 rounded-xl">
          <div className="flex items-center">
            <div className="bg-primary/20 p-2 rounded-lg mr-3">
              <Star className="text-primary" size={20} fill="currentColor" />
            </div>
            <div>
              <p className="text-muted-foreground text-sm">Rating</p>
              <p className="font-bold">{gameData.rating}/5</p>
            </div>
          </div>
        </Card>
      </div>

      {/* Tabs */}
      <div className="border-b border-border mb-6">
        <div className="flex overflow-x-auto scrollbar-thin">
          {["overview", "media", "dlc", "achievements", "friends", "system", "reviews", "performance", "mods"].map(
            (tab) => (
              <FocusableItem
                key={tab}
                focusKey={`tab-${tab}`}
                className={`px-4 py-3 font-medium whitespace-nowrap transition-colors ${
                  activeTab === tab
                    ? "text-primary border-b-2 border-primary"
                    : "text-muted-foreground hover:text-foreground"
                }`}
                onClick={() => setActiveTab(tab)}
              >
                {tab === "performance" ? "Performance" : tab.charAt(0).toUpperCase() + tab.slice(1)}
              </FocusableItem>
            ),
          )}
        </div>
      </div>

      {/* Tab content */}
      <div className="space-y-6">
        {/* Overview Tab */}
        {activeTab === "overview" && (
          <>
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <div className="lg:col-span-2 space-y-6">
                {/* Description */}
                <Card className="bg-card border-border p-6 rounded-xl">
                  <h2 className="text-xl font-semibold mb-4 flex items-center">
                    <Info className="mr-2" size={20} />
                    About
                  </h2>
                  <p className="text-muted-foreground leading-relaxed">{gameData.description}</p>

                  <div className="mt-4 flex flex-wrap gap-2">
                    {gameData.features.map((feature) => (
                      <span key={feature} className="bg-muted/50 text-muted-foreground text-xs px-2 py-1 rounded-full">
                        {feature}
                      </span>
                    ))}
                  </div>
                </Card>

                {/* Recent Activity */}
                <Card className="bg-card border-border p-6 rounded-xl">
                  <h2 className="text-xl font-semibold mb-4 flex items-center">
                    <BarChart2 className="mr-2" size={20} />
                    Recent Activity
                  </h2>

                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-medium">Last session</p>
                        <p className="text-sm text-muted-foreground">Yesterday at 8:30 PM</p>
                      </div>
                      <p className="text-muted-foreground">2.5 hours</p>
                    </div>

                    <div>
                      <p className="font-medium mb-2">Recent achievements</p>
                      {gameData.achievements.recent.map((achievement) => (
                        <div key={achievement.id} className="flex items-center py-2">
                          <div className="w-10 h-10 rounded-lg bg-muted flex items-center justify-center mr-3 overflow-hidden">
                            <OptimizedImage
                              src={achievement.icon}
                              alt=""
                              className="w-8 h-8"
                              fallbackSrc="/golden-trophy-star.png"
                            />
                          </div>
                          <div>
                            <p className="font-medium">{achievement.name}</p>
                            <p className="text-sm text-muted-foreground">
                              {achievement.description} • {achievement.date}
                            </p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </Card>
              </div>

              <div className="space-y-6">
                {/* Actions */}
                <Card className="bg-card border-border p-6 rounded-xl">
                  <h2 className="text-xl font-semibold mb-4">Actions</h2>

                  <div className="space-y-2">
                    <FocusableItem
                      focusKey="action-verify"
                      className="flex items-center w-full p-3 rounded-lg bg-muted/30 hover:bg-muted/50 transition-colors"
                    >
                      <Settings className="mr-3" size={18} />
                      <span>Verify Game Files</span>
                    </FocusableItem>

                    <FocusableItem
                      focusKey="action-backup"
                      className="flex items-center w-full p-3 rounded-lg bg-muted/30 hover:bg-muted/50 transition-colors"
                    >
                      <HardDrive className="mr-3" size={18} />
                      <span>Backup Save Data</span>
                    </FocusableItem>

                    <FocusableItem
                      focusKey="action-share"
                      className="flex items-center w-full p-3 rounded-lg bg-muted/30 hover:bg-muted/50 transition-colors"
                    >
                      <Share2 className="mr-3" size={18} />
                      <span>Share</span>
                    </FocusableItem>

                    <FocusableItem
                      focusKey="action-favorite"
                      className="flex items-center w-full p-3 rounded-lg bg-muted/30 hover:bg-muted/50 transition-colors"
                    >
                      <Heart className="mr-3" size={18} fill="currentColor" />
                      <span>Add to Favorites</span>
                    </FocusableItem>

                    <FocusableItem
                      focusKey="action-review"
                      className="flex items-center w-full p-3 rounded-lg bg-muted/30 hover:bg-muted/50 transition-colors"
                      onClick={() => setActiveTab("reviews")}
                    >
                      <FileText className="mr-3" size={18} />
                      <span>Write a Review</span>
                    </FocusableItem>

                    <FocusableItem
                      focusKey="action-performance"
                      className="flex items-center w-full p-3 rounded-lg bg-muted/30 hover:bg-muted/50 transition-colors"
                      onClick={() => setActiveTab("performance")}
                    >
                      <Gauge className="mr-3" size={18} />
                      <span>Performance Profiler</span>
                    </FocusableItem>
                  </div>
                </Card>

                {/* Friends playing */}
                <Card className="bg-card border-border p-6 rounded-xl">
                  <h2 className="text-xl font-semibold">Friends Who Play</h2>
                  <FocusableItem
                    focusKey="view-all-friends"
                    className="text-primary text-sm"
                    onClick={() => setActiveTab("friends")}
                  >
                    View All
                  </FocusableItem>

                  <div className="space-y-3">
                    {gameData.friends.map((friend) => (
                      <div key={friend.id} className="flex items-center">
                        <div
                          className={`w-10 h-10 rounded-full flex items-center justify-center mr-3 ${
                            friend.status === "Online"
                              ? "bg-gradient-to-br from-primary to-secondary text-white"
                              : "bg-muted text-muted-foreground"
                          }`}
                        >
                          {friend.avatar}
                        </div>
                        <div>
                          <p className="font-medium">{friend.name}</p>
                          <p className="text-xs text-muted-foreground">{friend.playtime} on record</p>
                        </div>
                        <div
                          className={`ml-auto w-2 h-2 rounded-full ${
                            friend.status === "Online" ? "bg-green-500" : "bg-gray-500"
                          }`}
                        />
                      </div>
                    ))}
                  </div>
                </Card>
              </div>
            </div>
          </>
        )}

        {/* Media Tab */}
        {activeTab === "media" && (
          <div className="space-y-6">
            {/* Screenshots */}
            <div>
              <h2 className="text-xl font-semibold mb-4">Screenshots</h2>

              <div className="relative">
                <div className="relative w-full h-[400px] rounded-xl overflow-hidden">
                  <OptimizedImage
                    src={gameData.screenshots[currentScreenshot]}
                    alt={`Screenshot ${currentScreenshot + 1}`}
                    className="w-full h-full object-cover"
                    fallbackSrc={`/placeholder.svg?width=1200&height=400&query=${gameData.title} screenshot`}
                  />
                </div>

                <FocusableItem
                  focusKey="prev-screenshot"
                  className="absolute left-4 top-1/2 -translate-y-1/2 bg-card/80 backdrop-blur-sm p-2 rounded-full text-foreground hover:bg-card transition-colors"
                  onClick={prevScreenshot}
                >
                  <ChevronLeft size={24} />
                </FocusableItem>

                <FocusableItem
                  focusKey="next-screenshot"
                  className="absolute right-4 top-1/2 -translate-y-1/2 bg-card/80 backdrop-blur-sm p-2 rounded-full text-foreground hover:bg-card transition-colors"
                  onClick={nextScreenshot}
                >
                  <ChevronRight size={24} />
                </FocusableItem>

                <div className="absolute bottom-4 left-1/2 -translate-x-1/2 bg-card/80 backdrop-blur-sm px-3 py-1 rounded-full text-sm">
                  {currentScreenshot + 1} / {gameData.screenshots.length}
                </div>
              </div>

              <div className="grid grid-cols-4 gap-2 mt-4">
                {gameData.screenshots.map((screenshot, index) => (
                  <FocusableItem
                    key={index}
                    focusKey={`thumbnail-${index}`}
                    className={`rounded-lg overflow-hidden border-2 transition-all ${
                      currentScreenshot === index ? "border-primary" : "border-transparent hover:border-muted"
                    }`}
                    onClick={() => setCurrentScreenshot(index)}
                  >
                    <OptimizedImage
                      src={screenshot}
                      alt={`Thumbnail ${index + 1}`}
                      className="w-full h-20 object-cover"
                      fallbackSrc={`/placeholder.svg?width=200&height=80&query=${gameData.title} thumbnail`}
                    />
                  </FocusableItem>
                ))}
              </div>
            </div>

            {/* Videos */}
            <div>
              <h2 className="text-xl font-semibold mb-4">Videos</h2>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FocusableItem focusKey="video-trailer" className="relative rounded-xl overflow-hidden h-48 group">
                  <OptimizedImage
                    src="/cyberpunk-trailer-thumbnail.png"
                    alt="Official Trailer"
                    className="w-full h-full object-cover transition-transform group-hover:scale-105"
                    fallbackSrc="/neon-city-glimpse.png"
                  />
                  <div className="absolute inset-0 bg-background/50 flex items-center justify-center">
                    <div className="bg-primary/90 rounded-full p-4">
                      <Play className="text-white" size={24} />
                    </div>
                  </div>
                  <div className="absolute bottom-0 left-0 p-4">
                    <p className="font-medium text-white">Official Trailer</p>
                    <p className="text-sm text-white/80">2:45</p>
                  </div>
                </FocusableItem>

                <FocusableItem focusKey="video-gameplay" className="relative rounded-xl overflow-hidden h-48 group">
                  <OptimizedImage
                    src="/cyberpunk-gameplay-thumbnail.png"
                    alt="Gameplay Walkthrough"
                    className="w-full h-full object-cover transition-transform group-hover:scale-105"
                    fallbackSrc="/neon-alley-cyberpunk.png"
                  />
                  <div className="absolute inset-0 bg-background/50 flex items-center justify-center">
                    <div className="bg-primary/90 rounded-full p-4">
                      <Play className="text-white" size={24} />
                    </div>
                  </div>
                  <div className="absolute bottom-0 left-0 p-4">
                    <p className="font-medium text-white">Gameplay Walkthrough</p>
                    <p className="text-sm text-white/80">15:20</p>
                  </div>
                </FocusableItem>
              </div>
            </div>
          </div>
        )}

        {/* DLC Tab */}
        {activeTab === "dlc" && (
          <div className="space-y-6">
            <h2 className="text-xl font-semibold mb-4">Downloadable Content</h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {gameData.dlc.map((dlc) => (
                <FocusableItem key={dlc.id} focusKey={`dlc-${dlc.id}`} className="game-card">
                  <Card className="overflow-hidden bg-card border-border h-full">
                    <div className="flex flex-col md:flex-row">
                      <div className="w-full md:w-1/3">
                        <OptimizedImage
                          src={dlc.image}
                          alt={dlc.name}
                          className="w-full h-40 md:h-full object-cover"
                          fallbackSrc={`/placeholder.svg?width=200&height=160&query=${dlc.name} DLC`}
                        />
                      </div>
                      <div className="p-4 flex flex-col justify-between flex-grow">
                        <div>
                          <h3 className="font-bold text-lg mb-2">{dlc.name}</h3>
                          <p className="text-sm text-muted-foreground mb-4">
                            Expand your Cyberpunk 2077 experience with additional content.
                          </p>
                        </div>
                        <div className="flex justify-between items-center">
                          <span className="font-bold">{dlc.price}</span>
                          {dlc.installed ? (
                            <button className="bg-muted text-foreground px-4 py-2 rounded-lg font-medium">
                              Installed
                            </button>
                          ) : (
                            <button className="bg-primary hover:bg-primary/90 text-white px-4 py-2 rounded-lg font-medium transition-all flex items-center gap-2">
                              <Download size={16} />
                              <span>Purchase</span>
                            </button>
                          )}
                        </div>
                      </div>
                    </div>
                  </Card>
                </FocusableItem>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
