import React from 'react'
import { SignIn } from '@clerk/clerk-react'

import { RevealedContextMenu } from '@revealed/ui'

import { api } from '../utils/api'

export function RevealedSignupScreen() {
  // const { data: infoData, error: infoError } =
  //   api.desktop.system.info.useQuery()
  const { data, error } = api.app.all.useQuery()
  // // desktopApi.subscription.useSubscription(undefined, { // const { data } = desktopApi.greeting.useQuery({ name: 'Electron' })
  // //   onData: (data) => {
  // //     console.log(data)
  // //   },
  // // })
  // console.log(infoData, infoError)
  console.log(data, error)

  return (
    <div className='flex h-screen items-center justify-center '>
      <RevealedContextMenu />
      <SignIn />
    </div>
  )
}
