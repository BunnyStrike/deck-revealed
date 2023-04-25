import React, { useState } from 'react'
import classNames from 'classnames'

type FileUploadCardProps = {
  selectedPreview?: string | undefined | null
  onSelectedFile: (file?: File) => void
  title?: string
  className?: string
}

export const FileUploadCard = ({
  selectedPreview,
  onSelectedFile,
  title = 'Select a file',
  className,
}: FileUploadCardProps) => {
  const [preview, setPreview] = useState<string | undefined>()

  const handleFileSelected = (file?: File) => {
    if (!file) return
    if (onSelectedFile) onSelectedFile(file)
    setPreview(URL.createObjectURL(file))
  }

  return (
    <div className={classNames('overflow-hidden rounded-lg', className)}>
      <div className='px-2 py-3 sm:p-2'>
        {preview || selectedPreview ? (
          <div className='bg-grey-lighter flex w-full items-center justify-center'>
            <label className='text-blue border-blue hover:bg-blue flex w-64 cursor-pointer flex-col items-center rounded-lg border bg-white uppercase tracking-wide shadow-lg hover:text-white'>
              <img
                src={preview ?? selectedPreview ?? 'public/img/steam-pill.jpg'}
                className='rounded-lg bg-cover bg-center'
                alt='Cover Image'
              />
              <input
                type='file'
                className='hidden'
                onChange={(e) => {
                  if (e.target.files?.length) {
                    handleFileSelected(e.target.files[0])
                  }
                }}
              />
            </label>
          </div>
        ) : (
          <div className='bg-grey-lighter flex w-full items-center justify-center'>
            <label className='text-blue border-blue hover:bg-blue flex w-full cursor-pointer flex-col items-center rounded-lg border bg-gray-700  px-4 py-6 uppercase tracking-wide shadow-lg hover:text-white'>
              <svg
                className='h-8 w-8'
                fill='currentColor'
                xmlns='http://www.w3.org/2000/svg'
                viewBox='0 0 20 20'
              >
                <path d='M16.88 9.1A4 4 0 0 1 16 17H5a5 5 0 0 1-1-9.9V7a3 3 0 0 1 4.52-2.59A4.98 4.98 0 0 1 17 8c0 .38-.04.74-.12 1.1zM11 11h3l-4-4-4 4h3v3h2v-3z' />
              </svg>
              <span className='mt-2 text-base leading-normal'>{title}</span>
              <input
                type='file'
                className='hidden'
                onChange={(e) => {
                  if (e.target.files?.length) {
                    handleFileSelected(e.target.files[0])
                  }
                }}
              />
            </label>
          </div>
        )}
      </div>
      {/* <div className='bg-gray-500 px-4 py-4 sm:px-6'>
        {selectedBannerPreview ? (
          <div className='bg-grey-lighter flex w-full items-center justify-center'>
            <label className='text-blue border-blue hover:bg-blue flex w-64 cursor-pointer flex-col items-center rounded-lg border bg-white  uppercase tracking-wide shadow-lg hover:text-white'>
              <img
                src={selectedBannerPreview ?? 'public/img/steam-pill.jpg'}
                className='rounded-lg bg-cover bg-center'
                alt='Banner Image'
              />
              <input
                type='file'
                className='hidden'
                onChange={(e) => {
                  if (e.target.files?.length) {
                    handleBannerSelect(e.target.files[0])
                  }
                }}
              />
            </label>
          </div>
        ) : (
          <div className='bg-grey-lighter flex w-full items-center justify-center'>
            <label className='text-blue border-blue hover:bg-blue flex w-64 cursor-pointer flex-col items-center rounded-lg border bg-white px-4 py-6 uppercase tracking-wide shadow-lg hover:text-white'>
              <svg
                className='h-8 w-8'
                fill='currentColor'
                xmlns='http://www.w3.org/2000/svg'
                viewBox='0 0 20 20'
              >
                <path d='M16.88 9.1A4 4 0 0 1 16 17H5a5 5 0 0 1-1-9.9V7a3 3 0 0 1 4.52-2.59A4.98 4.98 0 0 1 17 8c0 .38-.04.74-.12 1.1zM11 11h3l-4-4-4 4h3v3h2v-3z' />
              </svg>
              <span className='mt-2 text-base leading-normal'>
                Banner Image
              </span>
              <input
                type='file'
                className='hidden'
                onChange={(e) => {
                  if (e.target.files?.length) {
                    handleBannerSelect(e.target.files[0])
                  }
                }}
              />
            </label>
          </div>
        )}
      </div> */}
    </div>
  )
}
