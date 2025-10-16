import { Battery, Wifi, Volume2, Search, Bell } from "lucide-react"
import { FocusableItem } from "@/components/ui/focusable-item"

export function TopBar() {
  return (
    <div className="bg-card/80 backdrop-blur-sm border-b border-border p-3 flex items-center justify-between">
      <div className="flex items-center">
        <span className="text-lg font-bold gradient-text">Game Hub</span>
      </div>

      <div className="relative max-w-md w-full hidden md:block mx-4">
        <FocusableItem className="w-full" focusKey="search" gamepadHint="Select">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
            <input
              type="text"
              placeholder="Search games, apps, friends..."
              className="w-full bg-muted/50 text-foreground rounded-full py-2 pl-10 pr-4 focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all"
            />
          </div>
        </FocusableItem>
      </div>

      <div className="flex items-center space-x-4">
        <FocusableItem
          className="text-muted-foreground hover:text-foreground transition-colors"
          focusKey="notifications"
        >
          <div className="relative">
            <Bell className="w-5 h-5" />
            <span className="absolute -top-1 -right-1 w-4 h-4 bg-secondary rounded-full flex items-center justify-center text-[10px] font-bold">
              3
            </span>
          </div>
        </FocusableItem>

        <FocusableItem className="text-muted-foreground hover:text-foreground transition-colors" focusKey="wifi">
          <Wifi className="w-5 h-5" />
        </FocusableItem>

        <FocusableItem className="text-muted-foreground hover:text-foreground transition-colors" focusKey="volume">
          <Volume2 className="w-5 h-5" />
        </FocusableItem>

        <FocusableItem className="text-muted-foreground hover:text-foreground transition-colors" focusKey="battery">
          <div className="flex items-center">
            <Battery className="w-5 h-5" />
            <span className="ml-1 text-sm">85%</span>
          </div>
        </FocusableItem>
      </div>
    </div>
  )
}
