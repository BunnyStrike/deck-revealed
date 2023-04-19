import { BrowserWindow } from 'electron'
import { z } from 'zod'

import { type GamepadInputEvent } from '~/common/types'
import {
  customThemesWikiLink,
  discordLink,
  epicLoginUrl,
  kofiPage,
  patreonPage,
  revealedGithubURL,
  sidInfoUrl,
  supportURL,
  weblateUrl,
  wikiLink,
  wineprefixFAQ,
} from '../constants'
import { openUrlOrFile } from '../utils/openUrlOrFile'
import { getSystemInfo } from '../utils/systemInfo'
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
})
