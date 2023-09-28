import { useState } from 'react'
import type { NextPage } from 'next'
import Head from 'next/head'

import { Button, FormInputField } from '@revealed/ui'

import { api, type RouterOutputs } from '~/utils/api'

const ClaimCodeView = ({ claimCode }: any) => {
  const [hasClaimed, setHasClaimed] = useState(false)
  const { data, isLoading, error, refetch } =
    api.prize.viewPrizeFromClaimCode.useQuery({
      id: claimCode,
    })

  const {
    mutateAsync: claim,
    error: errorUpdate,
    isLoading: isLoadingUpdate,
  } = api.prize.claim.useMutation()

  if (isLoading) return <div>Loading...</div>

  if (data?.claimedAt || !data)
    return <h3 className='text-lg leading-3'>Already claimed</h3>

  if (error) return <h3 className='text-lg leading-3'>{error.message}</h3>

  const handleClaimCode = async () => {
    try {
      await claim({ id: claimCode })
      setHasClaimed(true)
    } catch (error) {
      console.log(error)
      await refetch()
    }
  }

  return (
    <div>
      <h4>{data?.name}</h4>

      {!hasClaimed ? (
        <Button onClick={handleClaimCode}>Claim Game</Button>
      ) : (
        <div> Congrats! You have now claimed this Steam Key </div>
      )}
    </div>
  )
}

const Home: NextPage = () => {
  const [claimCode, setClaimCode] = useState('')

  const submitClaimCode = async (event: {
    currentTarget: HTMLFormElement | undefined
    preventDefault: () => void
  }) => {
    event.preventDefault()
    const data = Object.fromEntries(new FormData(event.currentTarget))
    if (data.claimCode) {
      setClaimCode(data.claimCode as string)
    }
  }

  return (
    <>
      <Head>
        <title>Revealed</title>
        <meta
          name='description'
          content='The all-in-one tool for your Steam Deck. Enjoy your favorite apps, manage your games, launch Game Mode. Sign up to be notified soon.'
        />
      </Head>
      <main>
        <div className='flex min-h-full flex-1 flex-col justify-center py-12 sm:px-6 lg:px-8'>
          <div className='sm:mx-auto sm:w-full sm:max-w-md'>
            <h2 className='mt-6 text-center text-2xl font-bold leading-9 tracking-tight text-white'>
              Games Revealed
            </h2>
            <p className='max-w mt-2 text-center text-sm leading-5 text-white'>
              Enter your code to validate your prize
            </p>
          </div>

          <div className='mt-10 sm:mx-auto sm:w-full sm:max-w-[480px]'>
            <div className='bg-gray-700 px-6 py-12 shadow sm:rounded-lg sm:px-12'>
              {claimCode ? (
                <ClaimCodeView claimCode={claimCode} />
              ) : (
                <form onSubmit={submitClaimCode}>
                  <FormInputField
                    title='Enter Code Here'
                    placeholder='Adsfk9ewmn (example)'
                    fieldName='claimCode'
                  />
                  <div className='mt-7 flex justify-end'>
                    <Button>Submit</Button>
                  </div>
                </form>
              )}
            </div>
          </div>
        </div>
      </main>
    </>
  )
}

export default Home
