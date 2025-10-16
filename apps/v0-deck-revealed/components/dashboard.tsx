"use client"

import { Card } from "@/components/ui/card"
import { FocusableItem } from "@/components/ui/focusable-item"
import { Clock, Star, TrendingUp } from "lucide-react"
import { NewsWidget } from "@/components/news/news-widget"
import { useState } from "react"
import { NewsModule } from "@/components/news/news-module"
import { OptimizedImage } from "@/components/ui/optimized-image"
import { ImagePreloader } from "@/components/ui/image-preloader"
import { FeaturedGameCarousel } from "@/components/featured-game-carousel"
import type { GameData } from "@/types/game-data"

export function Dashboard() {
  const [showNewsModule, setShowNewsModule] = useState(false)

  // Featured games data
  const featuredGames: GameData[] = [
    {
      id: "starfield",
      title: "Starfield",
      developer: "Bethesda Game Studios",
      publisher: "Bethesda Softworks",
      releaseDate: "2023-09-06",
      lastPlayed: "",
      totalPlaytime: "",
      description: "Embark on an epic journey through the stars in Bethesda's newest space RPG.",
      genres: ["RPG", "Adventure", "Sci-Fi"],
      features: ["Open World", "Character Customization", "Space Exploration"],
      platforms: ["PC", "Xbox Series X/S"],
      image: "/neon-cityscape.png",
      headerImage: "/cyberpunk-header.png",
      screenshots: ["/cyberpunk-screenshot-1.png", "/cyberpunk-screenshot-2.png"],
      rating: 4.5,
      ratingCount: 12500,
      statistics: {
        averagePlaytime: "45h",
        completionRate: 32,
        difficultyRating: 3,
        replayValue: 4,
        popularityRank: 2,
      },
      achievements: {
        total: 50,
        unlocked: 0,
        recent: [],
      },
      friends: [],
      dlc: [],
      systemRequirements: {
        minimum: {
          os: "Windows 10",
          cpu: "Intel Core i5-8400 / AMD Ryzen 5 2600X",
          gpu: "NVIDIA GTX 1070 / AMD RX 5700",
          ram: "16 GB",
          storage: "125 GB",
        },
        recommended: {
          os: "Windows 10/11",
          cpu: "Intel Core i7-10700K / AMD Ryzen 7 5800X",
          gpu: "NVIDIA RTX 3080 / AMD RX 6800 XT",
          ram: "32 GB",
          storage: "125 GB SSD",
        },
      },
    },
    {
      id: "cyberpunk",
      title: "Cyberpunk 2077",
      developer: "CD Projekt RED",
      publisher: "CD Projekt",
      releaseDate: "2020-12-10",
      lastPlayed: "2 hours ago",
      totalPlaytime: "120h",
      description:
        "An open-world, action-adventure story set in Night City, a megalopolis obsessed with power, glamour and body modification.",
      genres: ["RPG", "Action", "Open World"],
      features: ["First-Person", "Character Customization", "Multiple Endings"],
      platforms: ["PC", "PlayStation", "Xbox"],
      image: "/neon-cityscape.png",
      headerImage: "/cyberpunk-header.png",
      screenshots: [
        "/cyberpunk-screenshot-1.png",
        "/cyberpunk-screenshot-2.png",
        "/cyberpunk-screenshot-3.png",
        "/cyberpunk-screenshot-4.png",
      ],
      rating: 4.2,
      ratingCount: 45000,
      statistics: {
        averagePlaytime: "60h",
        completionRate: 45,
        difficultyRating: 3,
        replayValue: 4,
        popularityRank: 5,
      },
      achievements: {
        total: 45,
        unlocked: 28,
        recent: [],
      },
      friends: [],
      dlc: [
        {
          id: "dlc1",
          name: "Phantom Liberty",
          price: "$29.99",
          image: "/cyberpunk-dlc-1.png",
          installed: true,
        },
      ],
      systemRequirements: {
        minimum: {
          os: "Windows 10",
          cpu: "Intel Core i5-3570K / AMD FX-8310",
          gpu: "NVIDIA GTX 970 / AMD Radeon RX 470",
          ram: "8 GB",
          storage: "70 GB",
        },
        recommended: {
          os: "Windows 10",
          cpu: "Intel Core i7-4790 / AMD Ryzen 3 3200G",
          gpu: "NVIDIA RTX 2060 / AMD Radeon RX 5700 XT",
          ram: "12 GB",
          storage: "70 GB SSD",
        },
      },
    },
    {
      id: "elden-ring",
      title: "Elden Ring",
      developer: "FromSoftware",
      publisher: "Bandai Namco",
      releaseDate: "2022-02-25",
      lastPlayed: "Yesterday",
      totalPlaytime: "85h",
      description:
        "A new fantasy action-RPG from the creators of Dark Souls, set in a vast world filled with wonder and peril.",
      genres: ["RPG", "Action", "Open World"],
      features: ["Third-Person", "Character Customization", "Challenging Combat"],
      platforms: ["PC", "PlayStation", "Xbox"],
      image: "/enchanted-forest-quest.png",
      headerImage: "/elden-ring-header.png",
      screenshots: ["/elden-ring-screenshot-1.png", "/elden-ring-screenshot-2.png", "/elden-ring-screenshot-3.png"],
      rating: 4.8,
      ratingCount: 60000,
      statistics: {
        averagePlaytime: "70h",
        completionRate: 35,
        difficultyRating: 5,
        replayValue: 5,
        popularityRank: 1,
      },
      achievements: {
        total: 42,
        unlocked: 18,
        recent: [],
      },
      friends: [],
      dlc: [
        {
          id: "dlc1",
          name: "Shadow of the Erdtree",
          price: "$39.99",
          image: "/elden-ring-dlc-1.png",
          installed: false,
        },
      ],
      systemRequirements: {
        minimum: {
          os: "Windows 10",
          cpu: "Intel Core i5-8400 / AMD Ryzen 3 3300X",
          gpu: "NVIDIA GTX 1060 / AMD Radeon RX 580",
          ram: "12 GB",
          storage: "60 GB",
        },
        recommended: {
          os: "Windows 10/11",
          cpu: "Intel Core i7-8700K / AMD Ryzen 5 3600X",
          gpu: "NVIDIA GTX 1070 / AMD Radeon RX Vega 56",
          ram: "16 GB",
          storage: "60 GB SSD",
        },
      },
    },
  ]

  const recentGames = [
    { id: "game1", title: "Cyberpunk 2077", lastPlayed: "2 hours ago", image: "/neon-cityscape.png", progress: 65 },
    { id: "game2", title: "Elden Ring", lastPlayed: "Yesterday", image: "/enchanted-forest-quest.png", progress: 42 },
    { id: "game3", title: "Hades", lastPlayed: "3 days ago", image: "/dungeon-crawler-scene.png", progress: 89 },
  ]

  const friends = [
    { id: "friend1", name: "Alex", status: "Online", game: "Destiny 2" },
    { id: "friend2", name: "Taylor", status: "Offline", lastSeen: "3h ago" },
    { id: "friend3", name: "Jordan", status: "Online", game: "Apex Legends" },
  ]

  const achievements = [
    { id: "ach1", title: "Master Explorer", game: "Elden Ring", date: "Today", icon: "/achievement-icon-1.png" },
    { id: "ach2", title: "Legendary Warrior", game: "God of War", date: "Yesterday", icon: "/achievement-icon-2.png" },
  ]

  // Critical images to preload
  const criticalImages = [
    ...featuredGames.map((game) => game.headerImage || game.image),
    recentGames[0].image,
    achievements[0].icon,
  ]

  // Handle view all news
  const handleViewAllNews = () => {
    setShowNewsModule(true)
  }

  // Handle back from news module
  const handleBackFromNews = () => {
    setShowNewsModule(false)
  }

  // If showing news module, render it
  if (showNewsModule) {
    return <NewsModule userGames={["game1", "game2", "game3"]} onBack={handleBackFromNews} />
  }

  return (
    <div className="space-y-8">
      {/* Preload critical images */}
      <ImagePreloader images={criticalImages} />

      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">
          <span className="gradient-text">Welcome Back</span>
        </h1>
        <div className="text-muted-foreground">
          <Clock className="inline-block mr-2" size={16} />
          <span>Last login: Today at 2:30 PM</span>
        </div>
      </div>

      {/* Featured Game Carousel */}
      <FeaturedGameCarousel games={featuredGames} interval={6000} autoPlay={true} />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Recent Games */}
        <div className="lg:col-span-2">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-semibold flex items-center">
              <Clock className="mr-2" size={18} />
              Recent Games
            </h2>
            <button className="text-primary hover:text-primary/80 text-sm font-medium">View All</button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {recentGames.map((game) => (
              <FocusableItem key={game.id} focusKey={`game-${game.id}`} className="game-card">
                <Card className="overflow-hidden bg-card border-border h-full">
                  <div className="relative">
                    <OptimizedImage
                      src={game.image}
                      alt={game.title}
                      className="w-full h-40 object-cover"
                      fallbackSrc={`/placeholder.svg?width=400&height=160&query=${game.title} game`}
                      preload={game.id === "game1"} // Only preload the first game
                    />
                    <div className="absolute bottom-0 left-0 right-0 h-1 bg-muted">
                      <div className="h-full bg-primary" style={{ width: `${game.progress}%` }}></div>
                    </div>
                  </div>
                  <div className="p-4">
                    <h3 className="font-bold">{game.title}</h3>
                    <div className="flex justify-between items-center mt-1">
                      <p className="text-sm text-muted-foreground">Last played: {game.lastPlayed}</p>
                      <span className="text-xs font-medium bg-muted px-2 py-1 rounded-full">{game.progress}%</span>
                    </div>
                  </div>
                </Card>
              </FocusableItem>
            ))}
          </div>
        </div>

        {/* Right Column */}
        <div className="space-y-6">
          {/* Game News Widget */}
          <NewsWidget gameIds={["game1", "game2", "game3"]} maxItems={3} onViewAllNews={handleViewAllNews} />

          {/* Friends Activity */}
          <div>
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-semibold flex items-center">
                <TrendingUp className="mr-2" size={18} />
                Friends Activity
              </h2>
              <button className="text-primary hover:text-primary/80 text-sm font-medium">View All</button>
            </div>

            <div className="bg-card rounded-xl border border-border overflow-hidden">
              {friends.map((friend, index) => (
                <FocusableItem
                  key={friend.id}
                  focusKey={`friend-${friend.id}`}
                  className={`p-3 hover:bg-muted/50 transition-colors ${
                    index !== friends.length - 1 ? "border-b border-border" : ""
                  }`}
                >
                  <div className="flex items-center">
                    <div className="w-10 h-10 rounded-full bg-gradient-to-br from-primary to-secondary flex items-center justify-center mr-3 text-white font-bold">
                      {friend.name.charAt(0)}
                    </div>
                    <div>
                      <h3 className="font-medium">{friend.name}</h3>
                      <p className="text-sm text-muted-foreground">
                        {friend.status === "Online" ? `Playing ${friend.game}` : `Last seen ${friend.lastSeen}`}
                      </p>
                    </div>
                    <div
                      className={`ml-auto w-3 h-3 rounded-full ${
                        friend.status === "Online" ? "bg-green-500" : "bg-gray-500"
                      }`}
                    />
                  </div>
                </FocusableItem>
              ))}
            </div>
          </div>

          {/* Recent Achievements */}
          <div>
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-semibold flex items-center">
                <Star className="mr-2" size={18} />
                Recent Achievements
              </h2>
            </div>

            <div className="bg-card rounded-xl border border-border overflow-hidden">
              {achievements.map((achievement, index) => (
                <FocusableItem
                  key={achievement.id}
                  focusKey={`achievement-${achievement.id}`}
                  className={`p-3 hover:bg-muted/50 transition-colors ${
                    index !== achievements.length - 1 ? "border-b border-border" : ""
                  }`}
                >
                  <div className="flex items-center">
                    <div className="w-10 h-10 rounded-lg bg-muted flex items-center justify-center mr-3 overflow-hidden">
                      <OptimizedImage
                        src={achievement.icon}
                        alt={achievement.title}
                        width={32}
                        height={32}
                        fallbackSrc="/golden-trophy-star.png"
                      />
                    </div>
                    <div>
                      <h3 className="font-medium">{achievement.title}</h3>
                      <p className="text-sm text-muted-foreground">
                        {achievement.game} • {achievement.date}
                      </p>
                    </div>
                  </div>
                </FocusableItem>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
