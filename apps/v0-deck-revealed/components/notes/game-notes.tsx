"use client"

import { useState, useEffect } from "react"
import { FocusableItem } from "@/components/ui/focusable-item"
import { Card } from "@/components/ui/card"
import { ChevronLeft, Plus, X, Tag, Save, Trash2 } from "lucide-react"
import type { GameNote } from "@/types/game-data"

interface GameNotesProps {
  gameId: string
  onBack: () => void
}

export function GameNotes({ gameId, onBack }: GameNotesProps) {
  const [notes, setNotes] = useState<GameNote[]>([])
  const [editingNote, setEditingNote] = useState<GameNote | null>(null)
  const [newNoteContent, setNewNoteContent] = useState("")
  const [newNoteTags, setNewNoteTags] = useState<string[]>([])
  const [tagInput, setTagInput] = useState("")

  // Mock loading notes from storage
  useEffect(() => {
    const storedNotes = localStorage.getItem(`game-notes-${gameId}`)
    if (storedNotes) {
      setNotes(JSON.parse(storedNotes))
    }
  }, [gameId])

  // Mock saving notes to storage
  const saveNotes = (updatedNotes: GameNote[]) => {
    localStorage.setItem(`game-notes-${gameId}`, JSON.stringify(updatedNotes))
    setNotes(updatedNotes)
  }

  const handleAddNote = () => {
    if (!newNoteContent.trim()) return

    const newNote: GameNote = {
      id: Date.now().toString(),
      gameId,
      content: newNoteContent,
      createdAt: new Date().toISOString(),
      tags: newNoteTags,
    }

    const updatedNotes = [...notes, newNote]
    saveNotes(updatedNotes)
    setNewNoteContent("")
    setNewNoteTags([])
  }

  const handleUpdateNote = () => {
    if (!editingNote || !newNoteContent.trim()) return

    const updatedNotes = notes.map((note) =>
      note.id === editingNote.id ? { ...note, content: newNoteContent, tags: newNoteTags } : note,
    )

    saveNotes(updatedNotes)
    setEditingNote(null)
    setNewNoteContent("")
    setNewNoteTags([])
  }

  const handleDeleteNote = (noteId: string) => {
    const updatedNotes = notes.filter((note) => note.id !== noteId)
    saveNotes(updatedNotes)
  }

  const handleEditNote = (note: GameNote) => {
    setEditingNote(note)
    setNewNoteContent(note.content)
    setNewNoteTags(note.tags)
  }

  const handleCancelEdit = () => {
    setEditingNote(null)
    setNewNoteContent("")
    setNewNoteTags([])
  }

  const handleAddTag = () => {
    if (!tagInput.trim() || newNoteTags.includes(tagInput.trim())) return
    setNewNoteTags([...newNoteTags, tagInput.trim()])
    setTagInput("")
  }

  const handleRemoveTag = (tag: string) => {
    setNewNoteTags(newNoteTags.filter((t) => t !== tag))
  }

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    })
  }

  return (
    <div className="h-full overflow-y-auto pb-8">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center">
          <FocusableItem
            focusKey="back-button"
            className="inline-flex items-center text-muted-foreground hover:text-foreground mr-4 transition-colors"
            onClick={onBack}
          >
            <ChevronLeft className="mr-1" size={18} />
            <span>Back</span>
          </FocusableItem>
          <h1 className="text-2xl font-bold gradient-text">Game Notes</h1>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <Card className="bg-card border-border p-6 rounded-xl mb-6">
            <h2 className="text-xl font-semibold mb-4">{editingNote ? "Edit Note" : "Add New Note"}</h2>
            <div className="space-y-4">
              <div>
                <textarea
                  className="w-full bg-muted/30 border border-border text-foreground rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all min-h-[120px]"
                  placeholder="Write your note here..."
                  value={newNoteContent}
                  onChange={(e) => setNewNoteContent(e.target.value)}
                ></textarea>
              </div>

              <div>
                <div className="flex items-center mb-2">
                  <Tag className="w-4 h-4 text-muted-foreground mr-2" />
                  <span className="text-sm font-medium">Tags</span>
                </div>
                <div className="flex flex-wrap gap-2 mb-2">
                  {newNoteTags.map((tag) => (
                    <div
                      key={tag}
                      className="flex items-center bg-primary/20 text-primary text-xs px-2 py-1 rounded-full"
                    >
                      <span>{tag}</span>
                      <button className="ml-1 text-primary hover:text-primary/80" onClick={() => handleRemoveTag(tag)}>
                        <X size={12} />
                      </button>
                    </div>
                  ))}
                </div>
                <div className="flex">
                  <input
                    type="text"
                    className="flex-grow bg-muted/30 border border-border text-foreground rounded-l-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all"
                    placeholder="Add a tag..."
                    value={tagInput}
                    onChange={(e) => setTagInput(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === "Enter") {
                        e.preventDefault()
                        handleAddTag()
                      }
                    }}
                  />
                  <button
                    className="bg-primary hover:bg-primary/90 text-white px-3 py-2 rounded-r-lg transition-all"
                    onClick={handleAddTag}
                  >
                    <Plus size={16} />
                  </button>
                </div>
              </div>

              <div className="flex justify-end gap-2">
                {editingNote && (
                  <FocusableItem
                    focusKey="cancel-edit"
                    className="px-4 py-2 bg-muted/50 hover:bg-muted text-foreground rounded-lg transition-all"
                    onClick={handleCancelEdit}
                  >
                    Cancel
                  </FocusableItem>
                )}
                <FocusableItem
                  focusKey={editingNote ? "update-note" : "add-note"}
                  className="px-4 py-2 bg-primary hover:bg-primary/90 text-white rounded-lg transition-all flex items-center gap-2"
                  onClick={editingNote ? handleUpdateNote : handleAddNote}
                >
                  <Save size={16} />
                  <span>{editingNote ? "Update Note" : "Save Note"}</span>
                </FocusableItem>
              </div>
            </div>
          </Card>

          <h2 className="text-xl font-semibold mb-4">Your Notes</h2>
          {notes.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              <p>You haven't added any notes yet.</p>
            </div>
          ) : (
            <div className="space-y-4">
              {notes.map((note) => (
                <Card key={note.id} className="bg-card border-border p-4 rounded-xl">
                  <div className="flex justify-between items-start mb-2">
                    <span className="text-sm text-muted-foreground">{formatDate(note.createdAt)}</span>
                    <div className="flex gap-2">
                      <button
                        className="text-muted-foreground hover:text-foreground transition-colors"
                        onClick={() => handleEditNote(note)}
                      >
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          width="16"
                          height="16"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        >
                          <path d="M17 3a2.85 2.85 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5Z" />
                          <path d="m15 5 4 4" />
                        </svg>
                      </button>
                      <button
                        className="text-muted-foreground hover:text-secondary transition-colors"
                        onClick={() => handleDeleteNote(note.id)}
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </div>
                  <p className="mb-3 whitespace-pre-wrap">{note.content}</p>
                  {note.tags.length > 0 && (
                    <div className="flex flex-wrap gap-1">
                      {note.tags.map((tag) => (
                        <span key={tag} className="bg-muted/50 text-muted-foreground text-xs px-2 py-0.5 rounded-full">
                          {tag}
                        </span>
                      ))}
                    </div>
                  )}
                </Card>
              ))}
            </div>
          )}
        </div>

        <div>
          <Card className="bg-card border-border p-6 rounded-xl sticky top-4">
            <h2 className="text-xl font-semibold mb-4">Tips</h2>
            <div className="space-y-4 text-muted-foreground">
              <p>Use notes to keep track of your thoughts, strategies, or favorite moments in the game.</p>
              <p>Add tags to organize your notes and make them easier to find later.</p>
              <p>You can edit or delete your notes at any time.</p>
              <p>Notes are saved locally on your device and are private to you.</p>
            </div>
          </Card>
        </div>
      </div>
    </div>
  )
}
