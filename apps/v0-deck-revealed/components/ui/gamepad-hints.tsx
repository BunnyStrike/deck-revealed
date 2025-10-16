interface GamepadHintsProps {
  activeView: string
}

export function GamepadHints({ activeView }: GamepadHintsProps) {
  return (
    <div className="bg-card/80 backdrop-blur-sm border-t border-border p-2 flex justify-between text-xs text-muted-foreground">
      <div className="flex space-x-4">
        <div className="flex items-center">
          <span className="bg-primary/20 text-primary px-2 py-1 rounded-md mr-2 font-bold">A</span>
          <span>Select</span>
        </div>
        <div className="flex items-center">
          <span className="bg-primary/20 text-primary px-2 py-1 rounded-md mr-2 font-bold">B</span>
          <span>Back</span>
        </div>
      </div>

      <div className="flex space-x-4">
        <div className="flex items-center">
          <span className="bg-primary/20 text-primary px-2 py-1 rounded-md mr-2 font-bold">LB/RB</span>
          <span>Switch Tabs</span>
        </div>
        <div className="flex items-center">
          <span className="bg-primary/20 text-primary px-2 py-1 rounded-md mr-2 font-bold">D-Pad</span>
          <span>Navigate</span>
        </div>
      </div>
    </div>
  )
}
