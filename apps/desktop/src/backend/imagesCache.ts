import { createHash } from 'crypto'
import { join } from 'path'
import url from 'url'
import axios from 'axios'
import { protocol } from 'electron'
import { createWriteStream, existsSync, mkdirSync } from 'graceful-fs'

import { imagesCachePath } from './constants'

export const initImagesCache = () => {
  // make sure we have a folder to store the cache
  if (!existsSync(imagesCachePath)) {
    mkdirSync(imagesCachePath)
  }

  // use a fake protocol for images we want to cache
  protocol.registerFileProtocol('imagecache', (request, callback) => {
    callback({ path: getImageFromCache(request.url) })
  })

  protocol.registerFileProtocol('atom', (request, callback) => {
    const filePath = url.fileURLToPath(
      'file://' + request.url.slice('atom://'.length)
    )
    callback(filePath)
  })
}

const getImageFromCache = (url: string) => {
  const realUrl = url.replace('imagecache://', '')
  // digest of the image url for the file name
  const digest = createHash('sha256').update(realUrl).digest('hex')
  const cachePath = join(imagesCachePath, digest)

  if (!existsSync(cachePath) && realUrl.startsWith('http')) {
    // if not found, download in the background
    axios
      .get(realUrl, { responseType: 'stream' })
      .then((response) => response.data.pipe(createWriteStream(cachePath)))
  }

  return join(cachePath)
}
