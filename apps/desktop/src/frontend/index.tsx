import React, { useState } from 'react'
import { ClerkProvider } from '@clerk/clerk-react'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { createTRPCReact } from '@trpc/react-query'
import { ipcLink } from 'electron-trpc/renderer'
import { Provider } from 'jotai'
import ReactDom from 'react-dom'
import superjson from 'superjson'

import type { AppRouter } from '../backend/api'
import { api, apiCLient, apiQueryClient } from './utils/api'
import { getEnvVar } from './utils/envVar'

const trpcReact = createTRPCReact<AppRouter>()

const clerkPubKey = getEnvVar('VITE_PUBLIC_CLERK_PUBLISHABLE_KEY')

function App() {
  const [queryClient] = useState(() => new QueryClient())
  const [trpcClient] = useState(() =>
    trpcReact.createClient({
      links: [ipcLink()],
      transformer: superjson,
    })
  )
  const [qpiQueryClientState] = useState(apiQueryClient)
  const [trpcClientState] = useState(apiCLient)

  return (
    <ClerkProvider publishableKey={clerkPubKey}>
      <Provider>
        <api.Provider
          client={trpcClientState}
          queryClient={qpiQueryClientState}
        >
          <trpcReact.Provider client={trpcClient} queryClient={queryClient}>
            <QueryClientProvider client={queryClient}>
              <HelloElectron />
            </QueryClientProvider>
          </trpcReact.Provider>
        </api.Provider>
      </Provider>
    </ClerkProvider>
  )
}

function HelloElectron() {
  const { data } = trpcReact.greeting.useQuery({ name: 'Electron' })
  trpcReact.subscription.useSubscription(undefined, {
    onData: (data) => {
      console.log(data)
    },
  })

  if (!data) {
    return null
  }

  return <div>{data.text}</div>
}

ReactDom.render(<App />, document.getElementById('react-root'))
