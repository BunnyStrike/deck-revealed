import React from 'react'
import { useAtom } from 'jotai'

import { modalsAtom } from '../states'
import DialogModal from './Dialog'

interface AddGameModalProps {
  type?: 'Add' | 'Edit'
  actionButton?: React.ReactNode
}

export const AddGameModal = ({
  type = 'Add',
  actionButton,
}: AddGameModalProps) => {
  const [modals, setModals] = useAtom(modalsAtom)

  const handleSave = () => {
    setModals((prev) => ({ ...prev, showAddGame: true }))
  }

  return (
    <DialogModal
      title={`${type} Game`}
      button={
        actionButton || (
          <button className='btn btn-primary mr-4 mt-4'>{type} Game</button>
        )
      }
      onSave={handleSave}
    ></DialogModal>
  )
}
export default AddGameModal
