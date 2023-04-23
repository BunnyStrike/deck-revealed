import { TypeCheckedStoreBackend } from '../electronStore'

export const wikiGameInfoStore = new TypeCheckedStoreBackend('wikigameinfo', {
  cwd: 'store',
  name: 'wikigameinfo',
  clearInvalidConfig: true,
})
