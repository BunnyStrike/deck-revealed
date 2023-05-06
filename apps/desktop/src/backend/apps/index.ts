import { spawn } from 'child_process'
import { supabaseClient } from 'common/database'
import { existsSync } from 'graceful-fs'

import { type AppInfo } from '~/common/types/app.types'
import { type SteamOSBootVideo } from '~/common/types/steamos'
import { type AppDoc } from '../api/apps'

export const uninstallFlatpak = async (app: AppDoc) => {
  spawn(`flatpak`, ['uninstall', '-y', 'flathub', app.source || ''])
  return true
}

export const uninstallApp = async (app: AppDoc) => {
  // TODO: Add direct app uninstall
  switch (app.runnerType) {
    case 'FLATPAK':
    case 'FLATHUB':
      return uninstallFlatpak(app)
    default:
      return false
  }
}

export const installFlatpak = async (app: AppDoc): Promise<boolean> => {
  try {
    const child = spawn(`flatpak`, [
      'install',
      '-y',
      'flathub',
      app.source || '',
    ])
    return new Promise(async (resolve, reject) => {
      child.stdout.setEncoding('utf8')
      child.stdout.on('data', (data: string) => {
        console.log(data)
      })
      child.stderr.setEncoding('utf8')
      child.stderr.on('data', (data: string) => {
        console.log(data)
      })

      child.on('error', (error) => {
        console.log(error)
        resolve(true)
      })
      child.stdout.on('end', () => {
        console.log('end')
        resolve(true)
      })
    })
  } catch (error) {
    console.log(error)
    return false
  }
}

export const runFlatpakApp = async (app: AppDoc): Promise<boolean> => {
  if (!app.source) return false
  // 'flatpak', ['run', item.installerUrl ?? '']
  if (await isFlatpakInstalled(app.source)) {
    await installFlatpak(app)
  }
  const child = spawn(`flatpak`, ['run', app.source])
  return new Promise(async (resolve, reject) => {
    child.stdout.setEncoding('utf8')
    child.stdout.on('data', (data: string) => {
      console.log(data)
    })
    child.stderr.setEncoding('utf8')
    child.stderr.on('data', (data: string) => {
      console.log(data)
    })

    child.on('error', (error) => {
      console.log(error)
      resolve(true)
    })
    child.stdout.on('end', () => {
      console.log('end')
      resolve(true)
    })
  })
}

export const isFlatpakInstalled = async (source: string): Promise<boolean> => {
  const command = 'info'
  return new Promise((resolve, reject) => {
    const child = spawn(`flatpak`, [command, source])
    child.on('close', (code: number) => {
      resolve(code == 0)
    })
    child.on('error', (error) => {
      reject(false)
    })
  })
}

export const isAppInstalled = async (app: AppDoc): Promise<boolean> => {
  switch (app.runnerType) {
    case 'FLATPAK':
    case 'FLATHUB':
      return await isFlatpakInstalled(app.source || '')
    default:
      // const platform = app.platforms?.find(
      //   (plat) => plat.platform === 'steam deck' || plat.platform === 'linux'
      // )
      // return existsSync(platform?.locationPath ?? '')
      return existsSync(app?.installLocation ?? '')
  }
}

export const runApp = async (app: AppDoc): Promise<boolean> => {
  switch (app.runnerType) {
    case 'FLATPAK':
    case 'FLATHUB':
      return await runFlatpakApp(app)
    default:
      // const platform = app.platform === 'STEAMOS' || app.platform === 'LINUX'
      // ?.find(
      //   (plat) => plat.platform === 'steam deck' || plat.platform === 'linux'
      // )
      spawn(app?.installLocation ?? '', [])
      return true
  }
}

export const installSystemFlatpak = async (app: AppDoc) => {
  const command = 'install'
  spawn(`flatpak`, [command, '--system', '-y', app.source || ''])
  return true
}

const getMediaUrl = (filePath: string, bucket = 'media') => {
  if (filePath == null) return ''
  const result = supabaseClient.storage.from(bucket).getPublicUrl(filePath)
  return result?.data?.publicUrl ?? ''
}

export const installBootVideo = async (app: SteamOSBootVideo) => {
  const mediaUrl = getMediaUrl(app.url, 'media')

  //   const command = `
  //   mkdir -p "\$HOME/.steam/root/config/uioverrides/movies/" &&
  //   cd "\$HOME/.steam/root/config/uioverrides/movies/" &&
  //   wget -O deck_startup.webm --show-progress $mediaUrl
  // `;

  spawn('mkdir', ['-p', '/home/deck/.steam/root/config/uioverrides/movies/'])

  spawn('wget', [
    '-O',
    '/home/deck/.steam/root/config/uioverrides/movies/deck_startup.webm',
    '--show-progress',
    mediaUrl,
  ])
  return true
}

export const installViaScript = async (app: AppDoc) => {
  const password = 'deckme'
  spawn('sh', ['-c', `echo ${password} | sudo -S curl -L ${app.source} | bash`])
  return true
}

export const runScript = async (app: AppDoc): Promise<boolean> => {
  const isInstalled = await isAppInstalled(app)
  switch (app.runnerType) {
    case 'FLATPAK':
    case 'FLATHUB':
      if (isInstalled) {
        return await runFlatpakApp(app)
      }
      return await installFlatpak(app)
    default:
      if (isInstalled) {
        return await runApp(app)
      }
      return await installViaScript(app)
  }
}

// Process.run(item.launcherPath!, ['steam://rungameid/${item.id}']);
