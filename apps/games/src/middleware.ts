import { NextResponse, type NextRequest } from 'next/server'
// import type { Database } from '@/lib/database.types'
import { createMiddlewareSupabaseClient } from '@supabase/auth-helpers-nextjs'

// export default withClerkMiddleware(() => {
//   return NextResponse.next()
// })

export async function middleware(req: NextRequest) {
  const res = NextResponse.next()
  const supabase = createMiddlewareSupabaseClient<any>({ req, res })
  await supabase.auth.getSession()
  return res
}

// Stop Middleware running on static files
export const config = {
  matcher: '/((?!_next/image|_next/static|favicon.ico).*)',
}
