import { useCallback, useEffect, useState } from 'react'

import { supabaseClient } from '../utils/database'

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

// export const useSupabase = <T,>(query: any, watch?: unknown) => {
//   const { session } = useSession()
//   const [result, setResult] = useState<any>({
//     data: undefined,
//     error: undefined,
//   })
//   const [loading, setLoading] = useState(false)

//   const loadData = useCallback(async () => {
//     setLoading(true)

//     const token = await session?.getToken({ template: 'supabase' })
//     const client = supabaseClient(token ?? '')

//     try {
//       const result = await query
//       setResult(result)
//       if (result?.error) console.error(result?.error)
//       setLoading(false)
//     } catch (error) {
//       if (error) console.error(error)
//       setLoading(false)
//     }
//   }, [query, getToken])

//   useEffect(() => {
//     void loadData()
//   }, [loadData, watch])

//   return { ...result, loading, reload: loadData }
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
//   const isAdmin =
//     user?.role === 'admin' || user?.email?.includes('@bunnystrike.com')
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
