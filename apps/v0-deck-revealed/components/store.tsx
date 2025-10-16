"use client"

import type React from "react"

import { useState } from "react"
import { FocusableItem } from "@/components/ui/focusable-item"
import { Card } from "@/components/ui/card"
import {
  ShoppingCart,
  Tag,
  Star,
  TrendingUp,
  Clock,
  Gamepad2,
  Cpu,
  Shirt,
  Package,
  Search,
  Grid,
  List,
  ChevronDown,
} from "lucide-react"
import { useStore } from "@/hooks/use-store"
import { ModManager } from "@/components/mods/mod-manager"
import type { ProductType } from "@/types/store"

export function Store() {
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid")
  const [activeCategory, setActiveCategory] = useState<ProductType | "all">("all")
  const [searchTerm, setSearchTerm] = useState("")
  const [view, setView] = useState<"store" | "mods" | "product-detail">("store")
  const [selectedProductId, setSelectedProductId] = useState<string | null>(null)

  const { products, loading, updateFilter, addToCart } = useStore()

  // Filter products based on active category
  const filteredProducts =
    activeCategory === "all" ? products : products.filter((product) => product.type === activeCategory)

  // Get featured products
  const featuredProducts = products.filter((product) => product.isFeatured).slice(0, 2)

  // Get new releases
  const newReleases = products.filter((product) => product.isNew).slice(0, 3)

  // Get special offers (products with discounts)
  const onSale = products.filter((product) => product.price.discount).slice(0, 3)

  // Handle search input
  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value
    setSearchTerm(value)
    updateFilter({ search: value })
  }

  // Handle category change
  const handleCategoryChange = (category: ProductType | "all") => {
    setActiveCategory(category)
    if (category === "all") {
      updateFilter({ productType: undefined })
    } else {
      updateFilter({ productType: category })
    }
  }

  // Handle product selection
  const handleSelectProduct = (productId: string) => {
    setSelectedProductId(productId)
    setView("product-detail")
  }

  // Handle back to store
  const handleBackToStore = () => {
    setSelectedProductId(null)
    setView("store")
  }

  // Handle open mods
  const handleOpenMods = () => {
    setView("mods")
  }

  // Format price
  const formatPrice = (price: number, currency = "USD") => {
    return new Intl.NumberFormat("en-US", { style: "currency", currency }).format(price)
  }

  // If in mods view, show the mod manager
  if (view === "mods") {
    return <ModManager onBack={handleBackToStore} />
  }

  // If in product detail view, show the product detail
  if (view === "product-detail" && selectedProductId) {
    const product = products.find((p) => p.id === selectedProductId)
    if (!product) return null

    // In a real app, this would be a separate component
    return (
      <div className="space-y-6">
        <FocusableItem
          focusKey="back-to-store"
          className="inline-flex items-center text-muted-foreground hover:text-foreground mb-4 transition-colors"
          onClick={handleBackToStore}
        >
          <ChevronDown className="mr-1 rotate-90" size={18} />
          <span>Back to Store</span>
        </FocusableItem>

        <div className="text-center p-8">
          <h2 className="text-2xl font-bold mb-4">{product.name}</h2>
          <p>This would be a detailed product page for {product.name}.</p>
          <p className="text-muted-foreground mt-2">Product detail view is not fully implemented in this demo.</p>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-8">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <h1 className="text-3xl font-bold gradient-text">Store</h1>

        <div className="flex flex-wrap gap-2">
          <div className="relative flex-grow max-w-xs">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
            <input
              type="text"
              placeholder="Search store..."
              value={searchTerm}
              onChange={handleSearch}
              className="w-full bg-card border border-border text-foreground rounded-lg py-2 pl-10 pr-4 focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all"
            />
          </div>

          <div className="flex bg-card rounded-lg overflow-hidden border border-border">
            <FocusableItem
              focusKey="view-grid-store"
              className={`p-2 ${viewMode === "grid" ? "bg-primary text-white" : "text-muted-foreground hover:text-foreground"}`}
              onClick={() => setViewMode("grid")}
            >
              <Grid className="w-5 h-5" />
            </FocusableItem>

            <FocusableItem
              focusKey="view-list-store"
              className={`p-2 ${viewMode === "list" ? "bg-primary text-white" : "text-muted-foreground hover:text-foreground"}`}
              onClick={() => setViewMode("list")}
            >
              <List className="w-5 h-5" />
            </FocusableItem>
          </div>
        </div>
      </div>

      {/* Category tabs */}
      <div className="flex overflow-x-auto scrollbar-thin border-b border-border">
        {[
          { id: "all", label: "All Products", icon: Package },
          { id: "game", label: "Games", icon: Gamepad2 },
          { id: "indie-game", label: "Indie Games", icon: Gamepad2 },
          { id: "mod", label: "Mods", icon: Cpu },
          { id: "accessory", label: "Accessories", icon: Gamepad2 },
          { id: "merchandise", label: "Merchandise", icon: Shirt },
        ].map((category) => (
          <FocusableItem
            key={category.id}
            focusKey={`category-${category.id}`}
            className={`px-4 py-3 font-medium whitespace-nowrap transition-colors flex items-center cursor-pointer ${
              activeCategory === category.id
                ? "text-primary border-b-2 border-primary -mb-[2px]"
                : "text-muted-foreground hover:text-foreground"
            }`}
            onClick={() => handleCategoryChange(category.id as any)}
          >
            <category.icon className="w-4 h-4 mr-2" />
            {category.label}
          </FocusableItem>
        ))}
      </div>

      {/* Mods button */}
      {activeCategory === "mod" && (
        <div className="flex justify-end">
          <FocusableItem
            focusKey="browse-mods"
            className="bg-primary hover:bg-primary/90 text-white px-4 py-2 rounded-lg font-medium transition-all flex items-center gap-2"
            onClick={handleOpenMods}
          >
            <Cpu size={16} />
            <span>Mod Manager</span>
          </FocusableItem>
        </div>
      )}

      {/* Featured Products */}
      {(activeCategory === "all" || activeCategory === "game" || activeCategory === "indie-game") && (
        <section>
          <h2 className="text-xl font-semibold mb-6 flex items-center">
            <TrendingUp className="mr-2" size={20} />
            Featured Games
          </h2>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {featuredProducts.map((product) => (
              <FocusableItem
                key={product.id}
                focusKey={`featured-${product.id}`}
                className="game-card"
                onClick={() => handleSelectProduct(product.id)}
              >
                <Card className="overflow-hidden bg-card border-border h-full">
                  <div className="relative">
                    <img
                      src={product.thumbnail || "/placeholder.svg"}
                      alt={product.name}
                      className="w-full h-48 object-cover"
                    />
                    <div className="absolute top-0 left-0 m-3">
                      <span className="bg-secondary/90 backdrop-blur-sm text-white text-xs font-bold px-2 py-1 rounded-md">
                        {product.isNew ? "New Release" : "Featured"}
                      </span>
                    </div>
                  </div>
                  <div className="p-4">
                    <div className="flex justify-between items-start mb-2">
                      <h3 className="font-bold text-lg">{product.name}</h3>
                      <div className="flex items-center bg-muted/50 px-2 py-1 rounded-full">
                        <Star className="w-3 h-3 text-secondary fill-secondary mr-1" />
                        <span className="text-xs font-medium">{product.rating.average}</span>
                      </div>
                    </div>

                    <p className="text-sm text-muted-foreground mb-4">{product.shortDescription}</p>

                    <div className="flex justify-between items-center">
                      <span className="font-bold text-lg">{formatPrice(product.price.current)}</span>
                      <button
                        className="bg-primary hover:bg-primary/90 text-white px-4 py-2 rounded-lg font-medium transition-all flex items-center btn-hover-effect"
                        onClick={(e) => {
                          e.stopPropagation()
                          addToCart(product.id)
                        }}
                      >
                        <ShoppingCart className="w-4 h-4 mr-2" />
                        Buy Now
                      </button>
                    </div>
                  </div>
                </Card>
              </FocusableItem>
            ))}
          </div>
        </section>
      )}

      {/* New Releases */}
      <section>
        <h2 className="text-xl font-semibold mb-6 flex items-center">
          <Clock className="mr-2" size={20} />
          {activeCategory === "all"
            ? "New Releases"
            : `New ${activeCategory === "indie-game" ? "Indie Games" : activeCategory === "mod" ? "Mods" : activeCategory === "accessory" ? "Accessories" : activeCategory === "merchandise" ? "Merchandise" : "Games"}`}
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {newReleases.map((product) => (
            <FocusableItem
              key={product.id}
              focusKey={`new-${product.id}`}
              className="game-card"
              onClick={() => handleSelectProduct(product.id)}
            >
              <Card className="overflow-hidden bg-card border-border h-full">
                <div className="relative">
                  <img
                    src={product.thumbnail || "/placeholder.svg"}
                    alt={product.name}
                    className="w-full h-40 object-cover"
                  />
                  <div className="absolute bottom-0 left-0 m-2">
                    <span className="bg-muted/80 backdrop-blur-sm text-xs px-2 py-1 rounded-full">
                      {product.categories[0]?.name || product.type}
                    </span>
                  </div>
                </div>
                <div className="p-4">
                  <div className="flex justify-between items-center mb-2">
                    <h3 className="font-bold">{product.name}</h3>
                    <div className="flex items-center">
                      <Star className="w-3 h-3 text-secondary fill-secondary mr-1" />
                      <span className="text-xs font-medium">{product.rating.average}</span>
                    </div>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="font-bold">{formatPrice(product.price.current)}</span>
                    <button
                      className="bg-primary/90 hover:bg-primary text-white px-3 py-1 rounded-lg text-sm font-medium transition-all"
                      onClick={(e) => {
                        e.stopPropagation()
                        addToCart(product.id)
                      }}
                    >
                      Add to Cart
                    </button>
                  </div>
                </div>
              </Card>
            </FocusableItem>
          ))}
        </div>
      </section>

      {/* Special Offers */}
      {onSale.length > 0 && (
        <section>
          <h2 className="text-xl font-semibold mb-6 flex items-center">
            <Tag className="mr-2" size={20} />
            Special Offers
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {onSale.map((product) => (
              <FocusableItem
                key={product.id}
                focusKey={`sale-${product.id}`}
                className="game-card"
                onClick={() => handleSelectProduct(product.id)}
              >
                <Card className="overflow-hidden bg-card border-border h-full">
                  <div className="relative">
                    <img
                      src={product.thumbnail || "/placeholder.svg"}
                      alt={product.name}
                      className="w-full h-40 object-cover"
                    />
                    <div className="absolute top-0 right-0 m-2">
                      <div className="bg-secondary text-white px-2 py-1 text-xs font-bold rounded-md flex items-center">
                        <span>-{product.price.discount}%</span>
                      </div>
                    </div>
                    <div className="absolute bottom-0 left-0 m-2">
                      <span className="bg-muted/80 backdrop-blur-sm text-xs px-2 py-1 rounded-full">
                        {product.categories[0]?.name || product.type}
                      </span>
                    </div>
                  </div>
                  <div className="p-4">
                    <div className="flex justify-between items-center mb-2">
                      <h3 className="font-bold">{product.name}</h3>
                      <div className="flex items-center">
                        <Star className="w-3 h-3 text-secondary fill-secondary mr-1" />
                        <span className="text-xs font-medium">{product.rating.average}</span>
                      </div>
                    </div>
                    <div className="flex justify-between items-center">
                      <div>
                        <span className="font-bold">{formatPrice(product.price.current)}</span>
                        <span className="block text-sm text-muted-foreground line-through">
                          {formatPrice(product.price.original || 0)}
                        </span>
                      </div>
                      <button
                        className="bg-primary/90 hover:bg-primary text-white px-3 py-1 rounded-lg text-sm font-medium transition-all"
                        onClick={(e) => {
                          e.stopPropagation()
                          addToCart(product.id)
                        }}
                      >
                        Add to Cart
                      </button>
                    </div>
                  </div>
                </Card>
              </FocusableItem>
            ))}
          </div>
        </section>
      )}

      {/* All Products */}
      <section>
        <h2 className="text-xl font-semibold mb-6 flex items-center">
          <Package className="mr-2" size={20} />
          {activeCategory === "all"
            ? "All Products"
            : `All ${activeCategory === "indie-game" ? "Indie Games" : activeCategory === "mod" ? "Mods" : activeCategory === "accessory" ? "Accessories" : activeCategory === "merchandise" ? "Merchandise" : "Games"}`}
        </h2>

        {loading ? (
          <div className="flex items-center justify-center h-64">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
          </div>
        ) : filteredProducts.length === 0 ? (
          <div className="bg-card border border-border rounded-xl p-8 text-center">
            <h3 className="font-semibold mb-2">No products found</h3>
            <p className="text-muted-foreground">Try adjusting your search or filters</p>
          </div>
        ) : viewMode === "grid" ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {filteredProducts.map((product) => (
              <FocusableItem
                key={product.id}
                focusKey={`product-${product.id}`}
                className="game-card"
                onClick={() => handleSelectProduct(product.id)}
              >
                <Card className="overflow-hidden bg-card border-border h-full">
                  <div className="relative">
                    <img
                      src={product.thumbnail || "/placeholder.svg"}
                      alt={product.name}
                      className="w-full h-40 object-cover"
                    />
                    {product.price.discount && (
                      <div className="absolute top-0 right-0 m-2">
                        <div className="bg-secondary text-white px-2 py-1 text-xs font-bold rounded-md flex items-center">
                          <span>-{product.price.discount}%</span>
                        </div>
                      </div>
                    )}
                    {product.isNew && (
                      <div className="absolute top-0 left-0 m-2">
                        <span className="bg-primary/90 text-white text-xs font-bold px-2 py-1 rounded-md">New</span>
                      </div>
                    )}
                  </div>
                  <div className="p-4">
                    <div className="flex justify-between items-center mb-1">
                      <h3 className="font-bold">{product.name}</h3>
                      {product.rating.average > 0 && (
                        <div className="flex items-center">
                          <Star className="w-3 h-3 text-secondary fill-secondary mr-1" />
                          <span className="text-xs font-medium">{product.rating.average}</span>
                        </div>
                      )}
                    </div>
                    <p className="text-xs text-muted-foreground mb-2">
                      {product.type === "game" || product.type === "indie-game"
                        ? product.developer
                        : product.type === "mod"
                          ? "Mod"
                          : product.categories[0]?.name}
                    </p>
                    <div className="flex justify-between items-center mt-2">
                      <div>
                        <span className="font-bold">{formatPrice(product.price.current)}</span>
                        {product.price.original && (
                          <span className="block text-xs text-muted-foreground line-through">
                            {formatPrice(product.price.original)}
                          </span>
                        )}
                      </div>
                      <button
                        className="bg-primary/90 hover:bg-primary text-white px-3 py-1 rounded-lg text-sm font-medium transition-all"
                        onClick={(e) => {
                          e.stopPropagation()
                          addToCart(product.id)
                        }}
                      >
                        {product.price.current === 0 ? "Get" : "Add"}
                      </button>
                    </div>
                  </div>
                </Card>
              </FocusableItem>
            ))}
          </div>
        ) : (
          <div className="space-y-2">
            {filteredProducts.map((product) => (
              <FocusableItem
                key={product.id}
                focusKey={`product-list-${product.id}`}
                className="hover:bg-card/80 rounded-xl border border-border transition-all"
                onClick={() => handleSelectProduct(product.id)}
              >
                <div className="flex items-center p-3">
                  <img
                    src={product.thumbnail || "/placeholder.svg"}
                    alt={product.name}
                    className="w-16 h-16 object-cover rounded-lg mr-4"
                  />
                  <div className="flex-grow">
                    <div className="flex items-center">
                      <h3 className="font-bold">{product.name}</h3>
                      {product.rating.average > 0 && (
                        <div className="flex items-center ml-2">
                          <Star className="w-3 h-3 text-secondary fill-secondary mr-1" />
                          <span className="text-xs font-medium">{product.rating.average}</span>
                        </div>
                      )}
                      {product.isNew && (
                        <span className="ml-2 bg-primary/20 text-primary text-xs px-2 py-0.5 rounded-full">New</span>
                      )}
                    </div>
                    <p className="text-sm text-muted-foreground">{product.shortDescription}</p>
                  </div>
                  <div className="flex items-center gap-3">
                    <div>
                      <span className="font-bold whitespace-nowrap">{formatPrice(product.price.current)}</span>
                      {product.price.original && (
                        <span className="block text-xs text-muted-foreground line-through">
                          {formatPrice(product.price.original)}
                        </span>
                      )}
                    </div>
                    <button
                      className="bg-primary/90 hover:bg-primary text-white px-3 py-1 rounded-lg text-sm font-medium transition-all"
                      onClick={(e) => {
                        e.stopPropagation()
                        addToCart(product.id)
                      }}
                    >
                      {product.price.current === 0 ? "Get" : "Add to Cart"}
                    </button>
                  </div>
                </div>
              </FocusableItem>
            ))}
          </div>
        )}
      </section>
    </div>
  )
}
