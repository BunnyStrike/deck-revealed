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
import { spawn } from 'child_process'

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

      const { data: releases } = await axios.default.get(
        `${GITHUB_API}`
        // `${GITHUB_API}/tags/v${current}`
      )

      console.log(releases)

      const release = releases[0]

      return {
        ...release,
        updateAvailable: !release?.tag_name?.includes(current),
      } as Release
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
  updateApp: publicProcedure.mutation(() => {
    spawn('sh', [`
      #!/bin/bash

      set -eo pipefail
      
      REVEALED_GITHUB_URL="https://api.github.com/repos/BunnyStrike/revealed/releases/latest"
      REVEALED_URL="$(curl -s \${REVEALED_GITHUB_URL} | grep -E 'browser_download_url.*AppImage' | cut -d '"' -f 4)"
      
      APP_IMAGE_LAUNCHER_URL="https://github.com/TheAssassin/AppImageLauncher/releases/download/v2.2.0/appimagelauncher-lite-2.2.0-travis995-0f91801-x86_64.AppImage"
      
      report_error() {
          FAILURE="$(caller): \${BASH_COMMAND}"
          echo "Something went wrong!"
          echo "Error at \${FAILURE}"
      }
      
      trap report_error ERR
      
      # Kill DeckRevealed if it is running
      killall -9 -q revealed || :
      kill $(pgrep -f /home/deck/Applications/Revealed.AppImage) || :
      
      # Installs Chrome and allows controller support
      # flatpak install --system -y com.google.Chrome
      # flatpak --user override --filesystem=/run/udev:ro com.google.Chrome
      
      # Download and install DeckRevealed
      curl -L "\${REVEALED_URL}" -o ~/Applications/Revealed.AppImage 2>&1 | stdbuf -oL tr '\r' '\n' | sed -u 's/^ *\([0-9][0-9]*\).*\( [0-9].*$\)/\1\n#Download Speed\:\2/' | zenity --progress --title "Downloading Revealed App" --width 600 --auto-close --no-cancel 2>/dev/null
      chmod +x ~/Applications/Revealed.AppImage
      ~/Applications/Revealed.AppImage
    `])
  }),
})
