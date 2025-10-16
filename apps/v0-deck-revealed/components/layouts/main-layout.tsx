"use client"

import type { ReactNode } from "react"
import { Sidebar } from "@/components/navigation/sidebar"
import { BottomNav } from "@/components/navigation/bottom-nav"
import { TopBar } from "@/components/navigation/top-bar"
import { FocusProvider } from "@/components/ui/focus-provider"
import { useMediaQuery } from "@/hooks/use-media-query"
import { ImageProvider } from "@/components/ui/image-context"

interface MainLayoutProps {
  children: ReactNode
  activeView: string
  setActiveView: (view: string) => void
  inputMethod: "keyboard" | "gamepad" | "touch" | "mouse"
}

export function MainLayout({ children, activeView, setActiveView, inputMethod }: MainLayoutProps) {
  const isMobile = useMediaQuery("(max-width: 768px)")

  return (
    <FocusProvider>
      <ImageProvider>
        <div className="flex h-screen bg-background text-foreground">
          {!isMobile && <Sidebar activeView={activeView} setActiveView={setActiveView} />}
          <div className="flex flex-col flex-1 overflow-hidden">
            <TopBar activeView={activeView} inputMethod={inputMethod} />
            <main className="flex-1 overflow-auto p-4 md:p-6">
              <div className="container mx-auto">{children}</div>
            </main>
            {isMobile && <BottomNav activeView={activeView} setActiveView={setActiveView} />}
          </div>
        </div>
      </ImageProvider>
    </FocusProvider>
  )
}
