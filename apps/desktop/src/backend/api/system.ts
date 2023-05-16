import { platform } from 'os'
import * as axios from 'axios'
import { BrowserWindow, app } from 'electron'
import { z } from 'zod'

import { type GamepadInputEvent, type Release } from '~/common/types'
import { GlobalConfig } from '../configs/config'
import {
  GITHUB_API,
  customThemesWikiLink,
  discordLink,
  epicLoginUrl,
  isLinux,
  isMac,
  isSteamDeckGameMode,
  isSteamos,
  isWindows,
  kofiPage,
  patreonPage,
  revealedGithubURL,
  sidInfoUrl,
  supportURL,
  weblateUrl,
  wikiLink,
  wineprefixFAQ,
} from '../constants'
import { LogPrefix, logError, logInfo } from '../logger/logger'
import { clearCache } from '../utils'
import { openUrlOrFile } from '../utils/openUrlOrFile'
import { getSystemInfo } from '../utils/systemInfo'
import { getLatestReleases } from '../utils/version'
import { getMainWindow } from '../windows/mainWindow'
import { showAboutWindow } from '../windows/showAboutWindow'
import { createTRPCRouter, publicProcedure } from './trpc'

// Simulate keyboard and mouse actions as if the real input device is used
export const system = createTRPCRouter({
  openExternalUrl: publicProcedure
    .input(z.object({ url: z.string().url().nonempty() }))
    .mutation((req) => openUrlOrFile(req.input.url)),
  openFolder: publicProcedure
    .input(z.object({ folder: z.string().nonempty() }))
    .mutation((req) => openUrlOrFile(req.input.folder)),
  openWebviewPage: publicProcedure
    .input(z.object({ url: z.string().nonempty() }))
    .mutation((req) => openUrlOrFile(req.input.url)),
  openSupportPage: publicProcedure.mutation(() => openUrlOrFile(supportURL)),
  openReleases: publicProcedure.mutation(() =>
    openUrlOrFile(revealedGithubURL)
  ),
  openWeblate: publicProcedure.mutation(() => openUrlOrFile(weblateUrl)),
  showAboutWindow: publicProcedure.mutation(() => showAboutWindow()),
  openLoginPage: publicProcedure.mutation(() => openUrlOrFile(epicLoginUrl)),
  openDiscordLink: publicProcedure.mutation(() => openUrlOrFile(discordLink)),
  openPatreonPage: publicProcedure.mutation(() => openUrlOrFile(patreonPage)),
  openKofiPage: publicProcedure.mutation(() => openUrlOrFile(kofiPage)),
  openWinePrefixFAQ: publicProcedure.mutation(() =>
    openUrlOrFile(wineprefixFAQ)
  ),
  openWikiLink: publicProcedure.mutation(() => openUrlOrFile(wikiLink)),
  openSidInfoPage: publicProcedure.mutation(() => openUrlOrFile(sidInfoUrl)),
  info: publicProcedure.query(() => getSystemInfo()),
  openCustomThemesWiki: publicProcedure.mutation(() =>
    openUrlOrFile(customThemesWikiLink)
  ),
  createNewWindow: publicProcedure
    .input(z.object({ url: z.string().url().nonempty() }))
    .mutation((req) =>
      new BrowserWindow({ height: 700, width: 1200 }).loadURL(req.input.url)
    ),
  clearCache: publicProcedure
    .input(
      z
        .object({ showDialog: z.boolean().default(false) })
        .default({ showDialog: false })
    )
    .mutation(({ input }) => clearCache(input.showDialog)),
  getRevealedVersion: publicProcedure.query(() => app.getVersion()),
  getLatestReleases: publicProcedure.query(() => {
    const { checkForUpdatesOnStartup } = GlobalConfig.get().getSettings()
    if (checkForUpdatesOnStartup) {
      return getLatestReleases()
    } else {
      return []
    }
  }),
  getCurrentChangelog: publicProcedure.query(async () => {
    logInfo('Checking for current version changelog', LogPrefix.Backend)

    try {
      const current = app.getVersion()

      const { data: release } = await axios.default.get(
        `${GITHUB_API}/tags/v${current}`
      )

      return release as Release
    } catch (error) {
      logError(
        ['Error when checking for current Revealed changelog'],
        LogPrefix.Backend
      )
      return null
    }
  }),
  platform: publicProcedure.query(() => {
    return {
      platform: platform(),
      isMac,
      isWindows,
      isLinux,
      isSteamos,
      isSteamDeckGameMode,
    }
  }),
})
