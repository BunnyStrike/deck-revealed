// import { PutObjectCommand, S3 } from '@aws-sdk/client-s3'

import { supabaseClient } from './database'

// import { getEnvVar } from './envVar'

// console.log(
//   "getEnvVar('VITE_SPACES_ACCESS_KEY_ID')",
//   getEnvVar('VITE_SPACES_ACCESS_KEY_ID')
// )
// export const s3Client = new S3({
//   forcePathStyle: false, // Configures to use subdomain/virtual calling format.
//   endpoint: 'https://sfo3.digitaloceanspaces.com',
//   region: 'us-east-1',
//   credentials: {
//     accessKeyId: getEnvVar('VITE_SPACES_ACCESS_KEY_ID'),
//     secretAccessKey: getEnvVar('VITE_SPACES_SECRET_ACCESS_KEY'),
//   },
// })

// export const uploadFile = async (file: File, path = 'apps', name?: string) => {
//   name ??= file.name
//   const fileType = file.type.split('/')[0]
//   try {
//     const data = await s3Client.send(
//       new PutObjectCommand({
//         Bucket: 'revealed-media',
//         Key: `${path}/${name}.${fileType}`,
//         Body: file,
//       })
//     )

//     return data
//   } catch (err) {
//     console.log('Error', err)
//   }
// }

export const uploadFile = async (
  file: File,
  bucket = 'apps',
  path?: string,
  name?: string
) => {
  name ??= file.name
  const fileType = file.type.split('/')[0]
  const { data, error } = await supabaseClient.storage
    .from(bucket)
    .upload(`${path}/${name}.${fileType}`, file, {
      cacheControl: '3600',
      upsert: true,
    })

  return { data, error }
}
