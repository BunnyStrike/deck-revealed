import type { ValidGamepadAction } from '~/common/types'

// Holds layouts for different XBox official an clone controllers

export function checkStandard(
  buttons: readonly GamepadButton[],
  axes: readonly number[],
  controllerIndex: number,
  checkAction: (
    action: ValidGamepadAction,
    pressed: boolean,
    ctrlIdx: number
  ) => void
) {
  const mainButton = buttons[0], // Xbox: A, PS: Cross
    backButton = buttons[1], // Xbox: B, PS: Circle
    contextMenuButton = buttons[2], // Xbox: X, PS: Square
    altButton = buttons[3], // Xbox: Y, PS: Triangle
    // LB = buttons[4],
    // RB = buttons[5],
    // LT = buttons[6], // has .value
    // RT = buttons[7], // has .value
    // view = buttons[8],
    // menu = buttons[9],
    // L3 = buttons[10], // press left stick
    // R3 = buttons[11], // press right stick
    up = buttons[12],
    down = buttons[13],
    left = buttons[14],
    right = buttons[15],
    // XBOX = buttons[16],
    leftAxisX = axes[0] ?? 0,
    leftAxisY = axes[1] ?? 0,
    rightAxisX = axes[2] ?? 0,
    rightAxisY = axes[3] ?? 0

  // use the `?` operator here since this layout is used as fallback
  // and mapping can be incorrect
  checkAction('mainAction', mainButton?.pressed ?? false, controllerIndex)
  checkAction('back', backButton?.pressed ?? false, controllerIndex)
  checkAction('altAction', altButton?.pressed ?? false, controllerIndex)
  checkAction('leftStickLeft', leftAxisX < -0.5, controllerIndex)
  checkAction('leftStickRight', leftAxisX > 0.5, controllerIndex)
  checkAction('leftStickUp', leftAxisY < -0.5, controllerIndex)
  checkAction('leftStickDown', leftAxisY > 0.5, controllerIndex)
  checkAction('rightStickLeft', rightAxisX < -0.5, controllerIndex)
  checkAction('rightStickRight', rightAxisX > 0.5, controllerIndex)
  checkAction('rightStickUp', rightAxisY < -0.5, controllerIndex)
  checkAction('rightStickDown', rightAxisY > 0.5, controllerIndex)
  checkAction('padUp', up?.pressed ?? false, controllerIndex)
  checkAction('padDown', down?.pressed ?? false, controllerIndex)
  checkAction('padLeft', left?.pressed ?? false, controllerIndex)
  checkAction('padRight', right?.pressed ?? false, controllerIndex)
  checkAction(
    'rightClick',
    contextMenuButton?.pressed ?? false,
    controllerIndex
  )
}
