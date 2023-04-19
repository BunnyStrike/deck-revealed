import { type GamepadInputEvent } from '~/common/types'
import { getMainWindow } from '../windows/mainWindow'
import { createTRPCRouter, publicProcedure } from './trpc'

// export const router = t.router({
//   greeting: t.procedure.input(z.object({ name: z.string() })).query((req) => {
//     const { input } = req;

//     ee.emit('greeting', `Greeted ${input.name}`);
//     return {
//       text: `Hello ${input.name}` as const,
//     };
//   }),
//   subscription: t.procedure.subscription(() => {
//     return observable((emit) => {
//       function onGreet(text: string) {
//         emit.next({ text });
//       }

//       ee.on('greeting', onGreet);

//       return () => {
//         ee.off('greeting', onGreet);
//       };
//     });
//   }),
// });

// Simulate keyboard and mouse actions as if the real input device is used
export const gamepad = createTRPCRouter({
  action: publicProcedure.query((req) => {
    const { args }: any = req
    // we can only receive gamepad events if the main window exists
    const mainWindow = getMainWindow()!

    const { action, metadata } = args
    const inputEvents: GamepadInputEvent[] = []

    /*
     * How to extend:
     *
     * Valid values for type are 'keyDown', 'keyUp' and 'char'
     * Valid values for keyCode are defined here:
     * https://www.electronjs.org/docs/latest/api/accelerator#available-key-codes
     *
     */
    switch (action) {
      case 'rightStickUp':
        inputEvents.push({
          type: 'mouseWheel',
          deltaY: 50,
          x: mainWindow.getBounds().width / 2,
          y: mainWindow.getBounds().height / 2,
        })
        break
      case 'rightStickDown':
        inputEvents.push({
          type: 'mouseWheel',
          deltaY: -50,
          x: mainWindow.getBounds().width / 2,
          y: mainWindow.getBounds().height / 2,
        })
        break
      case 'leftStickUp':
      case 'leftStickDown':
      case 'leftStickLeft':
      case 'leftStickRight':
      case 'padUp':
      case 'padDown':
      case 'padLeft':
      case 'padRight':
        // spatial navigation
        inputEvents.push({
          type: 'keyDown',
          keyCode: action.replace(/pad|leftStick/, ''),
        })
        inputEvents.push({
          type: 'keyUp',
          keyCode: action.replace(/pad|leftStick/, ''),
        })
        break
      case 'leftClick':
        inputEvents.push({
          type: 'mouseDown',
          button: 'left',
          x: metadata.x,
          y: metadata.y,
        })
        inputEvents.push({
          type: 'mouseUp',
          button: 'left',
          x: metadata.x,
          y: metadata.y,
        })
        break
      case 'rightClick':
        inputEvents.push({
          type: 'mouseDown',
          button: 'right',
          x: metadata.x,
          y: metadata.y,
        })
        inputEvents.push({
          type: 'mouseUp',
          button: 'right',
          x: metadata.x,
          y: metadata.y,
        })
        break
      case 'back':
        mainWindow.webContents.goBack()
        break
      case 'esc':
        inputEvents.push({
          type: 'keyDown',
          keyCode: 'Esc',
        })
        inputEvents.push({
          type: 'keyUp',
          keyCode: 'Esc',
        })
        break
    }

    if (inputEvents.length) {
      inputEvents.forEach((event) =>
        mainWindow.webContents.sendInputEvent(event)
      )
    }
  }),
})
