import { type Runner, type WikiInfo } from '~/common/types'
import { isMac } from '../constants'
import { LogPrefix, logError, logInfo } from '../logger/logger'
import { removeSpecialcharacters } from '../utils'
import { getInfoFromAppleGamingWiki } from './applegamingwiki/utils'
import { wikiGameInfoStore } from './electronStore'
import { getInfoFromGamesDB } from './gamesdb/utils'
import { getHowLongToBeat } from './howlongtobeat/utils'
import { getInfoFromPCGamingWiki } from './pcgamingwiki/utils'

export async function getWikiGameInfo(
  title: string,
  appName: string,
  runner: Runner
): Promise<WikiInfo | null> {
  try {
    title = removeSpecialcharacters(title)

    // check if we have a cached response
    const cachedResponse = wikiGameInfoStore.get_nodefault(title)
    if (cachedResponse) {
      logInfo(
        [`Using cached ExtraGameInfo data for ${title}`],
        LogPrefix.ExtraGameInfo
      )

      const oneMonthAgo = new Date()
      oneMonthAgo.setMonth(oneMonthAgo.getMonth() - 1)

      const timestampLastFetch = new Date(cachedResponse.timestampLastFetch)
      if (timestampLastFetch > oneMonthAgo) {
        return cachedResponse
      }

      logInfo(
        [`Cached ExtraGameInfo data for ${title} outdated.`],
        LogPrefix.ExtraGameInfo
      )
    }

    logInfo(`Getting ExtraGameInfo data for ${title}`, LogPrefix.ExtraGameInfo)

    const [pcgamingwiki, howlongtobeat, gamesdb, applegamingwiki] =
      await Promise.all([
        getInfoFromPCGamingWiki(title, runner === 'gog' ? appName : undefined),
        getHowLongToBeat(title),
        getInfoFromGamesDB(title, appName, runner),
        isMac ? getInfoFromAppleGamingWiki(title) : null,
      ])

    const wikiGameInfo = {
      timestampLastFetch: Date(),
      pcgamingwiki,
      applegamingwiki,
      howlongtobeat,
      gamesdb,
    }

    wikiGameInfoStore.set(title, wikiGameInfo)

    return wikiGameInfo
  } catch (error) {
    logError(
      [`Was not able to get ExtraGameInfo data for ${title}`, error],
      LogPrefix.ExtraGameInfo
    )
    return null
  }
}
