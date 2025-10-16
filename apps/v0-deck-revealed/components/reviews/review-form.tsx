"use client"

import { useState } from "react"
import { FocusableItem } from "@/components/ui/focusable-item"
import { Card } from "@/components/ui/card"
import { Star, Plus, X, Upload, Camera } from "lucide-react"
import type { GameReview, ReviewRating, ReviewMedia } from "@/types/review"

interface ReviewFormProps {
  gameId: string
  existingReview?: GameReview
  onSubmit: (
    review: Omit<
      GameReview,
      "id" | "timestamp" | "helpfulCount" | "unhelpfulCount" | "commentCount" | "userReputation"
    >,
  ) => void
  onCancel: () => void
}

export function ReviewForm({ gameId, existingReview, onSubmit, onCancel }: ReviewFormProps) {
  const [title, setTitle] = useState(existingReview?.title || "")
  const [content, setContent] = useState(existingReview?.content || "")
  const [rating, setRating] = useState<ReviewRating>(
    existingReview?.rating || {
      overall: 0,
      gameplay: 0,
      graphics: 0,
      story: 0,
      audio: 0,
      value: 0,
    },
  )
  const [pros, setPros] = useState<string[]>(existingReview?.pros || [""])
  const [cons, setCons] = useState<string[]>(existingReview?.cons || [""])
  const [platform, setPlatform] = useState(existingReview?.platform || "PC")
  const [purchaseType, setPurchaseType] = useState<GameReview["purchaseType"]>(existingReview?.purchaseType || "owned")
  const [completionStatus, setCompletionStatus] = useState<GameReview["completionStatus"]>(
    existingReview?.completionStatus || "completed",
  )
  const [playtime, setPlaytime] = useState(existingReview?.playtime || "")
  const [containsSpoilers, setContainsSpoilers] = useState(existingReview?.containsSpoilers || false)
  const [media, setMedia] = useState<ReviewMedia[]>(existingReview?.media || [])
  const [hoverRating, setHoverRating] = useState<Record<keyof ReviewRating, number>>({
    overall: 0,
    gameplay: 0,
    graphics: 0,
    story: 0,
    audio: 0,
    value: 0,
  })

  // Handle star rating hover
  const handleRatingHover = (category: keyof ReviewRating, value: number) => {
    setHoverRating((prev) => ({
      ...prev,
      [category]: value,
    }))
  }

  // Handle star rating click
  const handleRatingClick = (category: keyof ReviewRating, value: number) => {
    setRating((prev) => ({
      ...prev,
      [category]: value,
    }))
  }

  // Handle adding a pro
  const handleAddPro = () => {
    setPros([...pros, ""])
  }

  // Handle removing a pro
  const handleRemovePro = (index: number) => {
    const newPros = [...pros]
    newPros.splice(index, 1)
    setPros(newPros)
  }

  // Handle updating a pro
  const handleUpdatePro = (index: number, value: string) => {
    const newPros = [...pros]
    newPros[index] = value
    setPros(newPros)
  }

  // Handle adding a con
  const handleAddCon = () => {
    setCons([...cons, ""])
  }

  // Handle removing a con
  const handleRemoveCon = (index: number) => {
    const newCons = [...cons]
    newCons.splice(index, 1)
    setCons(newCons)
  }

  // Handle updating a con
  const handleUpdateCon = (index: number, value: string) => {
    const newCons = [...cons]
    newCons[index] = value
    setCons(newCons)
  }

  // Handle adding media
  const handleAddMedia = () => {
    // In a real app, this would open a file picker
    // For now, we'll just add a placeholder
    const newMedia: ReviewMedia = {
      id: `media-${Date.now()}`,
      type: "image",
      url: "/cyberpunk-screenshot-1.png",
      caption: "Screenshot",
      timestamp: new Date().toISOString(),
    }

    setMedia([...media, newMedia])
  }

  // Handle removing media
  const handleRemoveMedia = (id: string) => {
    setMedia(media.filter((item) => item.id !== id))
  }

  // Handle form submission
  const handleSubmit = () => {
    // Validate form
    if (!title.trim()) {
      alert("Please enter a title for your review")
      return
    }

    if (!content.trim()) {
      alert("Please enter content for your review")
      return
    }

    if (rating.overall === 0) {
      alert("Please provide an overall rating")
      return
    }

    // Filter out empty pros and cons
    const filteredPros = pros.filter((pro) => pro.trim())
    const filteredCons = cons.filter((con) => con.trim())

    // Create review object
    const reviewData: Omit<
      GameReview,
      "id" | "timestamp" | "helpfulCount" | "unhelpfulCount" | "commentCount" | "userReputation"
    > = {
      gameId,
      userId: "user1", // In a real app, this would be the current user's ID
      userName: "YourUsername", // In a real app, this would be the current user's name
      userAvatar: "Y", // In a real app, this would be the current user's avatar
      title,
      content,
      rating,
      pros: filteredPros,
      cons: filteredCons,
      platform,
      purchaseType,
      completionStatus,
      playtime,
      containsSpoilers,
      media,
      verified: true, // In a real app, this would be determined by the backend
      featured: false,
    }

    onSubmit(reviewData)
  }

  // Rating labels
  const ratingLabels = {
    1: "Poor",
    2: "Fair",
    3: "Good",
    4: "Great",
    5: "Excellent",
  }

  return (
    <Card className="bg-card border-border overflow-hidden">
      <div className="p-6">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-semibold">{existingReview ? "Edit Your Review" : "Write a Review"}</h2>
          <FocusableItem
            focusKey="cancel-review"
            className="text-muted-foreground hover:text-foreground"
            onClick={onCancel}
          >
            <X className="w-5 h-5" />
          </FocusableItem>
        </div>

        <div className="space-y-6">
          {/* Overall Rating */}
          <div>
            <label className="block text-lg font-medium mb-2">Overall Rating</label>
            <div className="flex items-center">
              <div className="flex">
                {[1, 2, 3, 4, 5].map((value) => (
                  <FocusableItem
                    key={value}
                    focusKey={`overall-rating-${value}`}
                    className="p-1"
                    onClick={() => handleRatingClick("overall", value)}
                    onMouseEnter={() => handleRatingHover("overall", value)}
                    onMouseLeave={() => handleRatingHover("overall", 0)}
                  >
                    <Star
                      className={`w-8 h-8 ${
                        value <= (hoverRating.overall || rating.overall)
                          ? "text-secondary fill-secondary"
                          : "text-muted-foreground"
                      }`}
                    />
                  </FocusableItem>
                ))}
              </div>
              <span className="ml-4 text-lg font-medium">
                {rating.overall > 0 ? ratingLabels[rating.overall as keyof typeof ratingLabels] : "Select a rating"}
              </span>
            </div>
          </div>

          {/* Title */}
          <div>
            <label htmlFor="review-title" className="block text-sm font-medium mb-1">
              Review Title
            </label>
            <input
              id="review-title"
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Summarize your experience"
              className="w-full bg-card border border-border text-foreground rounded-lg py-2 px-3 focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all"
              maxLength={100}
            />
            <div className="text-xs text-muted-foreground mt-1 text-right">{title.length}/100</div>
          </div>

          {/* Content */}
          <div>
            <label htmlFor="review-content" className="block text-sm font-medium mb-1">
              Review Content
            </label>
            <textarea
              id="review-content"
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder="Share your thoughts about the game"
              className="w-full bg-card border border-border text-foreground rounded-lg py-2 px-3 focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all min-h-[150px]"
              maxLength={5000}
            />
            <div className="text-xs text-muted-foreground mt-1 text-right">{content.length}/5000</div>
          </div>

          {/* Detailed Ratings */}
          <div>
            <label className="block text-sm font-medium mb-3">Detailed Ratings (Optional)</label>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {/* Gameplay */}
              <div className="bg-muted/30 rounded-lg p-3">
                <label className="block text-sm font-medium mb-1">Gameplay</label>
                <div className="flex">
                  {[1, 2, 3, 4, 5].map((value) => (
                    <FocusableItem
                      key={value}
                      focusKey={`gameplay-rating-${value}`}
                      className="p-1"
                      onClick={() => handleRatingClick("gameplay", value)}
                      onMouseEnter={() => handleRatingHover("gameplay", value)}
                      onMouseLeave={() => handleRatingHover("gameplay", 0)}
                    >
                      <Star
                        className={`w-5 h-5 ${
                          value <= (hoverRating.gameplay || rating.gameplay || 0)
                            ? "text-secondary fill-secondary"
                            : "text-muted-foreground"
                        }`}
                      />
                    </FocusableItem>
                  ))}
                </div>
              </div>

              {/* Graphics */}
              <div className="bg-muted/30 rounded-lg p-3">
                <label className="block text-sm font-medium mb-1">Graphics</label>
                <div className="flex">
                  {[1, 2, 3, 4, 5].map((value) => (
                    <FocusableItem
                      key={value}
                      focusKey={`graphics-rating-${value}`}
                      className="p-1"
                      onClick={() => handleRatingClick("graphics", value)}
                      onMouseEnter={() => handleRatingHover("graphics", value)}
                      onMouseLeave={() => handleRatingHover("graphics", 0)}
                    >
                      <Star
                        className={`w-5 h-5 ${
                          value <= (hoverRating.graphics || rating.graphics || 0)
                            ? "text-secondary fill-secondary"
                            : "text-muted-foreground"
                        }`}
                      />
                    </FocusableItem>
                  ))}
                </div>
              </div>

              {/* Story */}
              <div className="bg-muted/30 rounded-lg p-3">
                <label className="block text-sm font-medium mb-1">Story</label>
                <div className="flex">
                  {[1, 2, 3, 4, 5].map((value) => (
                    <FocusableItem
                      key={value}
                      focusKey={`story-rating-${value}`}
                      className="p-1"
                      onClick={() => handleRatingClick("story", value)}
                      onMouseEnter={() => handleRatingHover("story", value)}
                      onMouseLeave={() => handleRatingHover("story", 0)}
                    >
                      <Star
                        className={`w-5 h-5 ${
                          value <= (hoverRating.story || rating.story || 0)
                            ? "text-secondary fill-secondary"
                            : "text-muted-foreground"
                        }`}
                      />
                    </FocusableItem>
                  ))}
                </div>
              </div>

              {/* Audio */}
              <div className="bg-muted/30 rounded-lg p-3">
                <label className="block text-sm font-medium mb-1">Audio</label>
                <div className="flex">
                  {[1, 2, 3, 4, 5].map((value) => (
                    <FocusableItem
                      key={value}
                      focusKey={`audio-rating-${value}`}
                      className="p-1"
                      onClick={() => handleRatingClick("audio", value)}
                      onMouseEnter={() => handleRatingHover("audio", value)}
                      onMouseLeave={() => handleRatingHover("audio", 0)}
                    >
                      <Star
                        className={`w-5 h-5 ${
                          value <= (hoverRating.audio || rating.audio || 0)
                            ? "text-secondary fill-secondary"
                            : "text-muted-foreground"
                        }`}
                      />
                    </FocusableItem>
                  ))}
                </div>
              </div>

              {/* Value */}
              <div className="bg-muted/30 rounded-lg p-3">
                <label className="block text-sm font-medium mb-1">Value for Money</label>
                <div className="flex">
                  {[1, 2, 3, 4, 5].map((value) => (
                    <FocusableItem
                      key={value}
                      focusKey={`value-rating-${value}`}
                      className="p-1"
                      onClick={() => handleRatingClick("value", value)}
                      onMouseEnter={() => handleRatingHover("value", value)}
                      onMouseLeave={() => handleRatingHover("value", 0)}
                    >
                      <Star
                        className={`w-5 h-5 ${
                          value <= (hoverRating.value || rating.value || 0)
                            ? "text-secondary fill-secondary"
                            : "text-muted-foreground"
                        }`}
                      />
                    </FocusableItem>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Pros and Cons */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Pros */}
            <div>
              <label className="block text-sm font-medium mb-2">Pros (Optional)</label>
              <div className="space-y-2">
                {pros.map((pro, index) => (
                  <div key={index} className="flex items-center">
                    <input
                      type="text"
                      value={pro}
                      onChange={(e) => handleUpdatePro(index, e.target.value)}
                      placeholder={`Pro #${index + 1}`}
                      className="flex-1 bg-card border border-border text-foreground rounded-lg py-2 px-3 focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all"
                    />
                    <FocusableItem
                      focusKey={`remove-pro-${index}`}
                      className="ml-2 text-muted-foreground hover:text-foreground"
                      onClick={() => handleRemovePro(index)}
                    >
                      <X className="w-5 h-5" />
                    </FocusableItem>
                  </div>
                ))}
                <FocusableItem
                  focusKey="add-pro"
                  className="flex items-center text-primary hover:text-primary/80"
                  onClick={handleAddPro}
                >
                  <Plus className="w-4 h-4 mr-1" />
                  <span>Add Pro</span>
                </FocusableItem>
              </div>
            </div>

            {/* Cons */}
            <div>
              <label className="block text-sm font-medium mb-2">Cons (Optional)</label>
              <div className="space-y-2">
                {cons.map((con, index) => (
                  <div key={index} className="flex items-center">
                    <input
                      type="text"
                      value={con}
                      onChange={(e) => handleUpdateCon(index, e.target.value)}
                      placeholder={`Con #${index + 1}`}
                      className="flex-1 bg-card border border-border text-foreground rounded-lg py-2 px-3 focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all"
                    />
                    <FocusableItem
                      focusKey={`remove-con-${index}`}
                      className="ml-2 text-muted-foreground hover:text-foreground"
                      onClick={() => handleRemoveCon(index)}
                    >
                      <X className="w-5 h-5" />
                    </FocusableItem>
                  </div>
                ))}
                <FocusableItem
                  focusKey="add-con"
                  className="flex items-center text-primary hover:text-primary/80"
                  onClick={handleAddCon}
                >
                  <Plus className="w-4 h-4 mr-1" />
                  <span>Add Con</span>
                </FocusableItem>
              </div>
            </div>
          </div>

          {/* Media */}
          <div>
            <label className="block text-sm font-medium mb-2">Media (Optional)</label>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
              {media.map((item) => (
                <div key={item.id} className="relative rounded-lg overflow-hidden group">
                  <img
                    src={item.url || "/placeholder.svg"}
                    alt={item.caption || "Review media"}
                    className="w-full h-32 object-cover"
                  />
                  <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                    <FocusableItem
                      focusKey={`remove-media-${item.id}`}
                      className="bg-red-500 text-white p-2 rounded-full"
                      onClick={() => handleRemoveMedia(item.id)}
                    >
                      <X className="w-5 h-5" />
                    </FocusableItem>
                  </div>
                </div>
              ))}
              <FocusableItem
                focusKey="add-media"
                className="border-2 border-dashed border-muted-foreground/30 rounded-lg flex flex-col items-center justify-center h-32 hover:border-primary/50 transition-colors"
                onClick={handleAddMedia}
              >
                <Upload className="w-6 h-6 text-muted-foreground mb-2" />
                <span className="text-sm text-muted-foreground">Add Media</span>
              </FocusableItem>
            </div>
            <div className="flex space-x-4">
              <FocusableItem
                focusKey="upload-screenshot"
                className="flex items-center text-muted-foreground hover:text-foreground"
                onClick={handleAddMedia}
              >
                <Upload className="w-4 h-4 mr-1" />
                <span>Upload Screenshot</span>
              </FocusableItem>
              <FocusableItem
                focusKey="take-screenshot"
                className="flex items-center text-muted-foreground hover:text-foreground"
                onClick={handleAddMedia}
              >
                <Camera className="w-4 h-4 mr-1" />
                <span>Take Screenshot</span>
              </FocusableItem>
            </div>
          </div>

          {/* Additional Info */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Platform */}
            <div>
              <label htmlFor="platform" className="block text-sm font-medium mb-1">
                Platform
              </label>
              <select
                id="platform"
                value={platform}
                onChange={(e) => setPlatform(e.target.value)}
                className="w-full bg-card border border-border text-foreground rounded-lg py-2 px-3 focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all"
              >
                <option value="PC">PC</option>
                <option value="PlayStation 5">PlayStation 5</option>
                <option value="PlayStation 4">PlayStation 4</option>
                <option value="Xbox Series X/S">Xbox Series X/S</option>
                <option value="Xbox One">Xbox One</option>
                <option value="Nintendo Switch">Nintendo Switch</option>
                <option value="Other">Other</option>
              </select>
            </div>

            {/* Purchase Type */}
            <div>
              <label htmlFor="purchase-type" className="block text-sm font-medium mb-1">
                Purchase Type
              </label>
              <select
                id="purchase-type"
                value={purchaseType}
                onChange={(e) => setPurchaseType(e.target.value as GameReview["purchaseType"])}
                className="w-full bg-card border border-border text-foreground rounded-lg py-2 px-3 focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all"
              >
                <option value="owned">Purchased</option>
                <option value="subscription">Subscription (Game Pass, PS Plus, etc.)</option>
                <option value="borrowed">Borrowed</option>
                <option value="other">Other</option>
              </select>
            </div>

            {/* Completion Status */}
            <div>
              <label htmlFor="completion-status" className="block text-sm font-medium mb-1">
                Completion Status
              </label>
              <select
                id="completion-status"
                value={completionStatus}
                onChange={(e) => setCompletionStatus(e.target.value as GameReview["completionStatus"])}
                className="w-full bg-card border border-border text-foreground rounded-lg py-2 px-3 focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all"
              >
                <option value="completed">Completed</option>
                <option value="in-progress">In Progress</option>
                <option value="abandoned">Abandoned</option>
                <option value="not-started">Not Started</option>
              </select>
            </div>

            {/* Playtime */}
            <div>
              <label htmlFor="playtime" className="block text-sm font-medium mb-1">
                Playtime
              </label>
              <input
                id="playtime"
                type="text"
                value={playtime}
                onChange={(e) => setPlaytime(e.target.value)}
                placeholder="e.g. 40 hours"
                className="w-full bg-card border border-border text-foreground rounded-lg py-2 px-3 focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all"
              />
            </div>
          </div>

          {/* Spoiler Warning */}
          <div className="flex items-center">
            <input
              id="contains-spoilers"
              type="checkbox"
              checked={containsSpoilers}
              onChange={(e) => setContainsSpoilers(e.target.checked)}
              className="w-4 h-4 text-primary border-border rounded focus:ring-primary/50"
            />
            <label htmlFor="contains-spoilers" className="ml-2 text-sm">
              This review contains spoilers
            </label>
          </div>

          {/* Submit Button */}
          <div className="flex justify-end space-x-4 pt-4 border-t border-border">
            <FocusableItem
              focusKey="cancel-review-button"
              className="px-4 py-2 rounded-lg border border-border text-muted-foreground hover:text-foreground transition-colors"
              onClick={onCancel}
            >
              Cancel
            </FocusableItem>
            <FocusableItem
              focusKey="submit-review-button"
              className="px-6 py-2 rounded-lg bg-primary text-white hover:bg-primary/90 transition-colors"
              onClick={handleSubmit}
            >
              {existingReview ? "Update Review" : "Submit Review"}
            </FocusableItem>
          </div>
        </div>
      </div>
    </Card>
  )
}
