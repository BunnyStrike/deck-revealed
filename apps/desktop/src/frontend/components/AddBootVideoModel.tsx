import React from 'react'
import { useAtom } from 'jotai'

import { modalsAtom } from '../states'
import DialogModal from './Dialog'

export const AddBootVideoModal = () => {
  const [modals, setModals] = useAtom(modalsAtom)

  return <DialogModal />
}

export default AddBootVideoModal
