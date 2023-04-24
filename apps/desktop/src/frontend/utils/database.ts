// import { Database } from '../../common/types/database.types'
import { createClient } from '@supabase/supabase-js'

import { getEnvVar } from './'
import { uploadFile } from './file'

// import { useShallowEffect, useDebouncedState } from '@mantine/hooks'

// declare const process: any
// @ts-ignore
const env = import.meta.env ?? {} //?? process?.env ?? {}

const apiSupabaseURL =
  env.VITE_PUBLIC_SUPABASE_URL || env.VITE_SUPABASE_URL || env.SUPABASE_URL
const apiKey =
  env.VITE_PUBLIC_SUPABASE_ANON_KEY ||
  env.VITE_SUPABASE_API_SECRET_KEY ||
  env.SUPABASE_SERVICE_ROLE_KEY ||
  env.NEXT_PUBLIC_SUPABASE_ANON_KEY ||
  env.SUPABASE_API_SECRET_KEY

const apiSupabaseId = getEnvVar('VITE_SUPABASE_ID')

export const supabaseClient = (supabaseAccessToken?: string) =>
  createClient(apiSupabaseURL, apiKey, {
    global: supabaseAccessToken
      ? { headers: { Authorization: `Bearer ${supabaseAccessToken}` } }
      : {},
    // <Database>
    db: {
      schema: 'public',
    },
    auth: {
      // storage: AsyncStorage,
      autoRefreshToken: true,
      persistSession: true,
      detectSessionInUrl: true,
    },
  })

export type PermissionLevel = 'any' | 'user' | 'member' | 'admin'

export const getFormatedDate = (date: string | number | Date) => {
  return new Date(date).toLocaleDateString('en-us', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  })
}

export const filterArray = (arr1: any, arr2: any) => {
  const filtered = arr1.filter((el: any) => {
    return !arr2.includes(el)
  })
  return filtered
}

export const difference = (arr1: any, arr2: any) =>
  arr1.filter((x: any) => !arr2.includes(x))

export const getFileUrl = (id: string) => {
  return `https://${apiSupabaseId}.nhost.run/v1/storage/files/${id}`
}

export const getMediaUrl = (filePath?: string | null, bucket = 'apps') => {
  if (!filePath) return ''
  const { data } = supabaseClient().storage.from(bucket).getPublicUrl(filePath)
  return data.publicUrl
}

export async function syncDBs(mutate: any) {
  // const supabaseOldClient = createClient(
  //   'https://thnfdwdttxqjouofsgmq.supabase.co',
  //   'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InRobmZkd2R0dHhxam91b2ZzZ21xIiwicm9sZSI6ImFub24iLCJpYXQiOjE2NjYyOTY5NjAsImV4cCI6MTk4MTg3Mjk2MH0.KAzhyKqlocidDpt9qXrWrhpixdvF9bQKm01VRNsZBJw',
  //   {
  //     // <Database>
  //     db: {
  //       schema: 'public',
  //     },
  //     auth: {
  //       // storage: AsyncStorage,
  //       autoRefreshToken: true,
  //       persistSession: true,
  //       detectSessionInUrl: true,
  //     },
  //   }
  // )
  // const { data } = await supabaseOldClient.from('steam_deck_app').select('*')
  // const appMapped = data
  //   ?.filter((item) => !item.user_id)
  //   .map((item) => ({
  //     id: item.id,
  //     name: item.name,
  //     description: item.description,
  //     coverUrl: `images/${item.id}/cover.png`, //item.mediaPath,
  //     category: item.category,
  //     source: item.sourceUrl ?? item.url ?? item.link,
  //     authorName: item.authorName,
  //     authorUrl: item.authorUrl,
  //     updatedAt: item.updatedAt,
  //     createdAt: item.createdAt,
  //     type: 'PUBLISHED',
  //   }))
  // console.log(appMapped)
  // console.log(data)
  // const { data: appData = [], error } = await supabaseClient()
  //   .from('App')
  //   .upsert(appMapped)
  // console.log(error)
  // const dataImagePromises = data
  //   ?.filter((item) => !item.user_id)
  //   .map(async (item: any) => {
  //     if (!item.mediaPath) return
  //     console.log(item)
  //     // supabaseClient.storage.from(bucket).getPublicUrl(filePath)
  //     const res = await supabaseOldClient.storage
  //       .from('media')
  //       .download(item?.mediaPath ?? '')
  //     console.log(res)
  //     // uploadFile(res.blob, 'apps', '')
  //     const { data, error } = await supabaseClient()
  //       .storage.from('apps')
  //       .upload(`images/${item.id}/cover.png`, res.data as any, {
  //         cacheControl: '3600',
  //         upsert: true,
  //       })
  //     console.log(data, error)
  //     return data
  //   })
  // await Promise.all(dataImagePromises)
  // mutate(appMapped)
  // const { error } = await supabaseClient().from('App').upsert(appMapped)
  // console.log(error)
}

// export type Profile = Database['public']['Tables']['profiles']['Row']

// export const getUserProfile = async (userId: string) => {
//   const { data, error } = await supabaseClient.from('profiles').select().eq('id', userId).single()
//   if (error) {
//     console.log(error)
//   } else if (!!data) {
//     return data as Profile
//   }
//   return null
// }

// export const getCurrentUserProfile = async () => {
//   const user = await supabaseClient.auth.getUser()
//   if (!user.data.user?.id) return null
//   return await getUserProfile(user.data.user.id)
// }

// export const useAccount = (supabase?: SupabaseClient) => {
//   const user = useUser()
//   // const [profile, setProfile] = useState<Profile | undefined | null>(cachedProfile)
//   const [profile, setProfile] = useRecoilState(profileState)
//   const [loading, setLoading] = useState<boolean>(false)
//   const isAdmin = user?.role === 'admin' || user?.email?.includes('@bunnystrike.com')
//   const isPaidMember = user?.role === 'member'
//   const isUser = !!user?.id

//   useEffect(() => {
//     if (!user?.id || profile || loading) return
//     setLoading(true)
//     supabase
//       ?.from('profiles')
//       .select()
//       .eq('id', user?.id)
//       .single()
//       .then(({ data, error }) => {
//         if (error) {
//           console.log(error)
//         } else if (!!data) {
//           setProfile(data as Profile)
//         }
//         setLoading(false)
//       })
//   }, [supabase, user])

//   const hasPermission = (level: PermissionLevel) => {
//     switch (level) {
//       case 'admin':
//         return isAdmin
//       case 'member':
//         return isPaidMember
//       case 'user':
//         return isUser
//       case 'any':
//       default:
//         return true
//     }
//   }

//   return { user, isAdmin, isPaidMember, profile, hasPermission }
// }

// export const useMediaUrl = (filePath: string, bucket = 'media') => {
//   const { data } = supabaseClient.storage.from(bucket).getPublicUrl(filePath)
//   return data.publicUrl
// }

// export const useSupaQuery = <T>(query: any, watch?: unknown) => {
//   const [result, setResult] = useState<any>({
//     data: undefined,
//     error: undefined,
//   })
//   const [loading, setLoading] = useState(false)

//   useEffect(() => {
//     loadData()
//   }, [watch])

//   const loadData = async () => {
//     setLoading(true)
//     try {
//       const result = await query
//       setResult(result)
//       if (result?.error) console.error(result?.error)
//       setLoading(false)
//     } catch (error) {
//       if (error) console.error(error)
//       setLoading(false)
//     }
//   }

//   return { ...result, loading, reload: loadData }
// }

// export const useSupabase = () => {
//   const supabase = useSupabaseClient<Database>()
//   const account = useAccount(supabase)

//   const getMediaUrl = (filePath: string, bucket = 'media') => {
//     const { data } = supabase.storage.from(bucket).getPublicUrl(filePath)
//     return data.publicUrl
//   }

//   return {
//     supabase,
//     account,
//     profile: account.profile,
//     userId: account?.user?.id,
//     getMediaUrl,
//   }
// }

// export const getSsrUserId = (req: any) => {
//   let userId
//   if (req?.cookies['supabase-auth-token']) {
//     const auth = JSON.parse(req.cookies['supabase-auth-token'] ?? '')
//     userId = auth?.user?.id
//   }

//   return userId
// }

// export const getSsrUser = (req: any) => {
//   let user: any = {}
//   if (req?.cookies['supabase-auth-token']) {
//     const auth = JSON.parse(req.cookies['supabase-auth-token'] ?? '')
//     user = auth?.user ?? {}
//   }
//   const isAdmin = user?.role === 'admin' || user?.email?.includes('@bunnystrike.com')
//   const isPaidMember = user?.role === 'member'
//   const isUser = !!user?.id

//   return {
//     ...user,
//     userId: user?.id,
//     isAdmin,
//     isPaidMember,
//     isUser,
//     role: user?.role,
//   }
// }

// interface SupaQueryBuilderProps {
//   table?: string | null
//   searchTerm?: string
//   selectQuery?: string
//   searchField?: string
//   limit?: number
//   page?: number
//   order?: { column: string; ascending: boolean }[]
//   filter?: any[]
// }

// export const useSupaQueryBuilder = ({
//   table,
//   limit = 10,
//   page = 0,
//   searchField = 'name',
//   selectQuery = '*',
//   order = [],
//   filter = [],
// }: SupaQueryBuilderProps) => {
//   const { supabase } = useSupabase()
//   const [searchValue, setSearchValue] = useDebouncedState('', 1000)
//   const [result, setResult] = useState<any>({
//     data: undefined,
//     error: undefined,
//   })
//   const [loading, setLoading] = useState(false)

//   useShallowEffect(() => {
//     if (table) {
//       loadData()
//     }
//   }, [page, limit, searchField, selectQuery, order, filter])

//   useEffect(() => {
//     loadData(searchValue)
//   }, [searchValue])

//   const loadData = async (searchTermField?: string) => {
//     if (!table) return
//     setLoading(true)
//     try {
//       let query = supabase.from(table).select(selectQuery)
//       if (searchTermField) {
//         query = query.ilike(searchField, `%${searchTermField}%`)
//       }
//       if (page) {
//         query = query.range(0, limit - 1)
//       }
//       if (order) {
//         order.forEach((f) => {
//           query = query.order(f.column, {
//             ascending: f.ascending ?? false,
//             nullsFirst: false,
//           })
//         })
//       } else {
//         query = query.order('createdAt', {
//           ascending: false,
//           nullsFirst: false,
//         })
//       }

//       if (filter) {
//         filter.forEach((f) => {
//           query = query.eq(f.field, f.value)
//         })
//       }

//       const queryResult = await query.limit(limit)
//       setResult(queryResult)
//       if (result?.error) console.error(queryResult?.error)
//       setLoading(false)
//     } catch (error) {
//       if (error) console.error(error)
//       setLoading(false)
//     }
//   }

//   const search = (searchTermField = '') => {
//     setLoading(true)
//     setSearchValue(searchTermField)
//   }

//   return {
//     ...result,
//     loading,
//     reload: loadData,
//     search,
//   }
// }
