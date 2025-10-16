export type ProductType = "game" | "indie-game" | "mod" | "accessory" | "merchandise"

export interface ProductCategory {
  id: string
  name: string
  slug: string
  type: ProductType
}

export interface ProductTag {
  id: string
  name: string
}

export interface ProductRating {
  average: number
  count: number
}

export interface ProductPrice {
  current: number
  original?: number
  discount?: number
  currency: string
}

export interface ProductImage {
  id: string
  url: string
  alt?: string
}

export interface ProductVariant {
  id: string
  name: string
  price: ProductPrice
  attributes: Record<string, string>
  inStock: boolean
}

export interface Product {
  id: string
  type: ProductType
  name: string
  slug: string
  description: string
  shortDescription: string
  price: ProductPrice
  rating: ProductRating
  images: ProductImage[]
  thumbnail: string
  categories: ProductCategory[]
  tags: ProductTag[]
  releaseDate?: string
  publisher?: string
  developer?: string
  platforms?: string[]
  features?: string[]
  variants?: ProductVariant[]
  inStock: boolean
  isNew: boolean
  isFeatured: boolean
}

export interface StoreFilter {
  search?: string
  categories?: string[]
  tags?: string[]
  priceRange?: [number, number]
  sortBy?: "popular" | "recent" | "price-low" | "price-high" | "rating"
  productType?: ProductType | ProductType[]
}
