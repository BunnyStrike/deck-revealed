"use client"

import { useState, useEffect, useCallback } from "react"
import type { Product, StoreFilter } from "@/types/store"

// Sample store data
const sampleProducts: Product[] = [
  // Games
  {
    id: "product1",
    type: "game",
    name: "Starfield",
    slug: "starfield",
    description: "Embark on an epic journey through the stars in Bethesda's newest space RPG.",
    shortDescription: "Bethesda's epic space RPG",
    price: {
      current: 59.99,
      currency: "USD",
    },
    rating: {
      average: 4.5,
      count: 1253,
    },
    images: [
      { id: "img1", url: "/nebula-explorer.png", alt: "Starfield gameplay" },
      { id: "img2", url: "/nebula-explorer.png", alt: "Starfield screenshot" },
    ],
    thumbnail: "/nebula-explorer.png",
    categories: [
      { id: "cat1", name: "RPG", slug: "rpg", type: "game" },
      { id: "cat2", name: "Open World", slug: "open-world", type: "game" },
    ],
    tags: [
      { id: "tag1", name: "Space" },
      { id: "tag2", name: "Exploration" },
    ],
    releaseDate: "2023-09-06",
    publisher: "Bethesda Softworks",
    developer: "Bethesda Game Studios",
    platforms: ["PC", "Xbox Series X/S"],
    features: ["Single-player", "Controller Support", "Cloud Saves", "Achievements"],
    inStock: true,
    isNew: true,
    isFeatured: true,
  },
  {
    id: "product2",
    type: "game",
    name: "Diablo IV",
    slug: "diablo-iv",
    description: "Lilith has returned to Sanctuary. Answer the darkness with fire and lightning.",
    shortDescription: "The latest entry in the Diablo series",
    price: {
      current: 69.99,
      currency: "USD",
    },
    rating: {
      average: 4.2,
      count: 987,
    },
    images: [{ id: "img3", url: "/cursed-knight-vigil.png", alt: "Diablo IV gameplay" }],
    thumbnail: "/cursed-knight-vigil.png",
    categories: [
      { id: "cat3", name: "Action RPG", slug: "action-rpg", type: "game" },
      { id: "cat4", name: "Multiplayer", slug: "multiplayer", type: "game" },
    ],
    tags: [
      { id: "tag3", name: "Dark Fantasy" },
      { id: "tag4", name: "Hack and Slash" },
    ],
    releaseDate: "2023-06-06",
    publisher: "Blizzard Entertainment",
    developer: "Blizzard Entertainment",
    platforms: ["PC", "PlayStation 5", "Xbox Series X/S", "PlayStation 4", "Xbox One"],
    features: ["Online Multiplayer", "Co-op", "Controller Support", "Cloud Saves", "Achievements"],
    inStock: true,
    isNew: true,
    isFeatured: true,
  },

  // Indie Games
  {
    id: "product3",
    type: "indie-game",
    name: "Hollow Knight: Silksong",
    slug: "hollow-knight-silksong",
    description:
      "Play as Hornet, princess-protector of Hallownest, and adventure through a whole new kingdom ruled by silk and song!",
    shortDescription: "The epic sequel to Hollow Knight",
    price: {
      current: 29.99,
      currency: "USD",
    },
    rating: {
      average: 0,
      count: 0,
    },
    images: [{ id: "img4", url: "/hornet-aerial.png", alt: "Hollow Knight: Silksong" }],
    thumbnail: "/hornet-aerial.png",
    categories: [
      { id: "cat5", name: "Metroidvania", slug: "metroidvania", type: "indie-game" },
      { id: "cat6", name: "Platformer", slug: "platformer", type: "indie-game" },
    ],
    tags: [
      { id: "tag5", name: "2D" },
      { id: "tag6", name: "Difficult" },
    ],
    releaseDate: "Coming Soon",
    publisher: "Team Cherry",
    developer: "Team Cherry",
    platforms: ["PC", "Nintendo Switch", "PlayStation 5", "Xbox Series X/S"],
    features: ["Single-player", "Controller Support", "Achievements"],
    inStock: false,
    isNew: true,
    isFeatured: true,
  },
  {
    id: "product4",
    type: "indie-game",
    name: "Stardew Valley",
    slug: "stardew-valley",
    description:
      "You've inherited your grandfather's old farm plot in Stardew Valley. Armed with hand-me-down tools and a few coins, you set out to begin your new life.",
    shortDescription: "Build the farm of your dreams",
    price: {
      current: 14.99,
      currency: "USD",
    },
    rating: {
      average: 4.9,
      count: 3254,
    },
    images: [{ id: "img5", url: "/thriving-valley-farm.png", alt: "Stardew Valley farm" }],
    thumbnail: "/stardew-farm-life.png",
    categories: [
      { id: "cat7", name: "Simulation", slug: "simulation", type: "indie-game" },
      { id: "cat8", name: "RPG", slug: "rpg", type: "indie-game" },
    ],
    tags: [
      { id: "tag7", name: "Farming" },
      { id: "tag8", name: "Life Sim" },
    ],
    releaseDate: "2016-02-26",
    publisher: "ConcernedApe",
    developer: "ConcernedApe",
    platforms: ["PC", "Nintendo Switch", "PlayStation 4", "Xbox One", "Mobile"],
    features: ["Single-player", "Multiplayer", "Controller Support", "Cloud Saves"],
    inStock: true,
    isNew: false,
    isFeatured: false,
  },

  // Mods
  {
    id: "product5",
    type: "mod",
    name: "Enhanced Graphics Overhaul",
    slug: "enhanced-graphics-overhaul",
    description:
      "This mod completely overhauls the graphics of Cyberpunk 2077, enhancing lighting, textures, and visual effects for a more immersive experience.",
    shortDescription: "Complete graphics overhaul for Cyberpunk 2077",
    price: {
      current: 0,
      currency: "USD",
    },
    rating: {
      average: 4.8,
      count: 1253,
    },
    images: [{ id: "img6", url: "/neon-cityscape-enhanced.png", alt: "Enhanced graphics mod" }],
    thumbnail: "/placeholder.svg?height=300&width=300&query=cyberpunk 2077 mod",
    categories: [
      { id: "cat9", name: "Graphics", slug: "graphics", type: "mod" },
      { id: "cat10", name: "Cyberpunk 2077", slug: "cyberpunk-2077", type: "mod" },
    ],
    tags: [
      { id: "tag9", name: "Visual" },
      { id: "tag10", name: "Performance" },
    ],
    inStock: true,
    isNew: true,
    isFeatured: false,
  },
  {
    id: "product6",
    type: "mod",
    name: "Elden Rebalanced",
    slug: "elden-rebalanced",
    description:
      "A comprehensive balance overhaul for Elden Ring that adjusts enemy stats, weapon damage, and player progression.",
    shortDescription: "Complete game balance overhaul for Elden Ring",
    price: {
      current: 0,
      currency: "USD",
    },
    rating: {
      average: 4.9,
      count: 2105,
    },
    images: [{ id: "img7", url: "/placeholder.svg?height=400&width=600&query=elden ring mod", alt: "Elden Ring mod" }],
    thumbnail: "/placeholder.svg?height=300&width=300&query=elden ring mod",
    categories: [
      { id: "cat11", name: "Gameplay", slug: "gameplay", type: "mod" },
      { id: "cat12", name: "Elden Ring", slug: "elden-ring", type: "mod" },
    ],
    tags: [
      { id: "tag11", name: "Balance" },
      { id: "tag12", name: "Difficulty" },
    ],
    inStock: true,
    isNew: false,
    isFeatured: true,
  },

  // Accessories
  {
    id: "product7",
    type: "accessory",
    name: "Pro Gaming Controller",
    slug: "pro-gaming-controller",
    description:
      "Take your gaming to the next level with this professional-grade controller featuring customizable buttons, adjustable triggers, and premium build quality.",
    shortDescription: "Premium controller with customizable features",
    price: {
      current: 149.99,
      original: 179.99,
      discount: 17,
      currency: "USD",
    },
    rating: {
      average: 4.7,
      count: 532,
    },
    images: [
      {
        id: "img8",
        url: "/placeholder.svg?height=400&width=600&query=pro gaming controller",
        alt: "Pro gaming controller",
      },
    ],
    thumbnail: "/placeholder.svg?height=300&width=300&query=gaming controller",
    categories: [
      { id: "cat13", name: "Controllers", slug: "controllers", type: "accessory" },
      { id: "cat14", name: "Premium", slug: "premium", type: "accessory" },
    ],
    tags: [
      { id: "tag13", name: "Wireless" },
      { id: "tag14", name: "Customizable" },
    ],
    variants: [
      {
        id: "var1",
        name: "Black",
        price: {
          current: 149.99,
          original: 179.99,
          discount: 17,
          currency: "USD",
        },
        attributes: {
          color: "Black",
        },
        inStock: true,
      },
      {
        id: "var2",
        name: "White",
        price: {
          current: 149.99,
          original: 179.99,
          discount: 17,
          currency: "USD",
        },
        attributes: {
          color: "White",
        },
        inStock: true,
      },
    ],
    inStock: true,
    isNew: true,
    isFeatured: true,
  },
  {
    id: "product8",
    type: "accessory",
    name: "Gaming Headset",
    slug: "gaming-headset",
    description:
      "Immerse yourself in your games with this high-quality gaming headset featuring 7.1 surround sound, noise-cancelling microphone, and memory foam ear cushions.",
    shortDescription: "Premium gaming headset with surround sound",
    price: {
      current: 99.99,
      original: 129.99,
      discount: 23,
      currency: "USD",
    },
    rating: {
      average: 4.6,
      count: 421,
    },
    images: [{ id: "img9", url: "/placeholder.svg?height=400&width=600&query=gaming headset", alt: "Gaming headset" }],
    thumbnail: "/placeholder.svg?height=300&width=300&query=gaming headset",
    categories: [
      { id: "cat15", name: "Audio", slug: "audio", type: "accessory" },
      { id: "cat16", name: "Headsets", slug: "headsets", type: "accessory" },
    ],
    tags: [
      { id: "tag15", name: "Surround Sound" },
      { id: "tag16", name: "Microphone" },
    ],
    inStock: true,
    isNew: false,
    isFeatured: false,
  },

  // Merchandise
  {
    id: "product9",
    type: "merchandise",
    name: "Cyberpunk 2077 T-Shirt",
    slug: "cyberpunk-2077-t-shirt",
    description: "Show your love for Night City with this official Cyberpunk 2077 t-shirt featuring the iconic logo.",
    shortDescription: "Official Cyberpunk 2077 t-shirt",
    price: {
      current: 24.99,
      currency: "USD",
    },
    rating: {
      average: 4.5,
      count: 128,
    },
    images: [
      {
        id: "img10",
        url: "/placeholder.svg?height=400&width=600&query=cyberpunk 2077 t-shirt",
        alt: "Cyberpunk 2077 t-shirt",
      },
    ],
    thumbnail: "/placeholder.svg?height=300&width=300&query=cyberpunk 2077 t-shirt",
    categories: [
      { id: "cat17", name: "Clothing", slug: "clothing", type: "merchandise" },
      { id: "cat18", name: "Cyberpunk 2077", slug: "cyberpunk-2077", type: "merchandise" },
    ],
    tags: [
      { id: "tag17", name: "T-Shirt" },
      { id: "tag18", name: "Official" },
    ],
    variants: [
      {
        id: "var3",
        name: "Small",
        price: {
          current: 24.99,
          currency: "USD",
        },
        attributes: {
          size: "S",
        },
        inStock: true,
      },
      {
        id: "var4",
        name: "Medium",
        price: {
          current: 24.99,
          currency: "USD",
        },
        attributes: {
          size: "M",
        },
        inStock: true,
      },
      {
        id: "var5",
        name: "Large",
        price: {
          current: 24.99,
          currency: "USD",
        },
        attributes: {
          size: "L",
        },
        inStock: true,
      },
      {
        id: "var6",
        name: "X-Large",
        price: {
          current: 24.99,
          currency: "USD",
        },
        attributes: {
          size: "XL",
        },
        inStock: false,
      },
    ],
    inStock: true,
    isNew: false,
    isFeatured: false,
  },
  {
    id: "product10",
    type: "merchandise",
    name: "Elden Ring Statue",
    slug: "elden-ring-statue",
    description:
      "This highly detailed collectible statue features Malenia, Blade of Miquella from Elden Ring. Standing at 10 inches tall, this premium statue is perfect for any collector.",
    shortDescription: "Premium Malenia collectible statue",
    price: {
      current: 199.99,
      currency: "USD",
    },
    rating: {
      average: 4.9,
      count: 87,
    },
    images: [
      {
        id: "img11",
        url: "/placeholder.svg?height=400&width=600&query=elden ring malenia statue",
        alt: "Elden Ring statue",
      },
    ],
    thumbnail: "/placeholder.svg?height=300&width=300&query=elden ring statue",
    categories: [
      { id: "cat19", name: "Collectibles", slug: "collectibles", type: "merchandise" },
      { id: "cat20", name: "Elden Ring", slug: "elden-ring", type: "merchandise" },
    ],
    tags: [
      { id: "tag19", name: "Statue" },
      { id: "tag20", name: "Limited Edition" },
    ],
    inStock: true,
    isNew: true,
    isFeatured: true,
  },
]

export function useStore(initialFilter: StoreFilter = {}) {
  const [products, setProducts] = useState<Product[]>(sampleProducts)
  const [filteredProducts, setFilteredProducts] = useState<Product[]>(sampleProducts)
  const [filter, setFilter] = useState<StoreFilter>(initialFilter)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  // Apply filters to products
  useEffect(() => {
    setLoading(true)
    try {
      let result = [...products]

      // Filter by product type
      if (filter.productType) {
        const types = Array.isArray(filter.productType) ? filter.productType : [filter.productType]
        result = result.filter((product) => types.includes(product.type))
      }

      // Filter by search term
      if (filter.search) {
        const searchLower = filter.search.toLowerCase()
        result = result.filter(
          (product) =>
            product.name.toLowerCase().includes(searchLower) ||
            product.description.toLowerCase().includes(searchLower) ||
            product.tags.some((tag) => tag.name.toLowerCase().includes(searchLower)),
        )
      }

      // Filter by categories
      if (filter.categories && filter.categories.length > 0) {
        result = result.filter((product) =>
          product.categories.some((category) => filter.categories?.includes(category.id)),
        )
      }

      // Filter by tags
      if (filter.tags && filter.tags.length > 0) {
        result = result.filter((product) => product.tags.some((tag) => filter.tags?.includes(tag.id)))
      }

      // Filter by price range
      if (filter.priceRange) {
        const [min, max] = filter.priceRange
        result = result.filter((product) => product.price.current >= min && product.price.current <= max)
      }

      // Sort results
      if (filter.sortBy) {
        switch (filter.sortBy) {
          case "popular":
            result.sort((a, b) => b.rating.count - a.rating.count)
            break
          case "recent":
            // Sort by release date if available, otherwise by isNew flag
            result.sort((a, b) => {
              if (a.releaseDate && b.releaseDate) {
                return new Date(b.releaseDate).getTime() - new Date(a.releaseDate).getTime()
              }
              return b.isNew ? 1 : -1
            })
            break
          case "price-low":
            result.sort((a, b) => a.price.current - b.price.current)
            break
          case "price-high":
            result.sort((a, b) => b.price.current - a.price.current)
            break
          case "rating":
            result.sort((a, b) => b.rating.average - a.rating.average)
            break
        }
      }

      setFilteredProducts(result)
      setError(null)
    } catch (err) {
      setError("Failed to filter products")
      console.error(err)
    } finally {
      setLoading(false)
    }
  }, [products, filter])

  // Update filter
  const updateFilter = useCallback((newFilter: Partial<StoreFilter>) => {
    setFilter((prev) => ({ ...prev, ...newFilter }))
  }, [])

  // Add product to cart
  const addToCart = useCallback((productId: string, quantity = 1, variantId?: string) => {
    console.log(`Added product ${productId} to cart (quantity: ${quantity}, variant: ${variantId || "default"})`)
    // In a real app, this would update a cart state or call an API
  }, [])

  return {
    products: filteredProducts,
    loading,
    error,
    filter,
    updateFilter,
    addToCart,
  }
}
