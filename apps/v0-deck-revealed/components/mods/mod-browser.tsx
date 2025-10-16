"use client"

import type React from "react"

import { useState } from "react"
import { Search, Filter, SortAsc, Download, Tag, Grid, List } from "lucide-react"
import { FocusableItem } from "@/components/ui/focusable-item"
import { Card } from "@/components/ui/card"
import { useMods } from "@/hooks/use-mods"
import type { ModCategory } from "@/types/mod"

interface ModBrowserProps {
  gameId?: string
  onSelectMod: (modId: string) => void
}

export function ModBrowser({ gameId, onSelectMod }: ModBrowserProps) {
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid")
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedCategories, setSelectedCategories] = useState<string[]>([])

  const { mods, loading, updateFilter } = useMods({
    gameId,
    sortBy: "popular",
  })

  // Get all unique categories from mods
  const allCategories = mods.reduce<ModCategory[]>((acc, mod) => {
    mod.categories.forEach((category) => {
      if (!acc.some((c) => c.id === category.id)) {
        acc.push(category)
      }
    })
    return acc
  }, [])

  // Handle search input
  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value
    setSearchTerm(value)
    updateFilter({ search: value })
  }

  // Toggle category selection
  const toggleCategory = (categoryId: string) => {
    const newCategories = selectedCategories.includes(categoryId)
      ? selectedCategories.filter((id) => id !== categoryId)
      : [...selectedCategories, categoryId]

    setSelectedCategories(newCategories)
    updateFilter({ categories: newCategories.length > 0 ? newCategories : undefined })
  }

  // Format download count
  const formatDownloads = (count: number) => {
    if (count >= 1000000) {
      return `${(count / 1000000).toFixed(1)}M`
    } else if (count >= 1000) {
      return `${(count / 1000).toFixed(1)}K`
    }
    return count.toString()
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <h2 className="text-2xl font-bold">Mods {gameId ? "for this Game" : ""}</h2>

        <div className="flex flex-wrap gap-2">
          <div className="relative flex-grow">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
            <input
              type="text"
              placeholder="Search mods..."
              value={searchTerm}
              onChange={handleSearch}
              className="w-full bg-card border border-border text-foreground rounded-lg py-2 pl-10 pr-4 focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all"
            />
          </div>

          <div className="flex bg-card rounded-lg overflow-hidden border border-border">
            <FocusableItem
              focusKey="view-grid-mods"
              className={`p-2 ${viewMode === "grid" ? "bg-primary text-white" : "text-muted-foreground hover:text-foreground"}`}
              onClick={() => setViewMode("grid")}
            >
              <Grid className="w-5 h-5" />
            </FocusableItem>

            <FocusableItem
              focusKey="view-list-mods"
              className={`p-2 ${viewMode === "list" ? "bg-primary text-white" : "text-muted-foreground hover:text-foreground"}`}
              onClick={() => setViewMode("list")}
            >
              <List className="w-5 h-5" />
            </FocusableItem>
          </div>
        </div>
      </div>

      <div className="flex flex-col md:flex-row gap-6">
        {/* Categories filter sidebar */}
        <div className="w-full md:w-64 shrink-0">
          <Card className="bg-card border-border p-4 rounded-xl">
            <h3 className="font-semibold mb-3 flex items-center">
              <Filter className="w-4 h-4 mr-2" />
              Categories
            </h3>
            <div className="space-y-2">
              {allCategories.map((category) => (
                <FocusableItem
                  key={category.id}
                  focusKey={`category-${category.id}`}
                  className={`flex items-center p-2 rounded-lg transition-colors ${
                    selectedCategories.includes(category.id) ? "bg-primary/20 text-primary" : "hover:bg-muted/50"
                  }`}
                  onClick={() => toggleCategory(category.id)}
                >
                  <div
                    className={`w-4 h-4 rounded border mr-2 flex items-center justify-center ${
                      selectedCategories.includes(category.id) ? "bg-primary border-primary" : "border-muted-foreground"
                    }`}
                  >
                    {selectedCategories.includes(category.id) && <div className="w-2 h-2 bg-white rounded-sm" />}
                  </div>
                  <span className="text-sm">{category.name}</span>
                </FocusableItem>
              ))}
            </div>

            <h3 className="font-semibold mt-6 mb-3 flex items-center">
              <SortAsc className="w-4 h-4 mr-2" />
              Sort By
            </h3>
            <div className="space-y-2">
              {["popular", "recent", "rating", "downloads", "name"].map((sortOption) => (
                <FocusableItem
                  key={sortOption}
                  focusKey={`sort-${sortOption}`}
                  className="text-sm p-2 rounded-lg hover:bg-muted/50 transition-colors"
                  onClick={() => updateFilter({ sortBy: sortOption as any })}
                >
                  {sortOption.charAt(0).toUpperCase() + sortOption.slice(1)}
                </FocusableItem>
              ))}
            </div>
          </Card>
        </div>

        {/* Mods grid/list */}
        <div className="flex-grow">
          {loading ? (
            <div className="flex items-center justify-center h-64">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
            </div>
          ) : mods.length === 0 ? (
            <div className="bg-card border border-border rounded-xl p-8 text-center">
              <h3 className="font-semibold mb-2">No mods found</h3>
              <p className="text-muted-foreground">Try adjusting your search or filters</p>
            </div>
          ) : viewMode === "grid" ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {mods.map((mod) => (
                <FocusableItem
                  key={mod.id}
                  focusKey={`mod-${mod.id}`}
                  className="mod-card"
                  onClick={() => onSelectMod(mod.id)}
                >
                  <Card className="overflow-hidden bg-card border-border h-full">
                    <div className="relative">
                      <img
                        src={mod.thumbnail || "/placeholder.svg?height=150&width=300&query=game mod thumbnail"}
                        alt={mod.name}
                        className="w-full h-40 object-cover"
                      />
                      <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent p-3">
                        <div className="flex items-center text-white">
                          <div className="flex items-center mr-3">
                            <Download className="w-3 h-3 mr-1" />
                            <span className="text-xs">{formatDownloads(mod.downloadCount)}</span>
                          </div>
                          <div className="flex items-center">
                            <div className="flex items-center">
                              <svg
                                className="w-3 h-3 text-yellow-400 mr-1"
                                fill="currentColor"
                                viewBox="0 0 20 20"
                                xmlns="http://www.w3.org/2000/svg"
                              >
                                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"></path>
                              </svg>
                              <span className="text-xs">{mod.rating.toFixed(1)}</span>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="p-4">
                      <h3 className="font-bold">{mod.name}</h3>
                      <p className="text-xs text-muted-foreground mb-2">by {mod.author.name}</p>
                      <p className="text-sm text-muted-foreground line-clamp-2 mb-3">{mod.shortDescription}</p>

                      <div className="flex flex-wrap gap-1 mt-2">
                        {mod.tags.slice(0, 3).map((tag) => (
                          <span key={tag} className="text-xs bg-muted px-2 py-0.5 rounded-full text-muted-foreground">
                            {tag}
                          </span>
                        ))}
                        {mod.tags.length > 3 && (
                          <span className="text-xs bg-muted px-2 py-0.5 rounded-full text-muted-foreground">
                            +{mod.tags.length - 3}
                          </span>
                        )}
                      </div>

                      <div className="mt-3">
                        <div className="flex justify-between items-center">
                          <span className="text-xs text-muted-foreground">v{mod.latestVersion.version}</span>
                          <span
                            className={`text-xs px-2 py-0.5 rounded-full ${
                              mod.installed
                                ? "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400"
                                : "bg-muted text-muted-foreground"
                            }`}
                          >
                            {mod.installed ? "Installed" : "Not Installed"}
                          </span>
                        </div>
                      </div>
                    </div>
                  </Card>
                </FocusableItem>
              ))}
            </div>
          ) : (
            <div className="space-y-2">
              {mods.map((mod) => (
                <FocusableItem
                  key={mod.id}
                  focusKey={`mod-list-${mod.id}`}
                  className="hover:bg-card/80 rounded-xl border border-border transition-all"
                  onClick={() => onSelectMod(mod.id)}
                >
                  <div className="flex items-center p-3">
                    <img
                      src={mod.thumbnail || "/placeholder.svg?height=80&width=80&query=game mod thumbnail"}
                      alt={mod.name}
                      className="w-16 h-16 object-cover rounded-lg mr-4"
                    />
                    <div className="flex-grow">
                      <div className="flex items-center justify-between">
                        <h3 className="font-bold">{mod.name}</h3>
                        <span
                          className={`text-xs px-2 py-0.5 rounded-full ${
                            mod.installed
                              ? "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400"
                              : "bg-muted text-muted-foreground"
                          }`}
                        >
                          {mod.installed ? "Installed" : "Not Installed"}
                        </span>
                      </div>
                      <p className="text-xs text-muted-foreground">
                        by {mod.author.name} • v{mod.latestVersion.version}
                      </p>
                      <p className="text-sm text-muted-foreground line-clamp-1">{mod.shortDescription}</p>
                      <div className="flex items-center mt-1 text-xs text-muted-foreground">
                        <div className="flex items-center mr-3">
                          <Download className="w-3 h-3 mr-1" />
                          <span>{formatDownloads(mod.downloadCount)}</span>
                        </div>
                        <div className="flex items-center mr-3">
                          <svg
                            className="w-3 h-3 text-yellow-400 mr-1"
                            fill="currentColor"
                            viewBox="0 0 20 20"
                            xmlns="http://www.w3.org/2000/svg"
                          >
                            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"></path>
                          </svg>
                          <span>{mod.rating.toFixed(1)}</span>
                        </div>
                        <div className="flex items-center">
                          <Tag className="w-3 h-3 mr-1" />
                          <span>{mod.tags.length}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </FocusableItem>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
