import { FocusableItem } from "@/components/ui/focusable-item"
import { Search, UserPlus, MessageSquare, GamepadIcon as GameController, Users, Filter } from "lucide-react"
import { Card } from "@/components/ui/card"

export function Friends() {
  const friends = [
    {
      id: "friend1",
      name: "Alex",
      status: "Online",
      game: "Destiny 2",
      avatar: "A",
      level: 42,
      playtime: "120h",
    },
    {
      id: "friend2",
      name: "Taylor",
      status: "Offline",
      lastSeen: "3h ago",
      avatar: "T",
      level: 28,
      playtime: "85h",
    },
    {
      id: "friend3",
      name: "Jordan",
      status: "Online",
      game: "Apex Legends",
      avatar: "J",
      level: 56,
      playtime: "210h",
    },
    {
      id: "friend4",
      name: "Morgan",
      status: "Away",
      lastSeen: "15m ago",
      avatar: "M",
      level: 31,
      playtime: "65h",
    },
    {
      id: "friend5",
      name: "Casey",
      status: "Online",
      game: "Fortnite",
      avatar: "C",
      level: 47,
      playtime: "180h",
    },
    {
      id: "friend6",
      name: "Riley",
      status: "Offline",
      lastSeen: "2d ago",
      avatar: "R",
      level: 19,
      playtime: "40h",
    },
  ]

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <h1 className="text-3xl font-bold gradient-text">Friends</h1>

        <div className="flex flex-wrap gap-2">
          <div className="relative flex-grow max-w-xs">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
            <input
              type="text"
              placeholder="Search friends"
              className="w-full bg-card border border-border text-foreground rounded-lg py-2 pl-10 pr-4 focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all"
            />
          </div>

          <FocusableItem
            focusKey="filter-friends"
            className="p-2 rounded-lg bg-card border border-border hover:bg-muted/30 transition-all"
          >
            <Filter className="w-5 h-5 text-muted-foreground" />
          </FocusableItem>

          <FocusableItem
            focusKey="add-friend"
            className="p-2 rounded-lg bg-primary hover:bg-primary/90 text-white transition-all"
          >
            <UserPlus className="w-5 h-5" />
          </FocusableItem>
        </div>
      </div>

      <Card className="bg-card border-border rounded-xl overflow-hidden">
        <div className="flex border-b border-border">
          <button className="flex-1 py-3 px-4 text-center font-medium border-b-2 border-primary text-primary">
            All Friends
          </button>
          <button className="flex-1 py-3 px-4 text-center font-medium text-muted-foreground hover:text-foreground transition-colors">
            Online
          </button>
          <button className="flex-1 py-3 px-4 text-center font-medium text-muted-foreground hover:text-foreground transition-colors">
            Pending
          </button>
        </div>

        <div className="divide-y divide-border">
          {friends.map((friend) => (
            <FocusableItem
              key={friend.id}
              focusKey={`friend-${friend.id}`}
              className="hover:bg-muted/30 transition-all"
            >
              <div className="flex items-center p-4">
                <div
                  className={`w-12 h-12 rounded-full flex items-center justify-center mr-4 ${
                    friend.status === "Online"
                      ? "bg-gradient-to-br from-primary to-secondary text-white"
                      : "bg-muted text-muted-foreground"
                  }`}
                >
                  {friend.avatar}
                </div>
                <div className="flex-1">
                  <div className="flex items-center">
                    <h3 className="font-medium">{friend.name}</h3>
                    <div
                      className={`ml-2 w-2 h-2 rounded-full ${
                        friend.status === "Online"
                          ? "bg-green-500"
                          : friend.status === "Away"
                            ? "bg-yellow-500"
                            : "bg-gray-500"
                      }`}
                    />
                    <span className="ml-2 text-xs bg-muted px-2 py-0.5 rounded-full text-muted-foreground">
                      Lvl {friend.level}
                    </span>
                  </div>
                  <p className="text-sm text-muted-foreground">
                    {friend.status === "Online" ? `Playing ${friend.game}` : `Last seen ${friend.lastSeen}`}
                  </p>
                  <div className="flex items-center mt-1 text-xs text-muted-foreground">
                    <Users className="w-3 h-3 mr-1" />
                    <span>Friends since June 2023</span>
                    <span className="mx-2">•</span>
                    <span>{friend.playtime} playtime</span>
                  </div>
                </div>
                <div className="flex space-x-2">
                  <FocusableItem
                    focusKey={`message-${friend.id}`}
                    className="p-2 rounded-lg bg-muted/50 hover:bg-muted transition-all"
                  >
                    <MessageSquare className="w-5 h-5 text-muted-foreground" />
                  </FocusableItem>

                  {friend.status === "Online" && (
                    <FocusableItem
                      focusKey={`join-${friend.id}`}
                      className="p-2 rounded-lg bg-primary/20 hover:bg-primary/30 transition-all"
                    >
                      <GameController className="w-5 h-5 text-primary" />
                    </FocusableItem>
                  )}
                </div>
              </div>
            </FocusableItem>
          ))}
        </div>
      </Card>
    </div>
  )
}
