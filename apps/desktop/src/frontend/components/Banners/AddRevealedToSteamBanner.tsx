import React, { useEffect, useState } from 'react'
import { XMarkIcon } from '@heroicons/react/20/solid'
import { api } from 'frontend/utils/api'

export function AddRevealedToSteamBanner() {
  const { data: isAddedToSteam } = api.desktop.steam.isAddedToSteam.useQuery({
    title: 'Revealed',
  })
  const { mutate } = api.desktop.steam.addRevealedToSteam.useMutation()
  const [showAdd, setShowAdd] = useState(false)

  useEffect(() => {
    const ignore = JSON.parse(
      localStorage.getItem('ignoreAddToSteam') ?? 'true'
    )
    setShowAdd(ignore)
  }, [])

  const handleAddToSteam = () => {
    mutate()
    localStorage.setItem('ignoreAddToSteam', JSON.stringify(false))
    setShowAdd(false)
  }

  const handleIgnore = () => {
    // mutate()
    localStorage.setItem('ignoreAddToSteam', JSON.stringify(false))
    setShowAdd(false)
  }

  console.log(showAdd)

  if (isAddedToSteam || !showAdd) {
    return null
  }

  return (
    <div className='relative isolate flex items-center gap-x-6 overflow-hidden bg-gray-50 px-6 py-2.5 sm:px-3.5 sm:before:flex-1'>
      <div
        className='absolute left-[max(-7rem,calc(50%-52rem))] top-1/2 -z-10 -translate-y-1/2 transform-gpu blur-2xl'
        aria-hidden='true'
      >
        <div
          className='aspect-[577/310] w-[36.0625rem] bg-gradient-to-r from-[#ff80b5] to-[#9089fc] opacity-30'
          style={{
            clipPath:
              'polygon(74.8% 41.9%, 97.2% 73.2%, 100% 34.9%, 92.5% 0.4%, 87.5% 0%, 75% 28.6%, 58.5% 54.6%, 50.1% 56.8%, 46.9% 44%, 48.3% 17.4%, 24.7% 53.9%, 0% 27.9%, 11.9% 74.2%, 24.9% 54.1%, 68.6% 100%, 74.8% 41.9%)',
          }}
        />
      </div>
      <div
        className='absolute left-[max(45rem,calc(50%+8rem))] top-1/2 -z-10 -translate-y-1/2 transform-gpu blur-2xl'
        aria-hidden='true'
      >
        <div
          className='aspect-[577/310] w-[36.0625rem] bg-gradient-to-r from-[#ff80b5] to-[#9089fc] opacity-30'
          style={{
            clipPath:
              'polygon(74.8% 41.9%, 97.2% 73.2%, 100% 34.9%, 92.5% 0.4%, 87.5% 0%, 75% 28.6%, 58.5% 54.6%, 50.1% 56.8%, 46.9% 44%, 48.3% 17.4%, 24.7% 53.9%, 0% 27.9%, 11.9% 74.2%, 24.9% 54.1%, 68.6% 100%, 74.8% 41.9%)',
          }}
        />
      </div>
      <div className='flex flex-wrap items-center gap-x-4 gap-y-2'>
        <p className='text-sm leading-6 text-gray-900'>
          <strong className='font-semibold'>Add To Steam</strong>
          <svg
            viewBox='0 0 2 2'
            className='mx-2 inline h-0.5 w-0.5 fill-current'
            aria-hidden='true'
          >
            <circle cx={1} cy={1} r={1} />
          </svg>
          Makes launching the app easier from Game Mode
        </p>
        <a
          onClick={() => handleAddToSteam()}
          className='flex-none rounded-full bg-gray-900 px-3.5 py-1 text-sm font-semibold text-white shadow-sm hover:bg-gray-700 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-gray-900'
        >
          Add Now <span aria-hidden='true'>&rarr;</span>
        </a>
      </div>
      <div className='flex flex-1 justify-end'>
        <button
          type='button'
          onClick={() => handleIgnore()}
          className='-m-3 p-3 focus-visible:outline-offset-[-4px]'
        >
          <span className='sr-only'>Dismiss</span>
          <XMarkIcon className='h-5 w-5 text-gray-900' aria-hidden='true' />
        </button>
      </div>
    </div>
  )
}

export default AddRevealedToSteamBanner
