import { PutObjectCommand, S3 } from '@aws-sdk/client-s3'

import { getEnvVar } from './envVar'

console.log(
  "getEnvVar('VITE_SPACES_ACCESS_KEY_ID')",
  getEnvVar('VITE_SPACES_ACCESS_KEY_ID')
)
export const s3Client = new S3({
  forcePathStyle: false, // Configures to use subdomain/virtual calling format.
  endpoint: 'https://sfo3.digitaloceanspaces.com',
  region: 'us-east-1',
  credentials: {
    accessKeyId: getEnvVar('VITE_SPACES_ACCESS_KEY_ID'),
    secretAccessKey: getEnvVar('VITE_SPACES_SECRET_ACCESS_KEY'),
  },
})

// Specifies a path within your bucket and the file to upload.
export const bucketParams = {
  Bucket: 'apps',
  Key: 'example.txt',
  Body: 'content',
}

export const uploadFile = async (file: File, path = 'apps', name?: string) => {
  name ??= file.name
  const fileType = file.type.split('/')[0]
  try {
    const data = await s3Client.send(
      new PutObjectCommand({
        Bucket: 'revealed-media',
        Key: `${path}/${name}.${fileType}`,
        Body: file,
      })
    )
    console.log(
      'Successfully uploaded object: ' +
        bucketParams.Bucket +
        '/' +
        bucketParams.Key
    )
    return data
  } catch (err) {
    console.log('Error', err)
  }
}
