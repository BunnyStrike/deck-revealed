import axios from 'axios'

import { GamesDBInfo } from '~/common/types'
import { logError } from '../../../logger/logger'
import { getInfoFromGamesDB } from '../utils'
import testData from './test-data.json'

jest.mock('backend/logger/logfile')
jest.mock('backend/logger/logger')
jest.mock('electron-store')

describe('getInfoFromGamesDB', () => {
  test('fetches successfully', async () => {
    jest.spyOn(axios, 'get').mockResolvedValue({
      data: testData,
    })

    const result = await getInfoFromGamesDB('Jotun', 'Grouse', 'legendary')
    expect(result).toStrictEqual(testGamesDBInfo)
  })

  test('skip not supported runner', async () => {
    jest.spyOn(axios, 'get').mockResolvedValue({
      data: testData,
    })

    const result = await getInfoFromGamesDB('Jotun', 'Grouse', 'sideload')
    expect(result).toStrictEqual({ steamID: '' })
  })

  test('catches axios throws', async () => {
    jest.spyOn(axios, 'get').mockRejectedValueOnce(new Error('Failed'))

    const result = await getInfoFromGamesDB('Jotun', 'Grouse', 'legendary')
    expect(result).toStrictEqual({ steamID: '' })
    expect(logError).toBeCalledWith(
      ['Was not able to get GamesDB data for Grouse'],
      'ExtraGameInfo'
    )
  })
})

const testGamesDBInfo = {
  steamID: '323580',
} as GamesDBInfo
