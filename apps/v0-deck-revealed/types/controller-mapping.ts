export type ControllerType = "xbox" | "playstation" | "nintendo" | "generic" | "custom"

export type ControllerButton =
  // Face buttons
  | "a"
  | "b"
  | "x"
  | "y" // Xbox style
  | "cross"
  | "circle"
  | "square"
  | "triangle" // PlayStation style
  // D-pad
  | "dpad_up"
  | "dpad_down"
  | "dpad_left"
  | "dpad_right"
  // Shoulder buttons
  | "lb"
  | "rb"
  | "lt"
  | "rt" // Xbox style
  | "l1"
  | "r1"
  | "l2"
  | "r2" // PlayStation style
  // Analog sticks
  | "l3"
  | "r3" // Stick clicks
  | "ls_up"
  | "ls_down"
  | "ls_left"
  | "ls_right" // Left stick
  | "rs_up"
  | "rs_down"
  | "rs_left"
  | "rs_right" // Right stick
  // Center buttons
  | "start"
  | "select"
  | "guide"
  | "share"
  | "options"
  | "touchpad"

export type GameAction =
  // Common actions
  | "jump"
  | "attack"
  | "defend"
  | "interact"
  | "pause"
  | "inventory"
  | "map"
  | "sprint"
  | "crouch"
  | "aim"
  | "shoot"
  | "reload"
  | "switch_weapon"
  | "use_item"
  | "menu_up"
  | "menu_down"
  | "menu_left"
  | "menu_right"
  | "menu_select"
  | "menu_back"
  | "menu_start"
  // Movement
  | "move_up"
  | "move_down"
  | "move_left"
  | "move_right"
  | "camera_up"
  | "camera_down"
  | "camera_left"
  | "camera_right"
  // Game-specific actions
  | "dodge"
  | "parry"
  | "block"
  | "heal"
  | "skill"
  | "light_attack"
  | "heavy_attack"
  | "special_ability"
  | "quick_item"
  | "switch_stance"
  | "toggle_flashlight"
  | "ping"
  | "emote"
  | "quick_save"
  | "quick_load"
  | "screenshot"
  | "voice_chat"
  // Custom
  | string

export interface ControllerMapping {
  id: string
  name: string
  controllerType: ControllerType
  gameId?: string
  gameName?: string
  isDefault: boolean
  createdAt: string
  updatedAt: string
  mappings: Record<ControllerButton, GameAction>
  // New fields for game-specific settings
  deadzone?: number
  sensitivity?: number
  vibrationIntensity?: number
  invertYAxis?: boolean
  invertXAxis?: boolean
  triggerThreshold?: number
}

export interface ControllerProfile {
  id: string
  name: string
  description?: string
  controllerType: ControllerType
  isDefault: boolean
  mappings: ControllerMapping[]
}

export interface ConnectedController {
  id: string
  name: string
  type: ControllerType
  connected: boolean
  batteryLevel?: number
  vibrationSupported: boolean
  axesCount: number
  buttonCount: number
}

export interface GameControllerConfig {
  id: string
  gameId: string
  gameName: string
  controllerMappingId: string
  autoLoad: boolean
  createdAt: string
  updatedAt: string
}

// New interface for game-specific controller settings
export interface GameControllerSettings {
  deadzone: number
  sensitivity: number
  vibrationIntensity: number
  invertYAxis: boolean
  invertXAxis: boolean
  triggerThreshold: number
}

// New interface for game-specific action descriptions
export interface GameActionDescription {
  action: GameAction
  description: string
  context: string
  importance: "primary" | "secondary" | "tertiary"
}
