import React, { useEffect } from 'react'

// import Uppy from '@uppy/core'
// import { Dashboard } from '@uppy/react'

// // Don't forget the CSS: core and the UI components + plugins you are using.
// import '@uppy/core/dist/style.min.css'
// import '@uppy/dashboard/dist/style.min.css'
// import '@uppy/webcam/dist/style.min.css'

// Don’t forget to keep the Uppy instance outside of your component.
// const uppy = new Uppy().use(Webcam)

export function UploadButton() {
  return <input type='file' className='file-input w-full max-w-xs' />
}
